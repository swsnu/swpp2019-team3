"""paper_keyword.py"""
from django.db import models
from django_mysql.models import EnumField

from .paper import Paper
from .keyword import Keyword
from papersfeed.models.base_models import BaseModel

PAPER_KEYWORD_TYPE = [
    'author',
    'web',
    'abstract'
]


class PaperKeyword(BaseModel):
    """PaperKeyword Model"""

    # Paper
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )

    # Keyword
    keyword = models.ForeignKey(
        Keyword,
        null=False,
        on_delete=models.CASCADE,
    )

    # Keyword Type
    type = EnumField(choices=PAPER_KEYWORD_TYPE)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_paper_keyword'  # Table 이름
        ordering = ['-pk']  # Default Order
