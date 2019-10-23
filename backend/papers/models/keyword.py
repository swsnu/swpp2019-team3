"""keyword.py"""
from django.db import models


class Keyword(models.Model):
    """Keyword Model"""
    name = models.CharField(max_length=200)
    