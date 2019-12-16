"""apis.py"""
# -*- coding: utf-8 -*-

# Internal Modules
import json
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import ensure_csrf_cookie

from papersfeed.utils.base_utils import view_exceptions_handler, check_session
from papersfeed.utils.papers import utils as papers_utils
from papersfeed.utils.users import utils as users_utils
from papersfeed.utils.collections import utils as collections_utils
from papersfeed.utils.reviews import utils as reviews_utils
from papersfeed.utils.likes import utils as likes_utils
from papersfeed.utils.replies import utils as replies_utils
from papersfeed.utils.notifications import utils as notification_utils
from papersfeed.utils.subscriptions import utils as subscription_utils
from papersfeed.utils.recommendations import utils as recommendation_utils

from . import constants


def post_follow(args):
    """Post Follow"""
    return {constants.COUNT: users_utils.insert_follow(args)}


def delete_follow(args):
    """Delete Follow"""
    return {constants.COUNT: users_utils.remove_follow(args)}


@ensure_csrf_cookie
@view_exceptions_handler
def get_session(request):
    """Get Session"""
    args = request.GET.dict()
    args[constants.REQUEST] = request
    return users_utils.select_session(args)


def get_user_me(args):
    """Get Current User"""
    return users_utils.select_me(args)


def delete_session(args):
    """Delete Session"""
    return users_utils.delete_session(args)


@ensure_csrf_cookie
@view_exceptions_handler
def post_user(request):
    """Post User"""
    args = request.POST
    body = json.loads(request.body.decode()) if request.body else None
    if isinstance(body, dict):
        args = body
    args[constants.REQUEST] = request
    return {constants.USER: users_utils.insert_user(args)}


def get_user(args):
    """Get User"""
    return {constants.USER: users_utils.select_user(args)}


def put_user(args):
    """Put User"""
    return {constants.USER: users_utils.update_user(args)}


def delete_user(args):
    """Delete User"""
    return users_utils.remove_user(args)


def get_collection(args):
    """Get Collection"""
    return {constants.COLLECTION: collections_utils.select_collection(args)}


def post_collection(args):
    """Post Collection"""
    return {constants.COLLECTION: collections_utils.insert_collection(args)}


def put_collection(args):
    """Put Collection"""
    return {constants.COLLECTION: collections_utils.update_collection(args)}


def put_collection_type(args):
    """Put Collection Type"""
    return {constants.COLLECTION: collections_utils.update_collection_type(args)}


def delete_collection(args):
    """Delete Collection"""
    return collections_utils.remove_collection(args)


def get_collection_user(args):
    """Get Collection User"""
    collections, page_number, is_finished, total_count = collections_utils.select_collection_user(args)
    return {constants.COLLECTIONS: collections,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished,
            constants.TOTAL_COUNT: total_count}


def get_collection_user_shared(args):
    """Get Collection User Shared"""
    collections, page_number, is_finished, total_count = collections_utils.select_collection_user_shared(args)
    return {constants.COLLECTIONS: collections,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished,
            constants.TOTAL_COUNT: total_count}


def get_paper(args):
    """Get Paper"""
    return {constants.PAPER: papers_utils.select_paper(args)}


