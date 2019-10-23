"""publisher.py"""
from django.db import models


class Publisher(models.Model):
    """Publisher Model"""
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=20)
    address = models.CharField(max_length=100)
    