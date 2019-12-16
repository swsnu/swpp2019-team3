"""utils.py"""
# -*- coding: utf-8 -*-

import concurrent.futures
import urllib
import json
import logging
import requests
import xmltodict
from django.core.cache import cache
from django.db.models import Q, Exists, OuterRef, Count, Case, When

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.papers.search import exploit_arxiv, exploit_crossref, __extract_keywords_from_abstract, __parse_and_save_arxiv_info # pylint: disable=line-too-long
from papersfeed.utils.collections.utils import get_collection_paper_count
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.author import Author
from papersfeed.models.papers.keyword import Keyword
from papersfeed.models.papers.paper_author import PaperAuthor
from papersfeed.models.papers.paper_keyword import PaperKeyword
from papersfeed.models.papers.paper_like import PaperLike
from papersfeed.models.papers.paper_publication import PaperPublication
from papersfeed.models.papers.publication import Publication
from papersfeed.models.papers.publisher import Publisher
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection_paper import CollectionPaper

SEARCH_COUNT = 20 # pagination count for searching papers


def select_paper(args):
    """Select Paper"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Paper Id
    paper_id = args[constants.ID]

    # Papers
    papers, _ = __get_papers(Q(id=paper_id), request_user, None)

    # Does Not Exist
    if not papers:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    paper = papers[0]

    return paper


def select_paper_collection(args):
    """Select Collections' Paper"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Collection Id
    collection_id = args[constants.ID]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Papers Queryset
    queryset = CollectionPaper.objects.filter(
        collection_id=collection_id
    )

    # Papers
    collection_papers = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not collection_papers.has_next()

    paper_ids = [collection_paper.paper_id for collection_paper in collection_papers]

    papers, _ = __get_papers(Q(id__in=paper_ids), request_user, 10)

    return papers, page_number, is_finished


