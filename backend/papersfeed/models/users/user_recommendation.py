"""user_recommendation.py"""
from django.db import models
from django_mysql.models import EnumField

from papersfeed.models.base_models import BaseModel
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper

class UserRecommendation(BaseModel):
    """User Recommendation"""
    # person who needs recommendation
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None,
                                       related_name='user_recommendation_user')
    # related paper
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, default=None,
                                        related_name="user_recommendation_paper")
    
    # rank of the paper
    rank = models.PositiveIntegerField()

    class Meta:
        """Table Meta"""
        db_table = 'ml_user_recommendation'  # Table 이름
        ordering = ['-pk']  # Default Order