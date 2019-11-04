"""base_models.py"""
from django.db import models


class BaseModel(models.Model):
    """Base Model"""
    # 생성 날짜
    creation_date = models.DateTimeField('Creation Date', auto_now_add=True)

    # 수정 날짜
    modification_date = models.DateTimeField('Modification Date', auto_now=True)

    class Meta:
        """Table Meta"""
        abstract = True
