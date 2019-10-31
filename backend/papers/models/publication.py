"""publication.py"""
from django.db import models
from django_mysql.models import EnumField

from .publisher import Publisher
from .paper import Paper


PUBLICATION_TYPE = [
    'journal',
    'book',
    'series',
    'patent'
]


class Publication(models.Model):
    """Publication Model"""
    name = models.CharField(max_length=200)
    publication_type = EnumField(choices=PUBLICATION_TYPE)
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

    def __str__(self):
        return self.name
