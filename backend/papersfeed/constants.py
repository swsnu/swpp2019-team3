"""constants.py"""
# -*- coding: utf-8 -*-

# Api Error Code
AUTH_ERROR = 403  # 인증 오류, 권한 없음 혹은 비밀번호 오류
PARAMETER_ERROR = 400  # 필수 파라미터 에러
NOT_AVAILABLE_API = 405  # 지원하지 않는 API 버전
INVALID_SESSION = 440  # 잘못된 세션
NOT_EXIST_OBJECT = 404  # 존재하지 않는 Object
USERNAME_ALREADY_EXISTS = 419  # 이미 존재하는 사용자 이름
EMAIL_ALREADY_EXISTS = 420  # 이미 존재하는 이메일


# Common
DATA = 'data'
DEBUG = 'debug'
ERROR = 'error'
DESCRIPTION = 'description'
ID = 'id'
COUNT = 'count'
SESSION = 'session'
REQUEST = 'request'
LIKED = 'liked'

# User
USER = 'user'
USERS = 'users'
EMAIL = 'email'
USERNAME = 'username'
PASSWORD = 'password'
IS_FOLLOWING = 'is_following'
IS_FOLLOWED = 'is_followed'
FOLLOWER = 'follower'
FOLLOWING = 'following'

# Collection
TITLE = 'title'
TEXT = 'text'

# Paper
PAPER = 'paper'
PAPERS = 'papers'
