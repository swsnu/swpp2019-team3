"""models.py"""
from django.db import models


class Paper(models.Model):
    """Paper"""
    title = models.TextField(default=None)
