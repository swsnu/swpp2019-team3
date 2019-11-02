"""paper_author.py"""
from django.db import models
from django_mysql.models import EnumField

from papersfeed.models.base_models import BaseModel
from .paper import Paper
from .author import Author
from papersfeed.models.base_models import BaseModel

# Author Type
PAPER_AUTHOR_TYPE = [
    'general',
    'corresponding'
]


class PaperAuthor(BaseModel):
    """PaperAuthor Model"""

    # Paper
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )

    # Author
    author = models.ForeignKey(
        Author,
        null=False,
        on_delete=models.CASCADE,
    )

    # Author Type
    type = EnumField(choices=PAPER_AUTHOR_TYPE)

    # Rank
    rank = models.PositiveSmallIntegerField()

    class Meta:
        """Table Meta"""
        db_table = 'swpp_paper_author'  # Table 이름
        ordering = ['-pk']  # Default Order
