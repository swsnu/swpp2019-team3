"""collection_user.py"""
from django.db import models
from django_mysql.models import EnumField

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from .collection import Collection


COLLECTION_USER_TYPE = [
    'owner',
    'member'
]


class CollectionUser(BaseModel):
    """Collection User"""

    # Collection
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        default=None,
        related_name='collection_user_collection')

    # User
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='collection_user_user')

    # User Type
    type = EnumField(choices=COLLECTION_USER_TYPE)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_collection_user'  # Table 이름
        ordering = ['-pk']  # Default Order
