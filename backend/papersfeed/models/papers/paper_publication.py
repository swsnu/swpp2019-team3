"""paper_publication.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel
from .paper import Paper
from .publication import Publication


class PaperPublication(BaseModel):
    """PaperPublication Model"""

    # Paper
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )

    # Publication
    publication = models.ForeignKey(
        Publication,
        null=False,
        on_delete=models.CASCADE,
    )

    # Volume
    volume = models.CharField(max_length=20, null=True)

    # Issue
    issue = models.CharField(max_length=20, null=True)

    # Date
    date = models.DateField('date paper was published', null=True)

    # Beginning Page
    beginning_page = models.PositiveIntegerField(null=True)

    # Ending Page
    ending_page = models.PositiveIntegerField(null=True)

    # ISBN
    ISBN = models.CharField(max_length=20)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_paper_publication'  # Table 이름
        ordering = ['-pk']  # Default Order
