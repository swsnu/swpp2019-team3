"""publisher.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel


class Publisher(BaseModel):
    """Publisher Model"""
    # Name
    name = models.CharField(max_length=200)

    # City
    city = models.CharField(max_length=50)

    # Address
    address = models.CharField(max_length=300)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_publisher'  # Table 이름
        ordering = ['-pk']  # Default Order

    def __str__(self):
        return self.name
