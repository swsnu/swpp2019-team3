"""reply_review.py"""

from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.reviews.review import Review
from .reply import Reply


class ReplyReview(BaseModel):
    """Reply Review"""

    # Reply
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, default=None, related_name='reply_review_reply')

    # Review
    review = models.ForeignKey(Review, on_delete=models.CASCADE, default=None, related_name='reply_review_review')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_reply_review'  # Table 이름
        ordering = ['-pk']  # Default Order
