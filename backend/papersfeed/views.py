"""views.py"""
# -*- coding: utf-8 -*-

# Python Modules
import logging
import json
import traceback

# Django Modules
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

# Internal Modules
from papersfeed.utils.base_utils import ApiError
from papersfeed.models.users.user import User
from . import apis
from . import constants


def api_not_found():
    """api_not_found"""
    raise ApiError(404)


@ensure_csrf_cookie
def token(request):
    """token"""
    if request.method == 'GET':
        return HttpResponse(status=204)

    return HttpResponseNotAllowed(['GET'])


@csrf_exempt
def api_entry(request, api, second_api=None, third_api=None, fourth_api=None):
    """api_entry"""
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
            # Get args with request
            args = __get_args(request)

            args[constants.REQUEST] = request

            # Session Check
            if api_function not in [
                    'get_session',
                    'post_user',
                    'get_paper_search_ml',
                    'get_user_action',
                    'post_user_recommendation',
                    'get_user_all',
                    'get_paper_all'
                ]:
                __check_session(args, request)

            # Functions 실행
            data = handler(args)
            response_data = {} if data is None else data

        except ApiError as error:
            status_code = error.args[0]
            logging.error("\tstatus-code: %d\n%s\n%s", status_code, str(error), traceback.format_exc())
        except Exception as error:  # pylint: disable=broad-except
            logging.error(traceback.format_exc())
            status_code = 500
            response_data[constants.DEBUG] = {constants.ERROR: str(error),
                                              constants.DESCRIPTION: traceback.format_exc()}
            logging.error("\tstatus-code: %d\n%s\n%s", status_code, str(error), traceback.format_exc())
        else:
            if api_function.startswith('post'):
                status_code = 201
            else:
                status_code = 200
    else:
        status_code = 404

    response = JsonResponse(response_data, safe=False)
    response.status_code = status_code

    return response


def __get_args(request):
    if request.method == 'GET':
        # request.GET은 QueryDict을 리턴하므로 이를 Python dict으로 바꿔준다.
        args = request.GET.dict()
        return args

    if request.method == 'DELETE':
        # request.GET은 QueryDict을 리턴하므로 이를 Python dict으로 바꿔준다
        args = request.GET.dict()

        # DELETE의 경우 request.body 상의 json data를 arg로 넘겨주어야한다
        body = json.loads(request.body.decode()) if request.body else None
        if isinstance(body, dict):
            args = body
        return args

    args = request.POST

    # POST의 경우 request.body 상의 json data를 arg로 넘겨주어야한다
    body = json.loads(request.body.decode()) if request.body else None
    if isinstance(body, dict):
        args = body

    return args


def __check_session(args, request):
    # User Id
    user_id = request.session.get(constants.ID, None)
    if not user_id:
        raise ApiError(constants.AUTH_ERROR)

    try:
        # Get User By Id
        user = User.objects.get(id=user_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.AUTH_ERROR)
    else:
        args[constants.USER] = user
