"""utils.py"""
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset, is_parameter_exists, ApiError
from papersfeed.models.users.user import User

def get_subscriptions(args):
    """Get Subscriptions of the current User"""
    request_user = args[constants.USER] if constants.USER in args else None
    page_number = 1 if constants.PAGE_NUMBER not in args else args[constants.PAGE_NUMBER]
    user = User.objects.get(pk=request_user.id)

    # Notification QuerySet
    queryset = user.subscriptions.unread().filter(~Q(actor_object_id=request_user.id))

    subscriptions = get_results_from_queryset(queryset, 10, page_number)
    subscriptions = __pack_subscriptions(subscriptions)
    is_finished = len(subscriptions) < 10

    return subscriptions, page_number, is_finished

def __pack_subscriptions(subscriptions):
    packed = []

    for subscription in subscriptions:
        try:
            target = {
                constants.TYPE: str(notification.target_content_type),
                constants.ID: notification.target.id,
                constants.STRING: str(notification.target)
            }
        except AttributeError: # when the target is removed
            target = {}

        try:
            action_object = {
                constants.TYPE: str(notification.action_object_content_type),
                constants.ID: notification.action_object.id,
                constants.STRING: str(notification.action_object)
            }
        except AttributeError: # when the action_object is removed
            action_object = {}

        packed_notification = {
            constants.ID: notification.id,
            constants.ACTOR: {
                constants.ID: notification.actor.id,
                constants.USERNAME: notification.actor.username
            },
            constants.VERB: notification.verb,
            constants.TARGET: target,
            constants.ACTION_OBJECT: action_object,
            constants.TIMESINCE: notification.timesince(),
        }

        packed.append(packed_notification)

    return packed