"""review_like.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from .review import Review


class ReviewLike(BaseModel):
    """Review Like"""
    # Review
    review = models.ForeignKey(Review, on_delete=models.CASCADE, default=None, related_name='review_like_review')

    # User
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='review_like_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_review_like'  # Table 이름
        ordering = ['-pk']  # Default Order
