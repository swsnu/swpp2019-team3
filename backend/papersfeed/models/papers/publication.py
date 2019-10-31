"""publication.py"""
from django.db import models
from django_mysql.models import EnumField

from .publisher import Publisher
from .paper import Paper
from papersfeed.models.base_models import BaseModel

PUBLICATION_TYPE = [
    'journal',
    'book',
    'series',
    'patent'
]


class Publication(BaseModel):
    """Publication Model"""
    # Name
    name = models.CharField(max_length=200)

    # Publication Type
    publication_type = EnumField(choices=PUBLICATION_TYPE)

    # Publisher
    publisher = models.ForeignKey(
        Publisher,
        null=False,
        on_delete=models.CASCADE,
    )

    # Papers
    papers = models.ManyToManyField(
        Paper,
        through='PaperPublication',
        through_fields=('publication', 'paper')
    )

    class Meta:
        """Table Meta"""
        db_table = 'swpp_publication'  # Table 이름
        ordering = ['-pk']  # Default Order

    def __str__(self):
        return self.name