# pylint: disable=too-many-locals
def select_paper_search(args):
    """Select Paper Search"""
    is_parameter_exists([
        constants.TEXT
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Search Keyword
    keyword = args[constants.TEXT]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Check cache
    cache_key = keyword + '_' + str(page_number)
    cache_result = cache.get(cache_key)

    if cache_result:
        logging.info("CACHE HIT: %s", cache_key)
        result_ids, paper_ids, external, is_finished = cache_result

    else:
        logging.info("CACHE MISS: %s", cache_key)
        paper_ids = {
            'papersfeed': [], # only used when all external search fails
            'arxiv': [],
            'crossref': [],
        }
        is_finished_dict = {
            'arxiv': False,
            'crossref': False,
        }

        future_to_source = {}
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_source[executor.submit(exploit_arxiv, keyword, page_number)] = 'arxiv'
            future_to_source[executor.submit(exploit_crossref, keyword, page_number)] = 'crossref'
            for future in concurrent.futures.as_completed(future_to_source):
                source = future_to_source[future]
                try:
                    paper_ids[source], is_finished_dict[source] = future.result()
                except Exception as exc: # pylint: disable=broad-except
                    logging.warning("[%s] generated an exception: %s", source, exc)

        external = True
        # if there are both results (len <= SEARCH_RESULT * 2)
        if paper_ids['arxiv'] and paper_ids['crossref']:
            result_ids = paper_ids['arxiv'] + paper_ids['crossref']
            is_finished = is_finished_dict['arxiv'] and is_finished_dict['crossref']

        # if only there are results of Crossref (len <= SEARCH_COUNT)
        elif not paper_ids['arxiv'] and paper_ids['crossref']:
            result_ids = paper_ids['crossref']
            is_finished = is_finished_dict['crossref']

        # if only there are results of arXiv (len <= SEARCH_COUNT)
        elif not paper_ids['crossref'] and paper_ids['arxiv']:
            result_ids = paper_ids['arxiv']
            is_finished = is_finished_dict['arxiv']

        # if cannot get any results from external sources
        else:
            external = False
            logging.info("[naive-search] Searching in PapersFeed DB")

            # Papers Queryset
            queryset = Paper.objects.filter(Q(title__icontains=keyword) | Q(abstract__icontains=keyword)) \
                .values_list('id', 'abstract')

            # Check if the papers have keywords. If not, try extracting keywords this time
            abstracts = {}
            for paper_id, abstract in queryset:
                paper_ids['papersfeed'].append(paper_id)

                if not PaperKeyword.objects.filter(paper_id=paper_id).exists():
                    abstracts[paper_id] = abstract

            if abstracts:
                __extract_keywords_from_abstract(abstracts)

            # Paper Ids
            result_ids = get_results_from_queryset(paper_ids['papersfeed'], SEARCH_COUNT, page_number)
            # is_finished (tentative)
            is_finished = False

        # Cache set
        cache.set(cache_key, (result_ids, paper_ids, external, is_finished))
        logging.info("CACHE SET: %s", cache_key)

    # Papers - Sometimes, there can be duplicated ids in result_ids. Thus, len(papers) < len(result_ids) is possible.
    papers, _, is_finished = __get_papers_search(result_ids, request_user, paper_ids, external, is_finished)
    return papers, page_number, is_finished
# pylint: enable=too-many-locals


# pylint: disable=too-many-locals
def select_paper_search_ml(args):
    """Select Paper Search for ML(dummy data)"""
    is_parameter_exists([
        constants.TITLES
    ], args)

    # Search Titles
    titles = json.loads(args[constants.TITLES])

    paper_ids = []

    # this dict is for extracting keywords from papers which already exists in DB but have no keywords
    abstracts = {}

    for title in titles:
        # Papers Queryset(id, abstract)
        queryset = Paper.objects.filter(Q(title__icontains=title)).values_list('id', 'abstract')

        # if there is no result in our DB
        if queryset.count() == 0:
            # exploit arXiv
            try:
                start = 0
                logging.info("[arXiv API - ml] searching (%d~%d)", start, start + 1)
                arxiv_url = "http://export.arxiv.org/api/query"
                query = "?search_query=" + urllib.parse.quote(title) \
                    + "&start=" + str(start) + "&max_results=" + str(1)
                response = requests.get(arxiv_url + query)

                if response.status_code == 200:
                    response_xml = response.text
                    response_dict = xmltodict.parse(response_xml)['feed']
                    if 'entry' in response_dict and response_dict['entry']:
                        # this process includes extracting keywords from abstracts
                        paper_ids.append(__parse_and_save_arxiv_info(response_dict)[0][0])
                    else: # if 'entry' doesn't exist
                        logging.warning("[arXiv API - ml] more entries don't exist")
                        paper_ids.append(-1)
                else:
                    logging.warning("[arXiv API - ml] error code %d", response.status_code)
                    paper_ids.append(-1)
            except requests.exceptions.RequestException as exception:
                logging.warning(exception)
                paper_ids.append(-1)

        # if the paper exists in our DB
        else:
            # (id, abstract) of the paper
            paper_id, abstract = queryset.first()
            paper_ids.append(paper_id)

            # Check if the paper has keywords. If not, try extracting keywords this time
            if not PaperKeyword.objects.filter(paper_id=paper_id).exists():
                abstracts[paper_id] = abstract

    # after getting all results from arXiv and checking keywords existence
    if abstracts:
        __extract_keywords_from_abstract(abstracts)

    # Papers
    papers = __get_papers_ml(paper_ids, titles)

    return papers
# pylint: enable=too-many-locals


def select_paper_like(args):
    """Select Paper Like"""

    # Request User
    request_user = args[constants.USER]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Papers Queryset
    queryset = PaperLike.objects.filter(Q(user_id=request_user.id)).order_by(
        '-creation_date').values_list('paper_id', flat=True)

    # Paper Ids
    paper_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not paper_ids.has_next()

    # need to maintain the order
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(paper_ids)])

    # Papers
    papers, _ = __get_papers(Q(id__in=paper_ids), request_user, 10, preserved)

    return papers, page_number, is_finished


def get_papers(filter_query, request_user, count):
    """Public Get Papers"""
    return __get_papers(filter_query, request_user, count)

