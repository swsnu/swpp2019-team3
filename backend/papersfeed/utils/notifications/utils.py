"""utils.py"""
# -*- coding: utf-8 -*-

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset
from papersfeed.models.users.user import User


def select_notifications(args):
    """Get Notifications of the current User"""

    # Request User
    request_user = args[constants.USER] if constants.USER in args else None

    # User
    user = User.objects.get(pk=request_user.id)

    notifications = user.notifications.unread()
    notifications = get_results_from_queryset(notifications, count=None)
    notifications = __pack_notifications(notifications)
    return notifications


def __pack_notifications(notifications):
    """Pack Notifications"""
    packed = []

    for notification in notifications:
        packed_notification = {
            constants.ID: notification.id,
            constants.ACTOR: notification.actor.id,
            constants.VERB: notification.verb,
            constants.ACTION_OBJECT: notification.action_object.id,
            constants.TIMESINCE: notification.timesince(),
            constants.STRING: str(notification),
        }

        packed.append(packed_notification)

    return packed
