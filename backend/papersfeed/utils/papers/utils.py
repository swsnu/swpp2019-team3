"""utils.py"""
# -*- coding: utf-8 -*-

import urllib
from pprint import pprint
import requests
import xmltodict
from django.db.models import Q, Exists, OuterRef, Count

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.papers.abstract_analysis import get_key_phrases
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

ARXIV_COUNT = 20 # pagination count for arXiv requests

MAX_REQ_SIZE = 500000 # maxCharactersPerRequest of Text Analytics API is 524288
MAX_DOC_SIZE = 5120 # size limit of one document is 5120 (request consists of multiple documents)


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
    papers, _, _ = __get_papers(Q(id=paper_id), request_user, None)

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

    # Papers
    collection_papers = CollectionPaper.objects.filter(
        collection_id=collection_id
    )

    paper_ids = [collection_paper.paper_id for collection_paper in collection_papers]

    papers, _, _ = __get_papers(Q(id__in=paper_ids), request_user, None)

    return papers


def select_paper_search(args):
    """Select Paper Search"""
    is_parameter_exists([
        constants.TEXT
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Search Keyword
    keyword = args[constants.TEXT]

    # Paper Ids
    paper_ids = Paper.objects.filter(Q(title__icontains=keyword) | Q(abstract__icontains=keyword)) \
        .values_list('id', flat=True)

    # if there is no result in our DB
    if paper_ids.count() == 0:
        # exploit arXiv
        try:
            start = 0
            while True:
                print("--- Sent a request for searching in arXiv ({}~{})".format(start, start+ARXIV_COUNT-1))
                arxiv_url = "http://export.arxiv.org/api/query"
                query = "?search_query=" + urllib.parse.quote(keyword) \
                    + "&start=" + str(start) + "&max_results=" + str(ARXIV_COUNT)
                response = requests.get(arxiv_url + query)

                if response.status_code == 200:
                    response_xml = response.text
                    response_dict = xmltodict.parse(response_xml)['feed']
                    if 'entry' in response_dict and response_dict['entry']:
                        paper_ids = __parse_and_save_arxiv_info(response_dict)
                    else: # if 'entry' doesn't exist or it's the end of results
                        break
                else:
                    break
                start += ARXIV_COUNT # continue pagination
        except requests.exceptions.RequestException as exception:
            print(exception)

    # Filter Query
    filter_query = Q(id__in=paper_ids)

    # Papers
    papers, _, _ = __get_papers(filter_query, request_user, None)

    return papers


def get_papers(filter_query, request_user, count):
    """Public Get Papers"""
    return __get_papers(filter_query, request_user, count)


def __get_papers(filter_query, request_user, count):
    """Get Papers By Query"""
    queryset = Paper.objects.filter(
        filter_query
    ).annotate(
        is_liked=__is_paper_liked('id', request_user)
    )

    papers = get_results_from_queryset(queryset, count)

    pagination_value = papers[len(papers) - 1].id if papers else 0

    is_finished = len(papers) < count if count and pagination_value != 0 else True

    papers = __pack_papers(papers, request_user)

    return papers, pagination_value, is_finished


def __pack_papers(papers, request_user):  # pylint: disable=unused-argument
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
            }
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


def __parse_and_save_arxiv_info(feed):
    paper_ids = []

    abstracts = {} # key: primary key of paper, value: abstract of the paper

    entries = feed['entry'] if isinstance(feed['entry'], list) else [feed['entry']]
    for entry in entries:
        # find papers with the title in DB
        dup_ids = Paper.objects.filter(title=entry['title']).values_list('id', flat=True)
        if dup_ids.count() > 0: # if duplicate papers exist
            paper_ids.extend(dup_ids) # just return their ids
            continue

        download_url = ""
        for link in entry['link']:
            if "@title" in link and link['@title'] == "pdf":
                download_url = link['@href']
                break

        # save information of the paper
        new_paper = Paper(
            title=entry['title'][:400],
            language="english",
            abstract=entry['summary'][:5000],
            DOI=entry['arxiv:doi']['#text'][:40] if "arxiv:doi" in entry and "#text" in entry['arxiv:doi'] else "",
            file_url=entry['id'],
            download_url=download_url
        )
        new_paper.save()
        paper_ids.append(new_paper.id)

        # save the abstract with key of paper for extracting keywords later
        abstracts[new_paper.id] = entry['summary']

        # save information of the authors
        author_rank = 1
        authors = entry['author'] if isinstance(entry['author'], list) else [entry['author']]
        for author in authors:
            __process_author(author, author_rank, new_paper.id)
            author_rank += 1

    __extract_keywords_from_abstract(abstracts)

    return paper_ids


def __process_author(author, author_rank, new_paper_id):
    """Create Author and PaperAuthor records"""
    author_rank += 1
    first_last = author['name'].split(' ')
    first_name = first_last[0].strip()
    last_name = first_last[1].strip() if len(first_last) > 1 else ''
    new_author = Author(
        first_name=first_name,
        last_name=last_name,
    )
    new_author.save()

    PaperAuthor.objects.create(
        paper_id=new_paper_id,
        author_id=new_author.id,
        type="general",
        rank=author_rank
    )

def __extract_keywords_from_abstract(abstracts):
    """for every abstract, extract keywords by calling 'get_key_phrases'"""
    doc_list = []
    request_len = 0
    request_cnt = 0
    for paper_key in abstracts:
        request_len += min(len(abstracts[paper_key]), MAX_DOC_SIZE)

        # create as few as requests possible, considering maximum sizes of request and doc
        if request_len >= MAX_REQ_SIZE:
            documents = {"documents": doc_list}
            key_phrases = get_key_phrases(documents)
            request_cnt += 1
            __process_key_phrases(key_phrases, request_cnt)

            doc_list = []
            request_len = min(len(abstracts[paper_key]), MAX_DOC_SIZE)

        doc_list.append({"id": str(paper_key), "language": "en", "text": abstracts[paper_key][:MAX_DOC_SIZE]})

    # create a request with remaining abstracts
    if doc_list:
        documents = {"documents": doc_list}
        key_phrases = get_key_phrases(documents)
        request_cnt += 1
        __process_key_phrases(key_phrases, request_cnt)

    print("--- Sent {} requests for extracting keywords".format(request_cnt))


def __process_key_phrases(key_phrases, request_cnt):
    """ process result of response and save them in DB
        To check struct of response, refer to
        https://koreacentral.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c6
    """

    # print errors if exist
    if key_phrases['errors']:
        print("- Request {} error".format(request_cnt))
        pprint(key_phrases['errors'])

    # save information of mapping keyword to paper (abstract)
    if key_phrases['documents']:
        for result in key_phrases['documents']:
            keyword_ids = []
            for key_phrase in result['keyPhrases']:
                key_phrase = key_phrase.lower()
                paper_id = int(result['id'])

                # find keywords with the name in DB
                dup_ids = Keyword.objects.filter(name=key_phrase).values_list('id', flat=True)
                if dup_ids.count() > 0: # if duplicate keywords don't exist
                    keyword_ids.extend(dup_ids)
                    continue

                new_keyword = Keyword(
                    name=key_phrase
                )
                new_keyword.save()
                keyword_ids.append(new_keyword.id)

            for keyword_id in keyword_ids:
                PaperKeyword.objects.create(
                    paper_id=paper_id,
                    keyword_id=keyword_id,
                    type="abstract"
                )
