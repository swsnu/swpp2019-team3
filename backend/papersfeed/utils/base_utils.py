"""base_utils.py"""
# -*- coding: utf-8 -*-
from django.core.paginator import Paginator
from papersfeed import constants


class ApiError(Exception):
    """raise ApiError"""


def is_parameter_exists(requirements, args):
    """Parameter Checker"""
    for requirement in requirements:

        # If requirement not in arguments, raise parameter error
        if requirement not in args or args[requirement] is None:
            raise ApiError(constants.PARAMETER_ERROR)


def get_results_from_queryset(queryset, count, page_num=0):
    """Paginate Query"""
    if count is None:
        results = queryset
    else:
        # 최대 20개씩 Pagination을 하면서 찾는다
        pages = Paginator(queryset, min(20, count))

        return pages.get_page(page_num)

    return results
