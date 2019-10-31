"""apis.py"""
# -*- coding: utf-8 -*-

# Internal Modules
from papersfeed.utils.papers import utils as papers_utils
from papersfeed.utils.users import utils as users_utils


def post_follow(args):
    """Post Follow"""
    return users_utils.insert_follow(args)


def delete_follow(args):
    """Delete Follow"""
    return users_utils.remove_follow(args)


def get_session(args):
    """Get Session"""
    return users_utils.select_session(args)


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
