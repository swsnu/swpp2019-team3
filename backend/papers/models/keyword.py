"""keyword.py"""
from django.db import models

from .paper import Paper


class Keyword(models.Model):
    """Keyword Model"""
    name = models.CharField(max_length=200)
    papers = models.ManyToManyField(
        Paper,
        through='PaperKeyword',
        through_fields=('keyword', 'paper')
    )
