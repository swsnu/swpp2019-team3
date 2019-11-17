"""utils.py"""
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from notifications.models import Notification

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset, is_parameter_exists, ApiError
from papersfeed.models.users.user import User


def select_notifications(args):
    """Get Notifications of the current User"""

    # Request User
    request_user = args[constants.USER] if constants.USER in args else None

    # User
    user = User.objects.get(pk=request_user.id)

    notifications = user.notifications.unread().filter(~Q(actor_object_id=request_user.id))
    notifications = get_results_from_queryset(notifications, count=None)
    notifications = __pack_notifications(notifications)
    return notifications


def read_notification(args):
    """Mark the given Notification as Read"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Notification Id
    notification_id = args[constants.ID]

    # Get Notification
    try:
        notification = Notification.objects.get(id=notification_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Check Collection User Id
    if not request_user or notification.recipient.id != request_user.id:
        raise ApiError(constants.AUTH_ERROR)

    # Mark as Read
    notification.mark_as_read()


def __pack_notifications(notifications):
    """Pack Notifications"""
    packed = []

    for notification in notifications:
        packed_notification = {
            constants.ID: notification.id,
            constants.ACTOR: {
                constants.ID: notification.actor.id,
                constants.USERNAME: notification.actor.username
            },
            constants.VERB: notification.verb,
            constants.ACTION_OBJECT: {
                constants.TYPE: str(notification.action_object_content_type),
                constants.ID: notification.action_object.id,
                constants.STRING: str(notification.action_object)
            },
            constants.TIMESINCE: notification.timesince(),
        }

        packed.append(packed_notification)

    return packed
