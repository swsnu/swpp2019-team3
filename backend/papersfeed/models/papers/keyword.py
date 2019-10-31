"""keyword.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from .paper import Paper


class Keyword(BaseModel):
    """Keyword Model"""

    # Name
    name = models.CharField(max_length=200)

    # Papers
    papers = models.ManyToManyField(
        Paper,
        through='PaperKeyword',
        through_fields=('keyword', 'paper')
    )

    class Meta:
        """Table Meta"""
        db_table = 'swpp_keyword'  # Table 이름
        ordering = ['-pk']  # Default Order

    def __str__(self):
        return self.name
