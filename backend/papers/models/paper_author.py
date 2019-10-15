"""paper_author.py"""
from django.db import models

from .paper import Paper
from .author import Author


class PaperAuthor(models.Model):
    """PaperAuthor Model"""
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(
        Author,
        null=False,
        on_delete=models.CASCADE,
    )
    rank = models.PositiveSmallIntegerField()