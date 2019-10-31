"""review_paper.py"""

from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.papers.paper import Paper
from .review import Review


class ReviewPaper(BaseModel):
    """Review Paper"""
    # Review
    review = models.ForeignKey(Review, on_delete=models.CASCADE, default=None, related_name='review_paper_review')

    # Paper
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, default=None, related_name='review_paper_paper')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_review_paper'  # Table 이름
        ordering = ['-pk']  # Default Order
