"""utils.py"""
# -*- coding: utf-8 -*-

from django.db.models import Q

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset, is_parameter_exists

from papersfeed.models.subscription.subscription import Subscription
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.paper_like import PaperLike
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection_like import CollectionLike
from papersfeed.models.collections.collection_user import CollectionUser
from papersfeed.models.collections.collection_paper import CollectionPaper
from papersfeed.models.replies.reply_collection import ReplyCollection
from papersfeed.models.users.user import User
from papersfeed.models.reviews.review_like import ReviewLike
from papersfeed.models.replies.reply_review import ReplyReview


def select_subscriptions(args):
    """Get Subscriptions of the current User"""
    is_parameter_exists([
        constants.ID
    ], args)
    request_user_id = args[constants.ID]
    page_number = 1 if constants.PAGE_NUMBER not in args else args[constants.PAGE_NUMBER]

    # Notification QuerySet
    queryset = Subscription.object.filter(Q(recipient_user_id=request_user_id))

    subscriptions = get_results_from_queryset(queryset, 10, page_number)
    subscriptions = __pack_subscriptions(subscriptions)
    is_finished = len(subscriptions) < 10

    return subscriptions, page_number, is_finished

def __pack_subscriptions(subscriptions):
    packed = []

    for subscription in subscriptions:
        try:
            action_object_type = str(subscription.action_object_content_type)
            if action_object_type == 'paper':
                paper_id = subscription.action_object.id
                paper_authors = __get_paper_authors(paper_id)
                paper_keywords = __get_paper_keywords(paper_id)
                paper_review_count = __get_paper_review_count(paper_id)
                paper_like_count = __get_paper_like_count(paper_id)

                action_object = {
                    constants.ID: paper_id,
                    constants.TITLE: subscription.action_object.title,
                    constants.AUTHORS: paper_authors,
                    constants.KEYWORDS: paper_keywords,
                    constants.LIKED: subscription.action_object.is_liked,
                    constants.COUNT: {
                        constants.REVIEWS: paper_review_count,
                        constants.LIKES: paper_like_count,
                    }
                }
            elif action_object_type == 'collection':
                collection_id = subscription.action_object.id
                collection_user_count = __get_collection_user_count(collection_id)
                collection_paper_count = __get_collection_paper_count(collection_id)
                collection_like_count = __get_collection_like_count(collection_id)
                collection_reply_count = __get_collection_reply_count(collection_id)

                action_object = {
                    constants.ID: collection_id,
                    constants.TITLE: subscription.action_object.title,
                    constants.LIKED: subscription.action_object.is_liked,
                    constants.COUNT: {
                        constants.USERS: collection_user_count,
                        constants.PAPERS: collection_paper_count,
                        constants.LIKES: collection_like_count,
                        constants.REPLIES: collection_reply_count,
                    }
                }
            elif action_object_type == 'review':
                review_id = subscription.action_object.id
                review_user = __get_review_user(subscription.action_object.user_id)
                review_like_count = __get_review_like_count(review_id)
                review_reply_count = __get_review_reply_count(review_id)

                action_object = {
                    constants.ID: review_id,
                    constants.TITLE: subscription.action_object.title,
                    constants.USER: review_user,
                    constants.LIKED: subscription.action_object.is_liked,
                    constants.COUNT: {
                        constants.LIKES: review_like_count,
                        constants.REPLIES: review_reply_count,
                    }
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

# paper action_object helper functions
def __get_paper_authors(paper_id):
    """Get Authors of a Paper"""
    pass

def __get_paper_keywords(paper_id):
    """Get Keywords of a Paper"""
    pass

def __get_paper_review_count(paper_id):
    """Get Number of Reviews of a Paper"""
    return Review.objects.filter(paper_id=paper_id).count()

def __get_paper_like_count(paper_id):
    """Get Number of Likes of a Paper"""
    return PaperLike.objects.filter(paper_id=paper_id).count()

# collection action_object helper functions
def __get_collection_like_count(collection_id):
    """Get Number of Likes of a Collection"""
    return CollectionLike.objects.filter(collection_id=collection_id).count()

def __get_collection_user_count(collection_id):
    """Get Number of Users in a Collection"""
    return CollectionUser.objects.filter(collection_id=collection_id).count()

def __get_collection_paper_count(collection_id):
    """Get Number of Papers in a Collection"""
    return CollectionPaper.objects.filter(collection_id=collection_id).count()

def __get_collection_reply_count(collection_id):
    """Get Number of Replies of a Collection"""
    return ReplyCollection.objects.filter(collection_id=collection_id).count()

# review action_object helper functions
def __get_review_user(user_id):
    """Get a user"""
    return User.object.get(id=user_id)

def __get_review_like_count(review_id):
    """Get Number of Likes of a Review"""
    return ReviewLike.objects.filter(review_id=review_id).count()

def __get_review_reply_count(review_id):
    """Get Number of Replies of a Review"""
    return ReplyReview.objects.filter(review_id=review_id).count()