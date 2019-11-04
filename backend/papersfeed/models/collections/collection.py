"""collection.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel


class Collection(BaseModel):
    """Collection"""

    # Title
    title = models.CharField(max_length=400, null=False)

    # Text
    text = models.TextField(null=False)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_collection'  # Table 이름
        ordering = ['-pk']  # Default Order
