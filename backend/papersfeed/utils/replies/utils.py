"""utils.py"""
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count
from notifications.signals import notify

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.users import utils as users_utils
from papersfeed.utils.collections import utils as collections_utils
from papersfeed.utils.reviews import utils as reviews_utils
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection import Collection
from papersfeed.models.replies.reply import Reply
from papersfeed.models.replies.reply_collection import ReplyCollection
from papersfeed.models.replies.reply_review import ReplyReview
from papersfeed.models.replies.reply_like import ReplyLike
from papersfeed.models.users.user import User
from papersfeed.models.collections.collection_user import CollectionUser


def select_reply_collection(args):
    """Select reply collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Collection Id
    collection_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Replies
    collection_replies = ReplyCollection.objects.filter(
        collection_id=collection_id
    )

    reply_ids = [collection_reply.reply_id for collection_reply in collection_replies]

    replies, _, _ = __get_replies(Q(id__in=reply_ids), request_user, None)

    return replies

def select_reply_review(args):
    """Select reply collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Review Id
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Replies
    review_replies = ReplyReview.objects.filter(
        review_id=review_id
    )

    reply_ids = [review_reply.reply_id for review_reply in review_replies]

    replies, _, _ = __get_replies(Q(id__in=reply_ids), request_user, None)

    return replies

def insert_reply_collection(args):
    """Insert Reply Collection"""
    is_parameter_exists([
        constants.ID, constants.TEXT
    ], args)

    # Collection Id
    collection_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Text
    text = args[constants.TEXT]

    # Check parameter
    if not text:
        raise ApiError(constants.PARAMETER_ERROR)

    # Check collection id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Create

    reply = Reply.objects.create(
        user_id=request_user.id,
        text=text,
    )

    ReplyCollection.objects.create(
        collection_id=collection_id,
        reply_id=reply.id
    )

    # send notifications to members of the collection
    collection = Collection.objects.get(id=collection_id)

    collection_members = CollectionUser.objects.filter(Q(collection_id=collection_id))
    member_ids = [collection_member.user_id for collection_member in collection_members]
    member_ids = list(set(member_ids))

    members = User.objects.filter(Q(id__in=member_ids))

    notify.send(
        request_user,
        recipient=members,
        verb='replied to',
        action_object=reply,
        target=collection
    )

    replies, _, _ = __get_replies(Q(id=reply.id), request_user, None)

    if not replies:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    reply = replies[0]

    return reply

def insert_reply_review(args):
    """Insert Reply Review"""
    is_parameter_exists([
        constants.ID, constants.TEXT
    ], args)

    # Review Id
    review_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    # Text
    text = args[constants.TEXT]

    # Check parameter
    if not text:
        raise ApiError(constants.PARAMETER_ERROR)

    # Check review id
    if not Review.objects.filter(id=review_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Create
    reply = Reply.objects.create(
        user_id=request_user.id,
        text=text
    )

    ReplyReview.objects.create(
        review_id=review_id,
        reply_id=reply.id
    )

    # send notifications to the author of the review
    review = Review.objects.get(id=review_id)
    review_author = User.objects.get(id=review.user_id)

    notify.send(
        request_user,
        recipient=[review_author],
        verb='replied to',
        action_object=reply,
        target=review
    )

    replies, _, _ = __get_replies(Q(id=reply.id), request_user, None)

    if not replies:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    reply = replies[0]

    return reply

def update_reply(args):
    """Update Reply"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Reply Id
    reply_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        reply = Reply.objects.get(id=reply_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Auth
    if reply.user_id != request_user.id:
        raise ApiError(constants.AUTH_ERROR)

    # Text
    text = args[constants.TEXT] if constants.TEXT in args else None

    # Update Text
    if text:
        reply.text = text

    reply.save()

    replies, _, _ = __get_replies(Q(id=reply.id), request_user, None)

    if not replies:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    reply = replies[0]

    return reply

def remove_reply(args):
    """Remove Reply"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Reply ID
    reply_id = args[constants.ID]

    # Request User
    request_user = args[constants.USER]

    try:
        reply = Reply.objects.get(id=reply_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Auth
    if reply.user_id != request_user.id:
        raise ApiError(constants.AUTH_ERROR)

    reply.delete()

def __get_replies(filter_query, request_user, count):
    """Get Replies By Query"""
    queryset = Reply.objects.filter(
        filter_query
    ).annotate(
        is_liked=__is_reply_liked('id', request_user)
    )

    replies = get_results_from_queryset(queryset, count)

    pagination_value = replies[len(replies) - 1].id if replies else 0

    is_finished = len(replies) < count if count and pagination_value != 0 else True

    replies = __pack_replies(replies, request_user)

    return replies, pagination_value, is_finished


# pylint: disable-msg=too-many-locals
def __pack_replies(replies, request_user):
    """Pack Replies"""
    # Packed
    packed = []

    # Reply Ids
    reply_ids = [reply.id for reply in replies]

    # Users
    user_ids = [reply.user_id for reply in replies]
    users, _, _ = users_utils.get_users(Q(id__in=user_ids), request_user, None)

    # {user_id: user}
    users = {user[constants.ID]: user for user in users}

    # collection replies/ collections
    collection_replies = ReplyCollection.objects.filter(
        reply_id__in=reply_ids
    )
    collection_ids = [reply.collection_id for reply in collection_replies]
    collections, _, _ = collections_utils.get_collections(Q(id__in=collection_ids), request_user, None)

    # {collection_id: collection}
    collections = {collection[constants.ID]: collection for collection in collections}

    # review replies/ reviews
    review_replies = ReplyReview.objects.filter(
        reply_id__in=reply_ids
    )
    review_ids = [reply.review_id for reply in review_replies]
    reviews, _, _ = reviews_utils.get_reviews(Q(id__in=review_ids), request_user, None)
    # {review_id: review}
    reviews = {review[constants.ID]: review for review in reviews}

    # Reply Like
    like_counts = __get_reply_like_count(reply_ids, 'reply_id')

    for reply in replies:
        # reply Id
        reply_id = reply.id

        # User Id
        user_id = reply.user_id

        # Review Id
        review_id = ReplyReview.objects.filter(
            reply_id=reply_id
            ).first().review_id if ReplyReview.objects.filter(reply_id=reply_id).count() > 0 else -1

        # Collection Id
        collection_id = ReplyCollection.objects.filter(
            reply_id=reply_id
            ).first().collection_id if ReplyCollection.objects.filter(reply_id=reply_id).count() > 0 else -1

        packed_reply = {
            constants.ID: reply_id,
            constants.TEXT: reply.text,
            constants.LIKED: reply.is_liked,
            constants.REVIEW: reviews[review_id] if review_id in reviews else {},
            constants.COLLECTION: collections[collection_id] if collection_id in collections else {},
            constants.USER: users[user_id] if user_id in users else {},
            constants.COUNT: {
                constants.LIKES: like_counts[reply_id] if reply_id in like_counts else 0,
            }
        }

        packed.append(packed_reply)

    return packed
# pylint: enable-msg=too-many-locals


def __is_reply_liked(outer_ref, request_user):
    """Check If Review is Liked by User"""
    return Exists(
        ReplyLike.objects.filter(reply_id=OuterRef(outer_ref), user_id=request_user.id if request_user else None)
    )


def __get_reply_like_count(reply_ids, group_by_field):
    """Get Number of Likes of Reviews"""
    reply_likes = ReplyLike.objects.filter(
        reply_id__in=reply_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {reply_like[group_by_field]: reply_like['count'] for reply_like in reply_likes}
