"""user.py"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    """UserManager"""
    def create_user(self, email, username, password, salt, description=None): # pylint: disable=too-many-arguments
        """inherit BaseUserManager's create_user"""
        user = self.model(
            email=email,
            username=username,
            password=password,
            salt=salt,
            description=description,
        )
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """User"""
    # @태그에 사용되는 Username, 21자 alphanum 소문자
    username = models.CharField(max_length=21, unique=True, default=None)

    # 유저 자기소개 Text
    description = models.TextField(null=True, default=None)

    # 이메일
    email = models.CharField(max_length=190, unique=True, null=True, default=None)
    # 유저 프로필 (샘플)사진 인덱스
    photoIndex = models.IntegerField(default=0)

    # 비밀번호 sha256 Digest의 결과물
    password = models.TextField(null=True, default=None)

    # 비밀번호 Salt
    salt = models.TextField(null=True, default=None)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELD = []

    class Meta:
        """Table Meta"""
        db_table = 'swpp_user'  # Table 이름
        ordering = ['-pk']  # Default Order