def remove_paper_collection(args):
    """Remove paper from the collection"""
    is_parameter_exists([
        constants.ID, constants.PAPER_ID
    ], args)

    collection_id = int(args[constants.ID])
    paper_id = int(args[constants.PAPER_ID])

    if not CollectionPaper.objects.filter(collection_id=collection_id, paper_id=paper_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    CollectionPaper.objects.filter(collection_id=collection_id, paper_id=paper_id).delete()

    # Get the number of papers in the collection
    paper_counts = get_collection_paper_count([collection_id], 'collection_id')
    return {constants.PAPERS: paper_counts[collection_id] if collection_id in paper_counts else 0}

def __get_papers(filter_query, request_user, count, order_by='-pk'):
    """Get Papers By Query"""
    queryset = Paper.objects.filter(
        filter_query
    ).annotate(
        is_liked=__is_paper_liked('id', request_user)
    ).order_by(order_by)

    papers = get_results_from_queryset(queryset, count)

    pagination_value = papers[len(papers) - 1].id if papers else 0

    papers = __pack_papers(papers, request_user)

    return papers, pagination_value


def __get_papers_search(result_ids, request_user, source_to_id, external, is_finished):
    """Get Papers By Query"""
    # need to maintain the order
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(result_ids)])

    queryset = Paper.objects.filter(
        Q(id__in=result_ids)
    ).annotate(
        is_liked=__is_paper_liked('id', request_user)
    ).order_by(preserved)

    if external:
        # if external, give all ready search results
        papers = queryset
    else:
        papers = get_results_from_queryset(queryset, SEARCH_COUNT)
        is_finished = len(papers) < SEARCH_COUNT if SEARCH_COUNT and papers else True

    pagination_value = papers[len(papers) - 1].id if papers else 0

    papers = __pack_papers(papers, request_user, source_to_id=source_to_id)

    return papers, pagination_value, is_finished


def __pack_papers(papers, request_user, source_to_id=None):  # pylint: disable=unused-argument
    """Pack Papers"""
    packed = []

    paper_ids = [paper.id for paper in papers]

    # Review Counts
    review_counts = __get_paper_review_count(paper_ids, 'paper_id')

    # Like Counts
    like_counts = __get_paper_like_count(paper_ids, 'paper_id')

    # Paper Authors
    authors = __get_authors_paper(Q(paper_id__in=paper_ids))

    # Paper Keywords
    keywords = __get_keywords_paper(Q(paper_id__in=paper_ids))

    # Paper Publications
    paper_publications = __get_paper_publications(Q(paper_id__in=paper_ids))

    for paper in papers:
        paper_id = paper.id

        packed_paper = {
            constants.ID: paper_id,
            constants.TITLE: paper.title,
            constants.LIKED: paper.is_liked,
            constants.LANGUAGE: paper.language,
            constants.ABSTRACT: paper.abstract,
            constants.ISSN: paper.ISSN,
            constants.EISSN: paper.eISSN,
            constants.DOI: paper.DOI,
            constants.FILE_URL: paper.file_url,
            constants.DOWNLOAD_URL: paper.download_url,
            constants.AUTHORS: authors[paper_id] if paper_id in authors else [],
            constants.KEYWORDS: keywords[paper_id] if paper_id in keywords else [],
            constants.PUBLICATION: paper_publications[paper_id] if paper_id in paper_publications else {},
            constants.COUNT: {
                constants.REVIEWS: review_counts[paper_id] if paper_id in review_counts else 0,
                constants.LIKES: like_counts[paper_id] if paper_id in like_counts else 0
            },
        }

        if source_to_id:
            for source, paper_ids in source_to_id.items():
                if paper_id in paper_ids:
                    packed_paper[constants.SOURCE] = source
                    break

        packed.append(packed_paper)

    return packed


