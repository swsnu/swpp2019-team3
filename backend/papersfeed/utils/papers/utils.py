"""utils.py"""
# -*- coding: utf-8 -*-

from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.author import Author
from papersfeed.models.papers.keyword import Keyword
from papersfeed.models.papers.paper_author import PaperAuthor, PAPER_AUTHOR_TYPE
from papersfeed.models.papers.paper_keyword import PaperKeyword
from papersfeed.models.papers.paper_like import PaperLike
from papersfeed.models.papers.paper_publication import PaperPublication
from papersfeed.models.papers.publication import Publication
from papersfeed.models.papers.publisher import Publisher
from papersfeed.models.papers.reference import Reference
from papersfeed.models.reviews.review_paper import ReviewPaper


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


def __pack_papers(papers, request_user):
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
            constants.TEXT: paper.text,
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

    authors = get_results_from_queryset(queryset, count)

    pagination_value = authors[len(authors) - 1].id if authors else 0

    is_finished = len(authors) < count if count and pagination_value != 0 else True

    authors = __pack_authors(authors)

    return authors, pagination_value, is_finished


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

    keywords = get_results_from_queryset(queryset, count)

    pagination_value = keywords[len(keywords) - 1].id if keywords else 0

    is_finished = len(keywords) < count if count and pagination_value != 0 else True

    keywords = __pack_keywords(keywords)

    return keywords, pagination_value, is_finished


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

    paper_publications = get_results_from_queryset(queryset, count)

    pagination_value = paper_publications[len(paper_publications) - 1].id if paper_publications else 0

    is_finished = len(paper_publications) < count if count and pagination_value != 0 else True

    paper_publications = __pack_paper_publications(paper_publications)

    return paper_publications, pagination_value, is_finished


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
            constants.DATE: paper_publication.date.strptime('%Y-%m-%d'),
            constants.BEGINNING_PAGE: paper_publication.beginning_page,
            constants.ENDING_PAGE: paper_publication.ending_page,
            constants.ISBN: paper_publication.ISBN
        }

    return result


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
    queryset = Keyword.objects.filter(
        filter_query
    )

    publishers = get_results_from_queryset(queryset, count)

    pagination_value = publishers[len(publishers) - 1].id if publishers else 0

    is_finished = len(publishers) < count if count and pagination_value != 0 else True

    publishers = __pack_publishers(publishers)

    return publishers, pagination_value, is_finished


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


def __is_paper_liked(outerRef, request_user):
    """Check If Collection is Liked by User"""
    return Exists(
        PaperLike.objects.filter(paper_id=OuterRef(outerRef), user_id=request_user.id if request_user else None)
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
    review_papers = ReviewPaper.objects.filter(
        paper_id__in=paper_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {review_paper[group_by_field]: review_paper['count'] for review_paper in review_papers}