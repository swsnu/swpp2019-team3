"""reply_like.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from .reply import Reply


class ReplyLike(BaseModel):
    """Reply Like"""

    # Reply
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, default=None, related_name='reply_like_reply')

    # User
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='reply_like_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_reply_like'  # Table 이름
        ordering = ['-pk']  # Default Order

