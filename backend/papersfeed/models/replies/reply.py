"""reply.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User


class Reply(BaseModel):
    """Reply"""
    # Text
    text = models.TextField(null=False)

    # User
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='reply_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_reply'  # Table 이름
        ordering = ['-pk']  # Default Order

    def __str__(self):
        return self.text[:10] + "..." if len(self.text) > 10 else self.text[:10]
