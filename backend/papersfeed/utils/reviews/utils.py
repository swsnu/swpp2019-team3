"""utils.py"""
# -*- coding: utf-8 -*-

from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.users import utils as users_utils
from papersfeed.models.reviews.review import Review
from papersfeed.models.reviews.review_paper import ReviewPaper
from papersfeed.models.reviews.review_like import ReviewLike
from papersfeed.models.replies.reply_review import ReplyReview


def select_review(args):
    """Select Review"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Review Id
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Reviews
    reviews, _, _ = __get_reviews(Q(id=review_id), request_user, None)

    # Not Exists
    if not reviews:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    review = reviews[0]

    return review


def insert_review(args):
    """Insert Review"""
    is_parameter_exists([
        constants.ID, constants.TITLE, constants.TEXT
    ], args)

    # Paper Id
    paper_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Title
    title = args[constants.TITLE]

    # Text
    text = args[constants.TEXT]

    # Create


def __get_reviews(filter_query, request_user, count):
    """Get Reviews By Query"""
    queryset = Review.objects.filter(
        filter_query
    ).annotate(
        is_liked=__is_review_liked('id', request_user)
    )

    reviews = get_results_from_queryset(queryset, count)

    pagination_value = reviews[len(reviews) - 1].id if reviews else 0

    is_finished = len(reviews) < count if count and pagination_value != 0 else True

    reviews = __pack_reviews(reviews, request_user)

    return reviews, pagination_value, is_finished


def __pack_reviews(reviews, request_user):
    """Pack Reviews"""
    # Packed
    packed = []

    # Review Ids
    review_ids = [review.id for review in reviews]

    # Users
    user_ids = [review.user_id for review in reviews]
    users = users_utils.get_users(Q(id__in=user_ids), request_user, None)

    # {user_id: user}
    users = {user[constants.ID]: user for user in users}

    # Review Like
    like_counts = __get_review_like_count(review_ids, 'review_id')

    # Review Reply
    reply_counts = __get_review_reply_count(review_ids, 'review_id')

    for review in reviews:
        # Review Id
        review_id = review.id

        # User Id
        user_id = review.user_id

        packed_review = {
            constants.ID: review_id,
            constants.TITLE: review.title,
            constants.TEXT: review.text,
            constants.LIKED: review.is_liked,
            constants.USER: users[user_id] if user_id in users else {},
            constants.COUNT: {
                constants.LIKES: like_counts[review_id] if review_id in like_counts else 0,
                constants.REPLIES: reply_counts[review_id] if review_id in reply_counts else 0
            }
        }

        packed.append(packed_review)

    return packed


def __is_review_liked(outer_ref, request_user):
    """Check If Review is Liked by User"""
    return Exists(
        ReviewLike.objects.filter(reivew_id=OuterRef(outer_ref), user_id=request_user.id if request_user else None)
    )


def __get_review_like_count(review_ids, group_by_field):
    """Get Number of Likes of Reviews"""
    review_likes = ReviewLike.objects.filter(
        review_id__in=review_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {review_like[group_by_field]: review_like['count'] for review_like in review_likes}


def __get_review_reply_count(review_ids, group_by_field):
    """Get Number of Replies of Reviews"""
    review_replies = ReplyReview.objects.filter(
        review_id__in=review_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {review_reply[group_by_field]: review_reply['count'] for review_reply in review_replies}
