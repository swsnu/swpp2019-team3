"""utils.py"""
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count, Case, When

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.users import utils as users_utils
from papersfeed.utils.papers import utils as papers_utils
from papersfeed.models.reviews.review import Review
from papersfeed.models.papers.paper import Paper
from papersfeed.models.reviews.review_like import ReviewLike
from papersfeed.models.replies.reply_review import ReplyReview
from papersfeed.models.users.user_action import UserAction, USER_ACTION_TYPE
from papersfeed.models.subscription.subscription import Subscription


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
    reviews, _ = __get_reviews(Q(id=review_id), request_user, None)

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

    # Check Valid
    if not title or not text:
        raise ApiError(constants.PARAMETER_ERROR)

    # Check Paper Id
    if not Paper.objects.filter(id=paper_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Create
    review = Review.objects.create(
        paper_id=paper_id,
        user_id=request_user.id,
        title=title,
        text=text
    )

    # store an action for subscription feed
    try:
        subscription = Subscription.objects.get(
            actor=request_user,
            verb="wrote",
            action_object_object_id=review.id,
            target_object_id=paper_id
        )
        subscription.save() # for updating time
    except Subscription.DoesNotExist:
        paper = Paper.objects.get(id=paper_id)
        Subscription.objects.create(
            actor=request_user,
            verb="wrote",
            action_object=review,
            target=paper,
        )

    # Create action for recommendation
    try:
        obj = UserAction.objects.get(
            user_id=request_user.id,
            paper_id=paper_id,
            type=USER_ACTION_TYPE[2]
        )
        obj.count = obj.count + 1
        obj.save()
    except ObjectDoesNotExist:
        UserAction.objects.create(
            user_id=request_user.id,
            paper_id=paper_id,
            type=USER_ACTION_TYPE[2],
            count=1,
        )

    reviews, _ = __get_reviews(Q(id=review.id), request_user, None)

    if not reviews:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    review = reviews[0]

    return review


def update_review(args):
    """Update Review"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Review ID
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        review = Review.objects.get(id=review_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Auth
    if review.user_id != request_user.id:
        raise ApiError(constants.AUTH_ERROR)

    # Title
    title = args[constants.TITLE] if constants.TITLE in args else None

    # Text
    text = args[constants.TEXT] if constants.TEXT in args else None

    # Update Title
    if title:
        review.title = title

    # Update Text
    if text:
        review.text = text

    review.save()

    reviews, _ = __get_reviews(Q(id=review.id), request_user, None)

    if not reviews:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    review = reviews[0]

    return review


def remove_review(args):
    """Remove Review"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Review ID
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        review = Review.objects.get(id=review_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Auth
    if review.user_id != request_user.id:
        raise ApiError(constants.AUTH_ERROR)

    paper_id = review.paper_id

    review.delete()

    obj = UserAction.objects.get(
        user_id=request_user.id,
        paper_id=paper_id,
        type=USER_ACTION_TYPE[2]
    )
    obj.count = obj.count - 1
    obj.save()


def select_review_paper(args):
    """Get Reviews of Paper"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Paper Id
    paper_id = args[constants.ID]

    # Request Uer
    request_user = args[constants.USER]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else args[constants.PAGE_NUMBER]

    # Reviews Queryset
    queryset = Review.objects.filter(Q(paper_id=paper_id)).values_list('id', flat=True)

    # Review Ids
    review_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not review_ids.has_next()

    reviews, _ = __get_reviews(Q(id__in=review_ids), request_user, 10)

    return reviews, page_number, is_finished


def select_review_user(args):
    """Get User's Reviews"""
    is_parameter_exists([
        constants.ID
    ], args)

    # User Id
    user_id = args[constants.ID]

    # Request Uer
    request_user = args[constants.USER]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else args[constants.PAGE_NUMBER]

    # Reviews Queryset
    queryset = Review.objects.filter(Q(user_id=user_id)).values_list('id', flat=True)

    # Review Ids
    review_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not review_ids.has_next()

    reviews, _ = __get_reviews(Q(id__in=review_ids), request_user, 10)

    return reviews, page_number, is_finished


def select_review_like(args):
    """Select Review Like"""

    # Request User
    request_user = args[constants.USER]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Reviews Queryset
    queryset = ReviewLike.objects.filter(Q(user_id=request_user.id)).order_by(
        '-creation_date').values_list('review_id', flat=True)

    # Review Ids
    review_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not review_ids.has_next()

    # need to maintain the order
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(review_ids)])

    # Reviews
    reviews, _ = __get_reviews(Q(id__in=review_ids), request_user, 10, preserved)

    return reviews, page_number, is_finished


def get_reviews(filter_query, request_user, count):
    """Get Reviews"""
    return __get_reviews(filter_query, request_user, count)

def get_review_like_count(review_ids, group_by_field):
    """Get Review like Count"""
    return __get_review_like_count(review_ids, group_by_field)

def __get_reviews(filter_query, request_user, count, order_by='-pk'):
    """Get Reviews By Query"""
    queryset = Review.objects.filter(
        filter_query
    ).annotate(
        is_liked=__is_review_liked('id', request_user)
    ).order_by(order_by)

    reviews = get_results_from_queryset(queryset, count)

    pagination_value = reviews[len(reviews) - 1].id if reviews else 0

    reviews = __pack_reviews(reviews, request_user)

    return reviews, pagination_value


# pylint: disable-msg=too-many-locals
def __pack_reviews(reviews, request_user):
    """Pack Reviews"""
    # Packed
    packed = []

    # Review Ids
    review_ids = [review.id for review in reviews]

    # Users
    user_ids = [review.user_id for review in reviews]
    users, _ = users_utils.get_users(Q(id__in=user_ids), request_user, None)

    # {user_id: user}
    users = {user[constants.ID]: user for user in users}

    # Papers
    paper_ids = [review.paper_id for review in reviews]
    papers, _ = papers_utils.get_papers(Q(id__in=paper_ids), request_user, None)

    # {paper_id: paper}
    papers = {paper[constants.ID]: paper for paper in papers}

    # Review Like
    like_counts = __get_review_like_count(review_ids, 'review_id')

    # Review Reply
    reply_counts = __get_review_reply_count(review_ids, 'review_id')

    for review in reviews:
        # Review Id
        review_id = review.id

        # User Id
        user_id = review.user_id

        # Paper Id
        paper_id = review.paper_id

        packed_review = {
            constants.ID: review_id,
            constants.TITLE: review.title,
            constants.TEXT: review.text,
            constants.LIKED: review.is_liked,
            constants.PAPER: papers[paper_id] if paper_id in papers else {},
            constants.USER: users[user_id] if user_id in users else {},
            constants.COUNT: {
                constants.LIKES: like_counts[review_id] if review_id in like_counts else 0,
                constants.REPLIES: reply_counts[review_id] if review_id in reply_counts else 0
            },
            constants.CREATION_DATE: review.creation_date,
            constants.MODIFICATION_DATE: review.modification_date
        }

        packed.append(packed_review)

    return packed
# pylint: enable-msg=too-many-locals


def __is_review_liked(outer_ref, request_user):
    """Check If Review is Liked by User"""
    return Exists(
        ReviewLike.objects.filter(review_id=OuterRef(outer_ref), user_id=request_user.id if request_user else None)
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
