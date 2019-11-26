"""user_action.py"""
from django.db import models
from django_mysql.models import EnumField

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper

ACTION_TYPE = [
    'collection',
    'like',
    'review',
]

class UserAction(BaseModel):
    """User Follow"""
    # person who makes the action
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None,
                             related_name='user_action_user')
    # related paper
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, default=None,
                              related_name="user_action_paper")

    # type of the action
    type = EnumField(choices=ACTION_TYPE)

    # number of the actions happened today
    count = models.IntegerField()

    class Meta:
        """Table Meta"""
        db_table = 'ml_user_action'  # Table 이름
        ordering = ['-pk']  # Default Order
