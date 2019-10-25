"""paper_author.py"""
from django.db import models
from django_mysql.models import EnumField

from .paper import Paper
from .author import Author


class PaperAuthor(models.Model):
    """PaperAuthor Model"""
    # pylint: disable=duplicate-code
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )
    # pylint: enable=duplicate-code
    author = models.ForeignKey(
        Author,
        null=False,
        on_delete=models.CASCADE,
    )
    author_type = EnumField(choices=['general', 'corresponding'])
    rank = models.PositiveSmallIntegerField()
    