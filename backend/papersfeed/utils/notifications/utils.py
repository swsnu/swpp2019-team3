"""utils.py"""
# -*- coding: utf-8 -*-

from papersfeed import constants
from papersfeed.utils.base_utils import get_results_from_queryset
from papersfeed.models.users.user import User
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection import Collection


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
