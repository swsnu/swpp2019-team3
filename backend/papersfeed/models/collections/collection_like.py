"""collection_like.py"""

from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from .collection import Collection


class CollectionLike(BaseModel):
    """Collection Like"""

    # Collection
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, default=None, related_name='collection_like_collection')

    # User
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='collection_like_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_collection_like'  # Table 이름
        ordering = ['-pk']  # Default Order
