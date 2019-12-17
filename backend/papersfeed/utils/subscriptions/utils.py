"""utils.py"""
# -*- coding: utf-8 -*-

from django.db.models import Q

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset
from papersfeed.utils.papers.utils import get_papers
from papersfeed.utils.collections.utils import get_collections, __is_member
from papersfeed.utils.reviews.utils import get_reviews
from papersfeed.models.users.user_follow import UserFollow
from papersfeed.models.subscription.subscription import Subscription
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection import Collection


def select_subscriptions(args):
    """Get Subscriptions of the current User"""

    request_user = args[constants.USER]
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # get the list of users that this user is following
    followings_queryset = UserFollow.objects.filter(
        following_user=request_user.id).values_list('followed_user', flat=True)

    # anonymous reviews should not be seen
    anonymous_reviews = Review.objects.filter(anonymous=True).values_list('id', flat=True)

    # private collections where the user is not a member should not be seen
    private_collections = Collection.objects.annotate(
        is_member=__is_member('id', request_user.id)
    ).filter(
        type="private", is_member=False).values_list('id', flat=True)

    # Subscription QuerySet
    subscription_queryset = Subscription.objects.filter(
        Q(actor__in=followings_queryset)
    ).exclude(
        action_object_content_type__model="Review",
        action_object_object_id__in=anonymous_reviews,
    ).exclude(
        action_object_content_type__model="Collection",
        action_object_object_id__in=private_collections,
    )

    subscriptions = get_results_from_queryset(subscription_queryset, 20, page_number)

    # is_finished
    is_finished = not subscriptions.has_next()

    subscriptions = __pack_subscriptions(subscriptions, request_user)

    return subscriptions, page_number, is_finished

def __pack_subscriptions(subscriptions, request_user):
    packed = []

    for subscription in subscriptions:
        try:
            action_object_type = str(subscription.action_object_content_type)
            if action_object_type == 'paper':
                paper = get_papers(Q(id=subscription.action_object.id), request_user, 1)[0]
                action_object = {
                    constants.TYPE: 'paper',
                    constants.CONTENT: paper[0],
                }
            elif action_object_type == 'collection':
                collection = get_collections(Q(id=subscription.action_object.id), request_user, 1)[0]
                action_object = {
                    constants.TYPE: 'collection',
                    constants.CONTENT: collection[0],
                }
            elif action_object_type == 'review':
                review = get_reviews(Q(id=subscription.action_object.id), request_user, 1)[0]
                action_object = {
                    constants.TYPE: 'review',
                    constants.CONTENT: review[0],
                }
            else:
                raise AttributeError
        except AttributeError: # the action_object can be null or removed
            action_object = {}

        try:
            target_type = str(subscription.target_content_type)
            if target_type in ('paper', 'collection', 'review'):
                target = {
                    constants.TYPE: str(subscription.target_content_type),
                    constants.ID: subscription.target.id,
                    constants.TITLE: str(subscription.target)
                }
            else:
                raise AttributeError
        except AttributeError: # the target can be null or removed
            target = {}

        packed_subscription = {
            constants.TYPE: "subscription",
            constants.ID: subscription.id,
            constants.ACTOR: {
                constants.ID: subscription.actor.id,
                constants.USERNAME: subscription.actor.username,
            },
            constants.VERB: subscription.verb,
            constants.ACTION_OBJECT: action_object,
            constants.TARGET: target,
            constants.CREATION_DATE: subscription.creation_date,
        }
        packed.append(packed_subscription)
    return packed