def __get_papers_ml(paper_ids, search_words):
    """Get Papers By Query for ML(dummy data)"""
    packed = []

    for i, paper_id in enumerate(paper_ids):
        if paper_id != -1:
            # Paper
            paper = Paper.objects.get(id=paper_id)

            # Paper Keywords
            keywords = __get_keywords_paper(Q(paper_id=paper_id))
            packed_paper = {
                constants.ID: paper.id,
                constants.TITLE: paper.title,
                constants.ABSTRACT: paper.abstract,
                constants.KEYWORDS: keywords[paper.id] if paper.id in keywords else [],
                constants.SEARCH_WORD: search_words[i]
            }
        else:
            packed_paper = {
                constants.ID: -1,
                constants.TITLE: "",
                constants.ABSTRACT: "",
                constants.KEYWORDS: [],
                constants.SEARCH_WORD: search_words[i]
            }

        packed.append(packed_paper)

    return packed


def __get_authors_paper(filter_query):
    """Get Authors Of Paper"""
    # Authors Of Papers
    paper_authors = PaperAuthor.objects.filter(
        filter_query
    )

    # Result
    # {paper_id: [author]}
    result = {}

    # Author Ids
    author_ids = [paper_author.author_id for paper_author in paper_authors]
    author_ids = list(set(author_ids))

    # Get Authors
    authors = __get_authors(Q(id__in=author_ids))

    # {author_id: author}
    authors = {author[constants.ID]: author for author in authors}

    for paper_author in paper_authors:
        # Ids
        paper_id = paper_author.paper_id
        author_id = paper_author.author_id

        # Initialize
        if paper_id not in result:
            result[paper_id] = []

        if author_id in authors:
            author = authors[author_id]

            # Inesrt Type & Rank
            author[constants.TYPE] = paper_author.type
            author[constants.RANK] = paper_author.rank

            result[paper_id].append(author)

    # Sort By Authors' Rank
    result = {key: sorted(value, key=lambda element: element[constants.RANK]) for key, value in result.items()}

    return result


def get_keywords_paper(filter_query):
    """get keywords paper"""
    return __get_keywords_paper(filter_query)


def pack_keywords(keywords):
    """pack keywords"""
    return __pack_keywords(keywords)


def get_paper_like_count(paper_ids, group_by_field):
    """get paper like count"""
    return __get_paper_like_count(paper_ids, group_by_field)


def __get_keywords_paper(filter_query):
    """Get Keywords Of Paper"""
    # Keywords Of Papers
    paper_keywords = PaperKeyword.objects.filter(
        filter_query
    )

    # Result
    # {paper_id: [keyword]}
    result = {}

    # Keyword Ids
    keyword_ids = [paper_keyword.keyword_id for paper_keyword in paper_keywords]
    keyword_ids = list(set(keyword_ids))

    # Get Keywords
    keywords = __get_keywords(Q(id__in=keyword_ids))

    # {keyword_id: keyword}
    keywords = {keyword[constants.ID]: keyword for keyword in keywords}

    for paper_keyword in paper_keywords:
        # Ids
        paper_id = paper_keyword.paper_id
        keyword_id = paper_keyword.keyword_id

        # Initialize
        if paper_id not in result:
            result[paper_id] = []

        if keyword_id in keywords:
            keyword = keywords[keyword_id]

            # Inesrt Type
            keyword[constants.TYPE] = paper_keyword.type

            result[paper_id].append(keyword)

    return result


def __get_authors(filter_query):
    """Get Authors By Query"""
    queryset = Author.objects.filter(
        filter_query
    )

    authors = get_results_from_queryset(queryset, None)

    authors = __pack_authors(authors)

    return authors


def __pack_authors(authors):
    """Pack Authors"""
    # Packed
    packed = []

    for author in authors:

        # Author Id
        author_id = author.id

        packed.append(
            {
                constants.ID: author_id,
                constants.FIRST_NAME: author.first_name,
                constants.LAST_NAME: author.last_name,
                constants.EMAIL: author.email,
                constants.ADDRESS: author.address,
                constants.RESEARCHER_ID: author.researcher_id
            }
        )

    return packed


def __get_keywords(filter_query):
    """Get Keywords By Query"""
    queryset = Keyword.objects.filter(
        filter_query
    )

    keywords = get_results_from_queryset(queryset, None)

    keywords = __pack_keywords(keywords)

    return keywords


