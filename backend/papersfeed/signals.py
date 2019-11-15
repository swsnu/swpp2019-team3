"""signals.py"""
from django.db.models.signals import post_save
from notifications.signals import notify
from papersfeed.models.reviews.review_like import ReviewLike

def like_notification_handler(sender, instance, created, **kwargs):
    notify.send(instance, verb='liked')
    print("liked")

#post_save.connect(like_notification_handler, sender=ReviewLike)
