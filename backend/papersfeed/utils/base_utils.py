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


def get_results_from_queryset(queryset, count):
    """Paginate Query"""
    if count is None:
        results = queryset
    else:
        # 20개씩 Pagenation을 하면서 찾는다
        pages = Paginator(queryset, min(20, count))

        results = []

        for page_num in pages.page_range:
            page = pages.page(page_num)

            for element in page:
                if len(results) >= count:
                    break

                results.append(element)

            if len(results) >= count:
                break

    return results
