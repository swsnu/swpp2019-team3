"""reference.py"""
from django.db import models

from .paper import Paper
from papersfeed.models.base_models import BaseModel


class Reference(BaseModel):
    """Reference Model"""
    referencing_paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
        related_name="referencing_paper"
    )
    referenced_paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
        related_name="referenced_paper"
    )

    class Meta:
        """Table Meta"""
        db_table = 'swpp_reference'  # Table 이름
        ordering = ['-pk']  # Default Order
