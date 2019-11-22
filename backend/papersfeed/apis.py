"""apis.py"""
# -*- coding: utf-8 -*-

# Internal Modules
from papersfeed.utils.papers import utils as papers_utils
from papersfeed.utils.users import utils as users_utils
from papersfeed.utils.collections import utils as collections_utils
from papersfeed.utils.reviews import utils as reviews_utils
from papersfeed.utils.likes import utils as likes_utils
from papersfeed.utils.replies import utils as replies_utils
from papersfeed.utils.notifications import utils as notification_utils

from . import constants


def post_follow(args):
    """Post Follow"""
    return {constants.COUNT: users_utils.insert_follow(args)}


def delete_follow(args):
    """Delete Follow"""
    return {constants.COUNT: users_utils.remove_follow(args)}


def get_session(args):
    """Get Session"""
    return users_utils.select_session(args)


def get_user_me(args):
    """Get Current User"""
    return users_utils.select_me(args)


def delete_session(args):
    """Delete Session"""
    return users_utils.delete_session(args)


def post_user(args):
    """Post User"""
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


def delete_collection(args):
    """Delete Collection"""
    return collections_utils.remove_collection(args)


def get_collection_user(args):
    """Get Collection User"""
    return {constants.COLLECTIONS: collections_utils.select_collection_user(args)}


def get_paper(args):
    """Get Paper"""
    return {constants.PAPER: papers_utils.select_paper(args)}


def get_paper_collection(args):
    """Get Paper Collection"""
    return {constants.PAPERS: papers_utils.select_paper_collection(args)}


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
    return {constants.REVIEWS: reviews_utils.select_review_paper(args)}


def get_review_user(args):
    """Get Review User"""
    return {constants.REVIEWS: reviews_utils.select_review_user(args)}


def get_paper_search(args):
    """Get Paper Search"""
    return {constants.PAPERS: papers_utils.select_paper_search(args)}


def get_collection_search(args):
    """Get Collection Search"""
    return {constants.COLLECTIONS: collections_utils.select_collection_search(args)}


def get_user_search(args):
    """Get User Search"""
    return {constants.USERS: users_utils.select_user_search(args)}


def post_like_paper(args):
    """Post Like Paper"""
    return {constants.COUNT: likes_utils.insert_like_paper(args)}


def delete_like_paper(args):
    """Delete Like Paper"""
    return {constants.COUNT: likes_utils.remove_like_paper(args)}


def get_paper_like(args):
    """Get Like Paper"""
    return {constants.PAPERS: papers_utils.select_paper_like(args)}


def post_like_review(args):
    """Post Like Review"""
    return {constants.COUNT: likes_utils.insert_like_review(args)}


def delete_like_review(args):
    """Delete Like Review"""
    return {constants.COUNT: likes_utils.remove_like_review(args)}


def post_like_collection(args):
    """Post Like Collection"""
    return {constants.COUNT: likes_utils.insert_like_collection(args)}


def delete_like_collection(args):
    """Delete Like Collection"""
    return {constants.COUNT: likes_utils.remove_like_collection(args)}


def post_like_reply(args):
    """Post like reply"""
    return {constants.COUNT: likes_utils.insert_like_reply(args)}


def delete_like_reply(args):
    """Delete Like Collection"""
    return {constants.COUNT: likes_utils.remove_like_reply(args)}


def get_reply_collection(args):
    """Get reply collection"""
    return {constants.REPLIES: replies_utils.select_reply_collection(args)}


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
    return {constants.REPLIES: replies_utils.select_reply_review(args)}


def post_reply_review(args):
    """Post reply review"""
    return {constants.REPLY: replies_utils.insert_reply_review(args)}


def put_reply_review(args):
    """Put reply review"""
    return {constants.REPLY: replies_utils.update_reply(args)}


def delete_reply_review(args):
    """Delete reply review"""
    return replies_utils.remove_reply(args)


def get_notification(args):
    """Get Notification"""
    return {constants.NOTIFICATIONS: notification_utils.select_notifications(args)}


def put_notification(args):
    """Put Notification"""
    return notification_utils.read_notification(args)
