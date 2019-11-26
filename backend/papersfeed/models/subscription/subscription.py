"""subscription.py"""
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from papersfeed.models.users.user import User

class Subscription(models.Model):
    """Subscription"""
    # (recipient) will receive a subscription item, "(actor) (verb) this (action_object) on (target)"
    # example : 'Ash' received "'Emily' 'added' this 'paper for machine learning' on 'collection 1'".

    recipient_user_id = models.IntegerField()

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
    action_object = GenericForeignKey('target_content_type', 'target_object_id')


    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='subscribe_target',
        blank=True,
        null=True,
    )
    target_object_id = models.CharField(max_length=255, blank=True, null=True)
    target = GenericForeignKey('target_content_type', 'target_object_id')


    # TYPE_CHOICES = {
    #     ('PAPER', 'paper'),
    #     ('COLLECTION', 'collection'),
    #     ('REVIEW', 'review'),
    # }
    # action_object_type = models.CharField(
    #     max_length=10,
    #     choices=TYPE_CHOICES,
    #     null=True,
    # )
    # target_type = models.CharField(
    #     max_length=10,
    #     choices=TYPE_CHOICES,
    #     null=True,
    # )


    # recording subscription item's created time
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_subscription'  # Table 이름
        ordering = ('-timestamp',)      # recent subscription recode will come first
