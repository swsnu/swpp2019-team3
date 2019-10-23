"""author.py"""
from django.db import models


class Author(models.Model):
    """Author Model"""
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    address = models.CharField(max_length=300)
    researcher_id = models.CharField(max_length=20)
    