def get_paper_collection(args):
    """Get Paper Collection"""
    papers, page_number, is_finished = papers_utils.select_paper_collection(args)
    return {constants.PAPERS: papers,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def put_paper_collection(args):
    """Put Paper Collection"""
    return collections_utils.update_paper_collection(args)


def get_review(args):
    """Get Review"""
    return {constants.REVIEW: reviews_utils.select_review(args)}


def post_review(args):
    """Post Review"""
    return {constants.REVIEW: reviews_utils.insert_review(args)}


def put_review(args):
    """Put Review"""
    return {constants.REVIEW: reviews_utils.update_review(args)}


def delete_review(args):
    """Delete Review"""
    return reviews_utils.remove_review(args)


def get_review_paper(args):
    """Get Review Paper"""
    reviews, page_number, is_finished = reviews_utils.select_review_paper(args)
    return {constants.REVIEWS: reviews,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_review_user(args):
    """Get Review User"""
    reviews, page_number, is_finished, total_count = reviews_utils.select_review_user(args)
    return {constants.REVIEWS: reviews,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished,
            constants.TOTAL_COUNT: total_count}


@cache_page(None)
@view_exceptions_handler
def get_paper_search(request):
    """Get Paper Search"""
    args = request.GET.dict()
    args[constants.REQUEST] = request
    check_session(args, request)
    papers, page_number, is_finished = papers_utils.select_paper_search(args)
    return {constants.PAPERS: papers,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_collection_search(args):
    """Get Collection Search"""
    collections, page_number, is_finished, total_count = collections_utils.select_collection_search(args)
    return {constants.COLLECTIONS: collections,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished,
            constants.TOTAL_COUNT: total_count}


def get_user_search(args):
    """Get User Search"""
    users, page_number, is_finished, total_count = users_utils.select_user_search(args)
    return {constants.USERS: users,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished,
            constants.TOTAL_COUNT: total_count}


def post_like_paper(args):
    """Post Like Paper"""
    return {constants.COUNT: likes_utils.insert_like_paper(args)}


def delete_like_paper(args):
    """Delete Like Paper"""
    return {constants.COUNT: likes_utils.remove_like_paper(args)}


def get_paper_like(args):
    """Get Paper Like"""
    papers, page_number, is_finished = papers_utils.select_paper_like(args)
    return {constants.PAPERS: papers,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def post_like_review(args):
    """Post Like Review"""
    return {constants.COUNT: likes_utils.insert_like_review(args)}


def delete_like_review(args):
    """Delete Like Review"""
    return {constants.COUNT: likes_utils.remove_like_review(args)}


def get_review_like(args):
    """Get Review Like"""
    reviews, page_number, is_finished = reviews_utils.select_review_like(args)
    return {constants.REVIEWS: reviews,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def post_like_collection(args):
    """Post Like Collection"""
    return {constants.COUNT: likes_utils.insert_like_collection(args)}


def delete_like_collection(args):
    """Delete Like Collection"""
    return {constants.COUNT: likes_utils.remove_like_collection(args)}


def get_collection_like(args):
    """Get Collection Like"""
    collections, page_number, is_finished = collections_utils.select_collection_like(args)
    return {constants.COLLECTIONS: collections,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def post_like_reply(args):
    """Post like reply"""
    return {constants.COUNT: likes_utils.insert_like_reply(args)}


def delete_like_reply(args):
    """Delete Like Collection"""
    return {constants.COUNT: likes_utils.remove_like_reply(args)}


def get_reply_collection(args):
    """Get reply collection"""
    replies, page_number, is_finished = replies_utils.select_reply_collection(args)
    return {constants.REPLIES: replies,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def post_reply_collection(args):
    """Post reply collection"""
    return {constants.REPLY: replies_utils.insert_reply_collection(args)}


def put_reply_collection(args):
    """Put reply collection"""
    return {constants.REPLY: replies_utils.update_reply(args)}


def delete_reply_collection(args):
    """Delete reply collection"""
    return replies_utils.remove_reply(args)


def get_reply_review(args):
    """Get reply review"""
    replies, page_number, is_finished = replies_utils.select_reply_review(args)
    return {constants.REPLIES: replies,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def post_reply_review(args):
    """Post reply review"""
    return {constants.REPLY: replies_utils.insert_reply_review(args)}


def put_reply_review(args):
    """Put reply review"""
    return {constants.REPLY: replies_utils.update_reply(args)}


def delete_reply_review(args):
    """Delete reply review"""
    return replies_utils.remove_reply(args)


def get_user_collection(args):
    """Get User Collection"""
    users, page_number, is_finished = users_utils.select_user_collection(args)
    return {constants.USERS: users,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def post_user_collection(args):
    """Post User Collection"""
    return {constants.COUNT: users_utils.insert_user_collection(args)}


def put_user_collection(args):
    """Put User Collection"""
    return users_utils.update_user_collection(args)


def delete_user_collection(args):
    """Delete User Collection"""
    return {constants.COUNT: users_utils.remove_user_collection(args)}


def delete_user_collection_self(args):
    """Delete User Collection Self"""
    return {constants.COUNT: users_utils.remove_user_collection_self(args)}


def put_user_collection_pending(args):
    """Put User Collection Pending"""
    return {constants.COUNT: users_utils.update_user_collection_pending(args)}


def delete_user_collection_pending(args):
    """Delete User Collection Pending"""
    return users_utils.remove_user_collection_pending(args)


def get_notification(args):
    """Get Notification"""
    notifications, page_number, is_finished, total_count = notification_utils.select_notifications(args)
    return {constants.NOTIFICATIONS: notifications,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished,
            constants.TOTAL_COUNT: total_count}


def put_notification(args):
    """Put Notification"""
    return notification_utils.read_notification(args)


def get_user_following(args):
    """Get Users User is Following"""
    users, page_number, is_finished = users_utils.select_user_following(args)
    return {constants.USERS: users,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_user_followed(args):
    """Get User’s Followers"""
    users, page_number, is_finished = users_utils.select_user_followed(args)
    return {constants.USERS: users,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_subscription(args):
    """Get Subscription"""
    subscriptions, page_number, is_finished = subscription_utils.select_subscriptions(args)
    return {constants.SUBSCRIPTIONS: subscriptions,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_user_action(args):
    """Get User Actions"""
    papers, users, actions = recommendation_utils.select_user_actions(args)
    return {constants.PAPERS: papers,
            constants.USERS: users,
            constants.ACTIONS: actions}


def post_user_recommendation(args):
    """Post User Recommendation"""
    return recommendation_utils.insert_user_recommendation(args)


def get_paper_search_ml(args):
    """Get Paper Search ML"""
    return {constants.PAPERS: papers_utils.select_paper_search_ml(args)}


def get_recommendation(args):
    """Get Recommendations"""
    recommendations, page_number, is_finished = recommendation_utils.select_recommendation(args)
    return {constants.RECOMMENDATIONS: recommendations,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_paper_all(args):
    """Get All Papers"""
    papers, page_number, is_finished = recommendation_utils.select_paper_all(args)
    return {constants.PAPERS: papers,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_user_all(args):
    """Get All Users"""
    return {constants.USERS: recommendation_utils.select_user_all(args)}

def get_keyword_init(args):
    """Get Keyword Init"""
    keywords, page_number, is_finished = recommendation_utils.select_keyword_init(args)
    return {constants.KEYWORDS: keywords,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}

def post_recommendation_init(args):
    """Post Recommendation init"""
    return recommendation_utils.insert_recommendation_init(args)

def get_user_following_collection(args):
    """Get User Following Collection"""
    users, page_number, is_finished = users_utils.select_user_following_collection(args)
    return {constants.USERS: users,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}


def get_user_search_collection(args):
    """Get User Search Collection"""
    users, page_number, is_finished = users_utils.select_user_search_collection(args)
    return {constants.USERS: users,
            constants.PAGE_NUMBER: page_number,
            constants.IS_FINISHED: is_finished}

def delete_paper_collection(args):
    """Delete Paper Collection"""
    return {constants.COUNT: papers_utils.remove_paper_collection(args)}
