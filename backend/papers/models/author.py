"""author.py"""
from django.db import models


class Author(models.Model):
    """Author Model"""
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.CharField(max_length=100)
    researcher_id = models.DecimalField(max_digits=19, decimal_places=10)