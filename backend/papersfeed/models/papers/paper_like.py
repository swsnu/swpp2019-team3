"""paper_like.py"""
<<<<<<< HEAD

=======
>>>>>>> master
from django.db import models

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from .paper import Paper


class PaperLike(BaseModel):
    """Paper Like"""

    # Paper
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, default=None, related_name='paper_like_paper')

    # User
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name='paper_like_user')

    class Meta:
        """Table Meta"""
        db_table = 'swpp_paper_like'  # Table 이름
        ordering = ['-pk']  # Default Order
<<<<<<< HEAD

=======
>>>>>>> master
