"""paper_publication.py"""
from django.db import models

from .paper import Paper
from .publication import Publication


class PaperPublication(models.Model):
    """PaperPublication Model"""
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )
    publication = models.ForeignKey(
        Publication,
        null=False,
        on_delete=models.CASCADE,
    )
    volume = models.CharField(max_length=20, null=True)
    issue = models.CharField(max_length=20, null=True)
    date = models.DateField('date paper was published', null=True)
    beginning_page = models.PositiveIntegerField(null=True)
    ending_page = models.PositiveIntegerField(null=True)
    ISBN = models.CharField(max_length=20)
    