"""author.py"""
from django.db import models

from .paper import Paper
from papersfeed.models.base_models import BaseModel


class Author(BaseModel):
    """Author Model"""

    # First Name
    first_name = models.CharField(max_length=50)

    # Last Name
    last_name = models.CharField(max_length=50)

    # Email
    email = models.EmailField(max_length=50)

    # Address
    address = models.CharField(max_length=300)

    # Researcher Id
    researcher_id = models.CharField(max_length=20)

    # Papers
    papers = models.ManyToManyField(
        Paper,
        through='PaperAuthor',
        through_fields=('author', 'paper')
    )

    class Meta:
        """Table Meta"""
        db_table = 'swpp_author'  # Table 이름
        ordering = ['-pk']  # Default Order

    def __str__(self):
        return self.first_name + ', ' + self.last_name
