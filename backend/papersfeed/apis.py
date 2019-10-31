"""apis.py"""
# -*- coding: utf-8 -*-

# Internal Modules
from papersfeed.utils.papers import utils as papers_utils
from papersfeed.utils.users import utils as users_utils
from papersfeed.utils.collections import utils as collections_utils


def post_follow(args):
    """Post Follow"""
    return users_utils.insert_follow(args)


def delete_follow(args):
    """Delete Follow"""
    return users_utils.remove_follow(args)


def get_session(args):
    """Get Session"""
    return users_utils.select_session(args)


def delete_session(args):
    """Delete Session"""
    return users_utils.delete_session(args)


def post_user(args):
    """Post User"""
    return users_utils.insert_user(args)


def get_user(args):
    """Get User"""
    return users_utils.select_user(args)


def put_user(args):
    """Put User"""
    return users_utils.update_user(args)


def delete_user(args):
    """Delete User"""
    return users_utils.remove_user(args)


def get_collection(args):
    """Get Collection"""
    return collections_utils.select_collection(args)


def post_collection(args):
    """Post Collection"""
    return collections_utils.insert_collection(args)


def put_collection(args):
    """Put Collection"""
    return collections_utils.update_collection(args)


def delete_collection(args):
    """Delete Collection"""
    return collections_utils.remove_collection(args)


def get_collection_user(args):
    """Get Collection User"""
    return collections_utils.select_collection_user(args)


def get_paper(args):
    """Get Paper"""
    return papers_utils.select_paper(args)
