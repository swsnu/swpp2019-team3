"""publisher.py"""
from django.db import models


class Publisher(models.Model):
    """Publisher Model"""
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    address = models.CharField(max_length=300)

    def __str__(self):
        return self.name
