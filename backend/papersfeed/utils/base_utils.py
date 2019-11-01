"""base_utils.py"""
# -*- coding: utf-8 -*-
from papersfeed import constants


class ApiError(Exception):
    """raise ApiError"""


def is_parameter_exists(requirements, args):
    """Parameter Checker"""
    for requirement in requirements:

        # If requirement not in arguments, raise parameter error
        if requirement not in args or args[requirement] is None:
            raise ApiError(constants.PARAMETER_ERROR)
