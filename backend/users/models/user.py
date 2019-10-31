"""user.py"""
from django.db import models
from django.contrib.auth.models import User


class User(User):
    """User Model"""
    # 21자 alphanum 소문자
    username = models.CharField(max_length=21, unique=True, default=None)

    # 유저 자기소개 Text
    description = models.TextField(null=True, default=None)

