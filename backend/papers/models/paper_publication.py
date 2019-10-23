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
    volume = models.PositiveIntegerField()
    issue = models.PositiveIntegerField()
    date = models.DateTimeField('time paper was published')
    beginning_page = models.PositiveIntegerField()
    ending_page = models.PositiveIntegerField()
    ISSN = models.DecimalField(max_digits=19, decimal_places=10)
    