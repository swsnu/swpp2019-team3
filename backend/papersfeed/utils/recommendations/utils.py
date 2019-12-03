"""utils.py"""
# -*- coding: utf-8 -*-
from datetime import datetime, timedelta
from django.db.models import OuterRef, Subquery, F, Q
from django.core.paginator import Paginator

from papersfeed import constants
from papersfeed.models.papers.paper import Paper
from papersfeed.models.users.user import User
from papersfeed.models.users.user_action import UserAction
from papersfeed.models.users.user_recommendation import UserRecommendation
from papersfeed.utils.papers import utils as paper_utils
from papersfeed.utils.base_utils import get_results_from_queryset

def select_user_actions(_):
    """Select user actions"""

    new_actions = UserAction.objects.filter(
        ~Q(count=0),
        modification_date__gt=(datetime.now() + timedelta(days=-1))
    ).annotate(
        UserId=__get_user_id('user'),
        ItemId=__get_paper_id('paper'),
        Type=F('type'),
        Count=F('count'),
    ).values(
        'UserId', 'ItemId', 'Type', 'Count'
    )

    new_papers = Paper.objects.filter(
        creation_date__gt=(datetime.now() + timedelta(days=-1))
    ).annotate(
        ItemId=F('id')
    ).values(
        'ItemId'
    )

    new_users = User.objects.all().annotate(
        UserId=F('id')
    ).values(
        'UserId'
    )

    for paper in new_papers:
        paper_id = paper['ItemId']
        keywords = paper_utils.get_keywords_paper(Q(paper_id=paper_id))
        paper['Keywords'] = keywords[paper_id] if paper_id in keywords else []
        paper['Abstract'] = Paper.objects.get(id=paper_id).abstract

    new_papers = list(new_papers)
    new_users = list(new_users)
    new_actions = list(new_actions)

    UserAction.objects.filter(~Q(count=0)).update(count=0)

    return new_papers, new_users, new_actions

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

def select_recommendation(args):
    """Get Recommendations"""

    request_user = args[constants.USER]
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    recommendation_queryset = UserRecommendation.objects.filter(user_id=request_user.id)

    recommendations = get_results_from_queryset(recommendation_queryset, 10, page_number)

    is_finished = not recommendations.has_next()

    recommendations = __pack_recommendations(recommendations, request_user)

    return recommendations, page_number, is_finished

def select_paper_all(args):
    """Get All Papers"""

    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    paper_queryset = Paper.objects.all().annotate(
        ItemId=F('id')
    ).values(
        'ItemId'
    )

    papers = Paginator(paper_queryset, 1000).get_page(page_number)

    is_finished = not papers.has_next()

    for paper in papers:
        paper_id = paper['ItemId']
        keywords = paper_utils.get_keywords_paper(Q(paper_id=paper_id))
        paper['Keywords'] = keywords[paper_id] if paper_id in keywords else []
        paper['Abstract'] = Paper.objects.get(id=paper_id).abstract

    papers = list(papers)
    return papers, page_number, is_finished

def select_user_all(_):
    """Select User All"""

    users = User.objects.all().annotate(
        UserId=F('id')
    ).values(
        'UserId'
    )

    users = list(users)
    return users

def __get_user_id(outer_ref):
    return Subquery(
        User.objects.filter(id=OuterRef(outer_ref)).values('id')
    )

def __get_paper_id(outer_ref):
    return Subquery(
        Paper.objects.filter(id=OuterRef(outer_ref)).values('id')
    )

def __pack_recommendations(recommendations, request_user):
    packed = []

    for recommendation in recommendations:

        paper = paper_utils.get_papers(Q(id=recommendation.paper.id), request_user, 1)[0]
        action_object = {
            constants.TYPE: 'paper',
            constants.CONTENT: paper,
        }

        packed_recommendation = {
            constants.ID: recommendation.id,
            constants.ACTOR: {
                constants.ID: 0,
                constants.USERNAME: 'papersfeed',
            },
            constants.VERB: 'recommended',
            constants.ACTION_OBJECT: action_object,
            constants.TARGET: {},
            constants.CREATION_DATE: recommendation.creation_date,
        }

        packed.append(packed_recommendation)
    return packed
