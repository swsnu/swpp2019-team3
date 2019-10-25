"""keyword.py"""
from django.db import models

from .paper import Paper


class Keyword(models.Model):
    """Keyword Model"""
    name = models.CharField(max_length=200)
    # pylint: disable=duplicate-code
    papers = models.ManyToManyField(
        Paper,
        through='PaperKeyword',
        through_fields=('keyword', 'paper')
    )
    # pylint: enable=duplicate-code

    def __str__(self):
        return self.name