def __pack_keywords(keywords):
    """Pack Keywords"""
    # Packed
    packed = []

    for keyword in keywords:

        # Keyword Id
        keyword_id = keyword.id

        packed.append(
            {
                constants.ID: keyword_id,
                constants.NAME: keyword.name
            }
        )

    return packed


def __get_paper_publications(filter_query):
    """Get Paper Publications"""
    queryset = PaperPublication.objects.filter(
        filter_query
    )

    paper_publications = get_results_from_queryset(queryset, None)

    paper_publications = __pack_paper_publications(paper_publications)

    return paper_publications


def __pack_paper_publications(paper_publications):
    """Pack Paper Publications"""
    # Result
    # {paper_id: paper_publication}
    result = {}

    # Publication Ids
    publication_ids = [paper_publication.publication_id for paper_publication in paper_publications]

    # Publications
    publications = __get_publications(Q(id__in=publication_ids))

    # {publication_id: publication}
    publications = {publication[constants.ID]: publication for publication in publications}

    for paper_publication in paper_publications:
        # Publication Id
        publication_id = paper_publication.publication_id

        # Paper Id
        paper_id = paper_publication.paper_id

        result[paper_id] = {
            constants.PUBLICATION: publications[publication_id] if publication_id in publications else {},
            constants.VOLUME: paper_publication.volume,
            constants.ISSUE: paper_publication.issue,
            constants.DATE: paper_publication.date,
            constants.BEGINNING_PAGE: paper_publication.beginning_page,
            constants.ENDING_PAGE: paper_publication.ending_page,
            constants.ISBN: paper_publication.ISBN
        }

    return result


def __get_publications(filter_query):
    """Get Publications"""
    queryset = Publication.objects.filter(
        filter_query
    )

    publications = get_results_from_queryset(queryset, None)

    publications = __pack_publications(publications)

    return publications


def __pack_publications(publications):
    """Pack Publications"""
    # Packed
    packed = []

    # Publisher Ids
    publisher_ids = [publication.publisher_id for publication in publications]

    # Publishers
    publishers = __get_publishers(Q(id__in=publisher_ids))

    # {publisher_id: publisher}
    publishers = {publisher[constants.ID]: publisher for publisher in publishers}

    for publication in publications:

        # Publication Id
        publication_id = publication.id

        packed.append(
            {
                constants.ID: publication_id,
                constants.NAME: publication.name,
                constants.TYPE: publication.type,
                constants.PUBLISHER: publishers[publication_id] if publication_id in publishers else {}
            }
        )

    return packed


def __get_publishers(filter_query):
    """Get Publishers By Query"""
    queryset = Publisher.objects.filter(
        filter_query
    )

    publishers = get_results_from_queryset(queryset, None)

    publishers = __pack_publisher(publishers)

    return publishers


def __pack_publisher(publishers):
    """Pack Publishers"""
    # Packed
    packed = []

    for publisher in publishers:
        # Publisher Id
        publisher_id = publisher.id

        packed.append(
            {
                constants.ID: publisher_id,
                constants.NAME: publisher.name,
                constants.CITY: publisher.city,
                constants.ADDRESS: publisher.address
            }
        )

    return packed


def __is_paper_liked(outer_ref, request_user):
    """Check If Collection is Liked by User"""
    return Exists(
        PaperLike.objects.filter(paper_id=OuterRef(outer_ref), user_id=request_user.id if request_user else None)
    )


def __get_paper_like_count(paper_ids, group_by_field):
    """Get Number of Likes of Papers"""
    paper_likes = PaperLike.objects.filter(
        paper_id__in=paper_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {paper_like[group_by_field]: paper_like['count'] for paper_like in paper_likes}


def __get_paper_review_count(paper_ids, group_by_field):
    """Get Number of Reviews of Papers"""
    review_papers = Review.objects.filter(
        paper_id__in=paper_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {review_paper[group_by_field]: review_paper['count'] for review_paper in review_papers}
