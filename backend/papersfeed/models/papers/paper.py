"""paper.py"""
from django.db import models

from papersfeed.models.base_models import BaseModel


class Paper(BaseModel):
    """Paper Model"""

    # Title
    title = models.CharField(max_length=400)

    # Language
    language = models.CharField(max_length=20)

    # Abstract
    abstract = models.TextField(max_length=5000)

    # ISSN
    ISSN = models.CharField(max_length=20)

    # eISSN
    eISSN = models.CharField(max_length=20)

    # DOI
    DOI = models.CharField(max_length=40)

    # File URL
    file_url = models.URLField()

    # Download URL
    download_url = models.URLField()

    # Source
    source = models.CharField(max_length=50)

    # References
    references = models.ManyToManyField("self", through='Reference', symmetrical=False)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_paper'  # Table 이름
        ordering = ['-pk']  # Default Order

    def __str__(self):
        return self.title
