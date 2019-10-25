"""author.py"""
from django.db import models

from .paper import Paper


class Author(models.Model):
    """Author Model"""
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    address = models.CharField(max_length=300)
    researcher_id = models.CharField(max_length=20)
    # pylint: disable=duplicate-code
    papers = models.ManyToManyField(
        Paper,
        through='PaperAuthor',
        through_fields=('author', 'paper')
    )
    # pylint: enable=duplicate-code

    def __str__(self):
        return self.first_name + ', ' + self.last_name
