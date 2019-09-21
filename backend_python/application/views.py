# -*- coding: utf-8 -*-

# Python Modules
import os
import json
import datetime
import traceback

# Django Modules
from django.http import HttpResponse, UnreadablePostError
from django.views.decorators.csrf import csrf_exempt

# Internal Modules
from backend_python.utils import ApiError
from . import apis
from .constants import *


def api_not_found():
    raise ApiError(404)


@csrf_exempt
def api_entry(request, api, second_api=None, third_api=None, fourth_api=None):
    # API 요청에 Return 할 Response Initialize
    response_data = {}

    # Method와 API Path를 이용해 Function을 찾아 실행시킨다
    # ——————————————————————————
    method = request.method.upper()
    api_function = method.lower() + '_' + api
    path = '/' + api  # 요청 Path

    if second_api is not None:
        api_function += '_' + second_api
        path += '/' + second_api

    if third_api is not None:
        api_function += '_' + third_api
        path += '/' + third_api

    if fourth_api is not None:
        api_function += '_' + fourth_api
        path += '/' + fourth_api

    handler = getattr(apis, api_function, api_not_found)

    if handler is not api_not_found:
        try:
            if request.method == 'GET' or request.method == 'DELETE':
                # request.GET은 QueryDict을 리턴하므로 이를 Python dict으로 바꿔준다
                args = request.GET.dict()
            else:
                args = request.POST

                # POST의 경우 request.body 상의 json data를 arg로 넘겨주어야한다
                if len(request.body) > 0:
                    body = json.loads(request.body.decode())

                    if isinstance(body, dict):
                        args = body

            # Functions 실행
            data = handler(args)
            response_data[DATA] = {} if data is None else data

        except ApiError as e :
            status_code = e.args[0]
        except UnreadablePostError:
            status_code = 500
        except Exception as e:
            status_code = 500

            response_data[DEBUG] = traceback.format_exc()
        else:
            status_code = 200

    else:
        status_code = 404

    response = HttpResponse(json.dumps(response_data), 'application/json; charset=UTF-8')
    response.status_code = status_code

    return response

