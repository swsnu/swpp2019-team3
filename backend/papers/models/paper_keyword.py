"""paper_keyword.py"""
from django.db import models
from django_mysql.models import EnumField

from .paper import Paper
from .keyword import Keyword


class PaperKeyword(models.Model):
    """PaperKeyword Model"""
    paper = models.ForeignKey(
        Paper,
        null=False,
        on_delete=models.CASCADE,
    )
    keyword = models.ForeignKey(
        Keyword,
        null=False,
        on_delete=models.CASCADE,
    )
    keyword_type = EnumField(choices=['author, web, abstract'])