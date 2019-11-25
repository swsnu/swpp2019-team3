"""utils.py"""
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count, Case, When

from datetime import datetime, timedelta

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.users import utils as users_utils
from papersfeed.utils.papers import utils as papers_utils
from papersfeed.models.papers.paper import Paper
from papersfeed.models.users.user import User
from papersfeed.models.users.user_action import UserAction
from papersfeed.models.users.user_recommendation import UserRecommendation

def select_user_actions(args):
    """Select user actions"""

    new_actions = UserAction.objects.filter(
        modification_date__gt=(datetime.now() + timedelta(days=-1))
    ).annotate(
        UserId=__get_user_id('user'),
        ItemId=__get_paper_id('paper'),
        Type='type'
    ).values(
        'UserId', 'ItemId', 'Type'
    )

    for action in UserAction.objects.all():
        setattr(action, 'count', 0)
        action.save()

    return new_actions

def insert_user_recommendation(args):
    """Insert user recommendation"""

    for data in args:
        user_id = data['user']
        papers = data['papers']

        for i in range(1, len(papers) + 1):

            # Create recommendation
            UserRecommendation.objects.create(
                user_id=user_id,
                paper_id=papers[i],
                rank=i,
            )

    UserRecommendation.objects.filter(
        modification_date__lt=(datetime.now() + timedelta(hours=-2))
    ).delete()

def __get_user_id(outer_ref):
    return User.objects.filter(id=OuterRef(outer_ref)).id

def __get_paper_id(outer_ref):
    return Paper.objects.filter(id=OuterRef(outer_ref)).id