"""utils.py"""
# -*- coding: utf-8 -*-

from django.db.models import Q

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset
from papersfeed.utils.papers.utils import get_papers
from papersfeed.utils.collections.utils import get_collections
from papersfeed.utils.reviews.utils import get_reviews

from papersfeed.models.users.user_follow import UserFollow
from papersfeed.models.subscription.subscription import Subscription


def select_subscriptions(args):
    """Get Subscriptions of the current User"""

    request_user = args[constants.USER]
    page_number = 1 if constants.PAGE_NUMBER not in args else args[constants.PAGE_NUMBER]

    # get the list of users that this user is following
    # pylint: disable=line-too-long
    followings_queryset = UserFollow.objects.filter(following_user=request_user.id).values_list('followed_user', flat=True)
    # Notification QuerySet
    subscription_queryset = Subscription.objects.filter(Q(actor__in=followings_queryset))
    print(subscription_queryset)
    subscriptions = get_results_from_queryset(subscription_queryset, 10, page_number)
    subscriptions = __pack_subscriptions(subscriptions, request_user)
    is_finished = len(subscriptions) < 10

    return subscriptions, page_number, is_finished

def __pack_subscriptions(subscriptions, request_user):
    packed = []

    for subscription in subscriptions:
        try:
            action_object_type = str(subscription.action_object_content_type)
            print(action_object_type)
            if action_object_type == 'paper':
                paper = get_papers(Q(id=subscription.action_object.id), request_user, 1)[0]
                action_object = {
                    constants.TYPE: 'paper',
                    constants.CONTENT: paper,
                }
            elif action_object_type == 'collection':
                collection = get_collections(Q(id=subscription.action_object.id), request_user, 1)[0]
                action_object = {
                    constants.TYPE: 'collection',
                    constants.CONTENT: collection,
                }
            elif action_object_type == 'review':
                review = get_reviews(Q(id=subscription.action_object.id), request_user, 1)[0]
                action_object = {
                    constants.TYPE: 'review',
                    constants.CONTENT: review,
                }
            else:
                raise AttributeError
        except AttributeError: # the action_object can be null or removed
            action_object = {}

        try:
            target = {
                constants.TYPE: str(subscription.target_content_type),
                constants.ID: subscription.target.id,
                constants.STRING: str(subscription.target)
            }
        except AttributeError: # the target can be null or removed
            target = {}

        packed_subscription = {
            constants.ID: subscription.id,
            constants.ACTOR: {
                constants.ID: subscription.actor.id,
                constants.USERNAME: subscription.actor.username,
            },
            constants.VERB: subscription.verb,
            constants.ACTION_OBJECT: action_object,
            constants.TARGET: target,
            constants.ACTION_HAPPEND_TIME: subscription.timestamp
        }
        packed.append(packed_subscription)

    return packed

# # paper action_object helper functions
# def __get_paper_authors(paper_id):
#     """Get Authors of a Paper"""
#     pass

# def __get_paper_keywords(paper_id):
#     """Get Keywords of a Paper"""
#     pass

# def __get_paper_review_count(paper_id):
#     """Get Number of Reviews of a Paper"""
#     return Review.objects.filter(paper_id=paper_id).count()

# def __get_paper_like_count(paper_id):
#     """Get Number of Likes of a Paper"""
#     return PaperLike.objects.filter(paper_id=paper_id).count()

# # collection action_object helper functions
# def __get_collection_like_count(collection_id):
#     """Get Number of Likes of a Collection"""
#     return CollectionLike.objects.filter(collection_id=collection_id).count()

# def __get_collection_user_count(collection_id):
#     """Get Number of Users in a Collection"""
#     return CollectionUser.objects.filter(collection_id=collection_id).count()

# def __get_collection_paper_count(collection_id):
#     """Get Number of Papers in a Collection"""
#     return CollectionPaper.objects.filter(collection_id=collection_id).count()

# def __get_collection_reply_count(collection_id):
#     """Get Number of Replies of a Collection"""
#     return ReplyCollection.objects.filter(collection_id=collection_id).count()

# # review action_object helper functions
# def __get_review_user(user_id):
#     """Get a user"""
#     return User.object.get(id=user_id)

# def __get_review_like_count(review_id):
#     """Get Number of Likes of a Review"""
#     return ReviewLike.objects.filter(review_id=review_id).count()

# def __get_review_reply_count(review_id):
#     """Get Number of Replies of a Review"""
#     return ReplyReview.objects.filter(review_id=review_id).count()
