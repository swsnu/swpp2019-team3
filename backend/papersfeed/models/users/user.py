"""user.py"""

from django.db import models
from papersfeed.models.base_models import BaseModel


class User(BaseModel):
    """User"""
    # @태그에 사용되는 Username, 21자 alphanum 소문자
    username = models.CharField(max_length=21, unique=True, default=None)

    # 유저 자기소개 Text
    description = models.TextField(null=True, default=None)

    # 이메일
    email = models.CharField(max_length=190, unique=True, null=True, default=None)

    # 비밀번호 sha256 Digest의 결과물
    password = models.TextField(null=True, default=None)

    # 비밀번호 Salt
    salt = models.TextField(null=True, default=None)

    class Meta:
        """Table Meta"""
        db_table = 'swpp_user'  # Table 이름
        ordering = ['-pk']  # Default Order

