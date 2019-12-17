"""collection.py"""
from django.db import models
from django_mysql.models import EnumField

from papersfeed.models.base_models import BaseModel


COLLECTION_SHARE_TYPE = [
    'public',
    'private'
]


class Collection(BaseModel):
    """Collection"""

    # Title
    title = models.CharField(max_length=400, null=False)

    # Text
    text = models.TextField(null=False)

    # Share Type
    type = EnumField(choices=COLLECTION_SHARE_TYPE, default='public')

    def __str__(self):
        return self.title

    class Meta:
        """Table Meta"""
        db_table = 'swpp_collection'  # Table 이름
        ordering = ['-pk']  # Default Order
