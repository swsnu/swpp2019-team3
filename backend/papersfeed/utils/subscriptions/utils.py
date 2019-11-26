"""utils.py"""
# -*- coding: utf-8 -*-

from django.db.models import Q

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset, is_parameter_exists
from papersfeed.models.subscription.subscription import Subscription

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
            action_object_id = subscription.action_object.id
            if action_object_type == 'paper':
                paper_authors = 
                paper_keywords = 
                paper_review_count = 
                paper_like_count = 

                action_object = {
                    constants.ID: action_object_id,
                    constants.TITLE: subscription.action_object.title,
                    constants.AUTHORS: paper_authors,
                    constants.KEYWORDS: paper_keywords,
                    constants.LIKED: subscription.action_object.is_liked
                    constants.COUNT: {
                        constants.REVIEWS: paper_review_count,
                        constants.LIKES: paper_like_count,
                    }
                }
            elif action_object_type == 'collection':
                collection_user_count = 
                collection_paper_count = 
                collection_like_count = 
                collection_reply_count = 

                action_object = {
                    constants.ID: action_object_id,
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
                review_user = 
                review_like_count = 
                review_reply_count = 

                action_object = {
                    constants.ID: action_object_id,
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
                constants.USERNAME: subscription.actor.username
            },
            constants.VERB: subscription.verb,
            constants.ACTION_OBJECT: action_object,
            constants.TARGET: target,
            constants.ACTION_HAPPEND_TIME: subscription.timestamp
        }
        packed.append(packed_subscription)

    return packed
