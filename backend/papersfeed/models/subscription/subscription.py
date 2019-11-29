"""subscription.py"""
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from papersfeed.models.users.user import User

class Subscription(models.Model):
    """Subscription"""
    # decribes an action occured by a user
    # (actor) (verb) this (action_object) on (target)
    # example : 'Emily' 'added' this 'paper for machine learning' on 'collection 1'.

    actor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subscribe_actor'
    )

    verb = models.CharField(max_length=255)


    action_object_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='subscribe_action_object',
        blank=True,
        null=True,
    )
    action_object_object_id = models.CharField(max_length=255, blank=True, null=True)
    action_object = GenericForeignKey('action_object_content_type', 'action_object_object_id')


    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='subscribe_target',
        blank=True,
        null=True,
    )
    target_object_id = models.CharField(max_length=255, blank=True, null=True)
    target = GenericForeignKey('target_content_type', 'target_object_id')

    # recording subscription item's created time
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_subscription'  # Table 이름
        ordering = ('-timestamp',)      # recent subscription recode will come first
