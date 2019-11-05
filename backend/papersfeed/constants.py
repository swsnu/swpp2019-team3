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
LIKES = 'likes'
TYPE = 'type'

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
COLLECTION = 'collection'
COLLECTION_IDS = 'collection_ids'
TITLE = 'title'
TEXT = 'text'

# Paper
PAPER = 'paper'
PAPERS = 'papers'
LANGUAGE = 'language'
ABSTRACT = 'abstract'
ISSN = 'ISSN'
EISSN = 'eISSN'
DOI = 'DOI'
FILE_URL = 'file_url'
DOWNLOAD_URL = 'download_url'

# Author
AUTHOR = 'author'
AUTHORS = 'authors'
FIRST_NAME = 'first_name'
LAST_NAME = 'last_name'
ADDRESS = 'address'
RESEARCHER_ID = 'researcher_id'
RANK = 'rank'

# Review
REVIEW = 'review'
REVIEWS = 'reviews'

# Keyword
KEYWORD = 'keyword'
KEYWORDS = 'keywords'
NAME = 'name'

# Paper Publication
VOLUME = 'volume'
ISSUE = 'issue'
DATE = 'date'
BEGINNING_PAGE = 'beginning_page'
ENDING_PAGE = 'ending_page'
ISBN = 'ISBN'

# Publication
PUBLICATION = 'publication'

# Publisher
PUBLISHER = 'publisher'
CITY = 'city'

# Reply
REPLY = 'reply'
REPLIES = 'replies'
