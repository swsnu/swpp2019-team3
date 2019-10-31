"""views.py"""
# -*- coding: utf-8 -*-

# Python Modules
import os
import json
import datetime
import traceback

# Django Modules
from django.http import JsonResponse, UnreadablePostError
from django.views.decorators.csrf import ensure_csrf_cookie

# Internal Modules
from papersfeed.utils import ApiError
from . import apis
from . import constants


def api_not_found():
    """api_not_found"""
    raise ApiError(404)


@ensure_csrf_cookie
def api_entry(request, api, second_api=None, third_api=None, fourth_api=None):
    # API 요청에 Return 할 Response Initialize
    response_data = {}

    # Method와 API Path를 이용해 Function을 찾아 실행시킨다
    # ——————————————————————————
    method = request.method.upper()
    api_function = method.lower() + '_' + api

    if second_api is not None:
        api_function += '_' + second_api

    if third_api is not None:
        api_function += '_' + third_api

    if fourth_api is not None:
        api_function += '_' + fourth_api

    handler = getattr(apis, api_function, api_not_found)

    if handler is not api_not_found:
        try:
            if request.method == 'GET' or request.method == 'DELETE':
                # request.GET은 QueryDict을 리턴하므로 이를 Python dict으로 바꿔준다
                args = request.GET.dict()
            else:
                args = request.POST

                # POST의 경우 request.body 상의 json data를 arg로 넘겨주어야한다
                body = json.loads(request.body.decode()) if request.body else None
                if isinstance(body, dict):
                    args = body

            # Auth
            if not request.user.is_authenticated:
                raise ApiError(constants.AUTH_ERROR)
            else:
                args[constants.USER] = request.user

            # Functions 실행
            data = handler(args)
            response_data[constants.DATA] = {} if data is None else data

        except ApiError as error:
            status_code = error.args[0]
        except UnreadablePostError:
            status_code = 500
        except Exception as error:  # pylint: disable=broad-except
            status_code = 500

            response_data[constants.DEBUG] = {constants.ERROR: error, constants.DESCRIPTION: traceback.format_exc()}
        else:
            status_code = 200

    else:
        status_code = 404

    response = JsonResponse(response_data, safe=False)
    response.status_code = status_code

    return response
