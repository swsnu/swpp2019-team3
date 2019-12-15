"""base_utils.py"""
# -*- coding: utf-8 -*-
import logging
import traceback
from django.http import JsonResponse
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
        # 최대 30개씩 Pagination을 하면서 찾는다
        pages = Paginator(queryset, min(30, count))

        return pages.get_page(page_num)

    return results


def view_exceptions_handler(func):
    """View Exceptions Handler"""
    def view_wrapper(request, *args, **kwargs):
        response_data = {}
        try:
            data = func(request, *args, **kwargs)
            response_data = {} if data is None else data
        except ApiError as e: # pylint: disable=invalid-name
            status_code = e.args[0]
            logging.error("\tstatus-code: %d\n%s\n%s", status_code, str(e), traceback.format_exc())
        except Exception as e:  # pylint: disable=broad-except, invalid-name
            logging.error(traceback.format_exc())
            status_code = 500
            response_data[constants.DEBUG] = {constants.ERROR: str(e),
                                              constants.DESCRIPTION: traceback.format_exc()}
            logging.error("\tstatus-code: %d\n%s\n%s", status_code, str(e), traceback.format_exc())
        else:
            if request.method.lower() == 'post':
                status_code = 201
            else:
                status_code = 200
        response = JsonResponse(response_data, safe=False)
        response.status_code = status_code
        return response
    return view_wrapper
