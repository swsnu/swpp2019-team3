"""user_follow.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User


class UserFollow(BaseModel):
    """User Follow"""
    # Follow 하는 주체
    following_user = models.ForeignKey(User, on_delete=models.CASCADE, default=None,
                                       related_name='user_follow_following_user')

    # Follow 하는 대상 User
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, default=None,
                                      related_name='user_follow_followed_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_user_follow'  # Table 이름
        ordering = ['-pk']  # Default Order
