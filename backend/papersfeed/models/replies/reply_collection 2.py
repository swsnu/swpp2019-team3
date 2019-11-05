"""reply_collection.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.collections.collection import Collection
from .reply import Reply


class ReplyCollection(BaseModel):
    """Reply Collection"""

    # Reply
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, default=None, related_name='reply_collection_reply')

    # Collection
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        default=None,
        related_name='reply_collection_collection')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_reply_collection'  # Table 이름
        ordering = ['-pk']  # Default Order
