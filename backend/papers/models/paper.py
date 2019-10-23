"""paper.py"""
from django.db import models


class Paper(models.Model):
    """Paper Model"""
    title = models.CharField(max_length=200)
    language = models.CharField(max_length=20)
    abstract = models.TextField(max_length=5000)
    ISSN = models.DecimalField(max_digits=19, decimal_places=10)
    eISSN = models.DecimalField(max_digits=19, decimal_places=10)
    DOI = models.DecimalField(max_digits=19, decimal_places=10)
    file_url = models.URLField()
    download_url = models.URLField()
    