"""utils.py"""
# -*- coding: utf-8 -*-
from datetime import datetime, timedelta
from django.db.models import OuterRef, Subquery, F, Q
# 
from papersfeed.models.papers.paper import Paper
from papersfeed.models.users.user import User
from papersfeed.models.users.user_action import UserAction
from papersfeed.models.users.user_recommendation import UserRecommendation
from papersfeed.utils.papers import utils as paper_utils

def select_user_actions(_):
    """Select user actions"""
    new_actions = UserAction.objects.filter(
        modification_date__gt=(datetime.now() + timedelta(days=-1))
    ).annotate(
        UserId=__get_user_id('user'),
        ItemId=__get_paper_id('paper'),
        Type=F('type'),
        Count=F('count'),
    ).values(
        'UserId', 'ItemId', 'Type', 'Count'
    )

    for action in new_actions:
        paper_id = action['ItemId']
        keywords = paper_utils.get_keywords_paper(Q(paper_id=paper_id))
        action['Keywords'] = keywords[paper_id] if paper_id in keywords else []
        action['Abstract'] = Paper.objects.get(id=paper_id).abstract

    new_actions = list(new_actions)

    UserAction.objects.filter(~Q(count=0)).update(count=0)

    return new_actions

def insert_user_recommendation(args):
    """Insert user recommendation"""

    for data in args['data']:
        user_id = data['user']
        papers = data['papers']

        for i, paper_id in enumerate(papers):

            # Create recommendation
            UserRecommendation.objects.create(
                user_id=user_id,
                paper_id=paper_id,
                rank=i+1,
            )

    UserRecommendation.objects.filter(
        modification_date__lt=(datetime.now() + timedelta(hours=-2))
    ).delete()

def __get_user_id(outer_ref):
    return Subquery(
        User.objects.filter(id=OuterRef(outer_ref)).values('id')
    )

def __get_paper_id(outer_ref):
    return Subquery(
        Paper.objects.filter(id=OuterRef(outer_ref)).values('id')
    )
