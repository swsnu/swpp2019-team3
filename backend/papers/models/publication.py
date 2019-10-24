"""publication.py"""
from django.db import models
from django_mysql.models import EnumField

from .publisher import Publisher
from .paper import Paper


class Publication(models.Model):
    """Publication Model"""
    name = models.CharField(max_length=200)
    publication_type = EnumField(choices=['journal', 'book', 'series', 'patent'])
    publisher = models.ForeignKey(
        Publisher,
        null=False,
        on_delete=models.CASCADE,
    )
    papers = models.ManyToManyField(
        Paper,
        through='PaperPublication',
        through_fields=('publication', 'paper')
    )
