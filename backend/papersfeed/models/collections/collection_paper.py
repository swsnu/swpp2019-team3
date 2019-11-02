"""collection_paper.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.papers.paper import Paper
from .collection import Collection


class CollectionPaper(BaseModel):
    """Collection Paper"""

    # Collection
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        default=None,
        related_name='collection_paper_collection')

    # Paper
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, default=None, related_name='collection_paper_paper')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_collection_paper'  # Table 이름
        ordering = ['-pk']  # Default Order
