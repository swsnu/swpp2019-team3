"""publication.py"""
from django.db import models
from django_mysql.models import EnumField

from .publisher import Publisher


class Publication(models.Model):
    """Publication Model"""
    name = models.CharField(max_length=200)
    publication_type = EnumField(choices=['journal'])
    publisher = models.ForeignKey(
        Publisher,
        null=False,
        on_delete=models.CASCADE,
    )
    