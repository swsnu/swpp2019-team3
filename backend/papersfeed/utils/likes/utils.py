"""utils.py"""
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
from notifications.signals import notify

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, ApiError
from papersfeed.utils.papers.utils import __get_paper_like_count
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.paper_like import PaperLike
from papersfeed.utils.reviews.utils import __get_review_like_count
from papersfeed.models.reviews.review import Review
from papersfeed.models.reviews.review_like import ReviewLike
from papersfeed.utils.collections.utils import __get_collection_like_count
from papersfeed.models.collections.collection import Collection
from papersfeed.models.collections.collection_like import CollectionLike
from papersfeed.models.users.user import User

def insert_like_paper(args):
    """Insert Like of Paper"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Paper Id
    paper_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Check Paper Id
    if not Paper.objects.filter(id=paper_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Create
    PaperLike.objects.create(
        paper_id=paper_id,
        user_id=request_user.id,
    )

    like_counts = __get_paper_like_count([paper_id], 'paper_id')
    return {constants.LIKES: like_counts[paper_id] if paper_id in like_counts else 0}


def remove_like_paper(args):
    """Remove Like of Paper"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Paper ID
    paper_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        paper_like = PaperLike.objects.get(paper_id=paper_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    paper_like.delete()

    like_counts = __get_paper_like_count([paper_id], 'paper_id')
    return {constants.LIKES: like_counts[paper_id] if paper_id in like_counts else 0}


def insert_like_review(args):
    """Insert Like of Review"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Review Id
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Check Review Id
    if not Review.objects.filter(id=review_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Create
    ReviewLike.objects.create(
        review_id=review_id,
        user_id=request_user.id,
    )

    users, _, _ = __get_users(Q(id=user_id), request_user, None)

    if not users:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    notify.send(request_user, recipient=[User.objects.get(pk=1)], verb='liked')

    like_counts = __get_review_like_count([review_id], 'review_id')
    return {constants.LIKES: like_counts[review_id] if review_id in like_counts else 0}


def remove_like_review(args):
    """Remove Like of Review"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Review ID
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        review_like = ReviewLike.objects.get(review_id=review_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    review_like.delete()

    like_counts = __get_review_like_count([review_id], 'review_id')
    return {constants.LIKES: like_counts[review_id] if review_id in like_counts else 0}


def insert_like_collection(args):
    """Insert Like of Collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Collection Id
    collection_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Check Collection Id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Create
    CollectionLike.objects.create(
        collection_id=collection_id,
        user_id=request_user.id,
    )

    like_counts = __get_collection_like_count([collection_id], 'collection_id')
    return {constants.LIKES: like_counts[collection_id] if collection_id in like_counts else 0}


def remove_like_collection(args):
    """Remove Like of Collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Collection ID
    collection_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        collection_like = CollectionLike.objects.get(collection_id=collection_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    collection_like.delete()

    like_counts = __get_collection_like_count([collection_id], 'collection_id')
    return {constants.LIKES: like_counts[collection_id] if collection_id in like_counts else 0}
