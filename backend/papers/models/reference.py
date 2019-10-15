"""reference.py"""
from django.db import models

from .paper import Paper


class Reference(models.Model):
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