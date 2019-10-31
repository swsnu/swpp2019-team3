"""review.py"""

from django.db import models
from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User


class Review(BaseModel):
    """Review"""
    # Title
    title = models.CharField(max_length=400, null=False)

    # Text
    text = models.TextField(null=False)

    # 이메일
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='review_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_review'  # Table 이름
        ordering = ['-pk']  # Default Order