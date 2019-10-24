"""paper.py"""
from django.db import models


class Paper(models.Model):
    """Paper Model"""
    title = models.CharField(max_length=400)
    language = models.CharField(max_length=20)
    abstract = models.TextField(max_length=5000)
    ISSN = models.CharField(max_length=20)
    eISSN = models.CharField(max_length=20)
    DOI = models.CharField(max_length=40)
    file_url = models.URLField()
    download_url = models.URLField()
    references = models.ManyToManyField("self", through='reference', symmetrical=False)
    