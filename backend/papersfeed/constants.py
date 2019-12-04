"""constants.py"""
# -*- coding: utf-8 -*-

# Api Error Code
AUTH_ERROR = 403  # 인증 오류, 권한 없음 혹은 비밀번호 오류
PARAMETER_ERROR = 400  # 필수 파라미터 에러 (syntax, parsing error)
NOT_AVAILABLE_API = 405  # 지원하지 않는 API 버전
INVALID_SESSION = 440  # 잘못된 세션
NOT_EXIST_OBJECT = 404  # 존재하지 않는 Object
USERNAME_ALREADY_EXISTS = 419  # 이미 존재하는 사용자 이름
EMAIL_ALREADY_EXISTS = 420  # 이미 존재하는 이메일
UNPROCESSABLE_ENTITY = 422  # semantic error (ex> self following)
INVALID_JSON = 520  # json.loads 에러

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
PAGE_NUMBER = 'page_number'
IS_FINISHED = 'is_finished'
CREATION_DATE = 'creation_date'
MODIFICATION_DATE = 'modification_date'
CONTENT = 'content'
SEARCH_WORD = 'search_word'
ORDER_BY = 'order_by'

# User
USER = 'user'
USERS = 'users'
USER_ID = 'user_id'
USER_IDS = 'user_ids'
EMAIL = 'email'
USERNAME = 'username'
PASSWORD = 'password'
IS_FOLLOWING = 'is_following'
IS_FOLLOWED = 'is_followed'
FOLLOWER = 'follower'
FOLLOWING = 'following'
COLLECTION_USER_TYPE = 'collection_user_type'

# Notification
NOTIFICATION = 'notification'
NOTIFICATIONS = 'notifications'
ACTOR = 'actor'
VERB = 'verb'
TARGET = 'target'
ACTION_OBJECT = 'action_object'
TIMESINCE = 'timesince'
STRING = 'string'

# Subsciption
SUBSCRIPTION = 'subscription'
SUBSCRIPTIONS = 'subscriptions'

# Collection
COLLECTION = 'collection'
COLLECTIONS = 'collections'
COLLECTION_ID = 'collection_id'
COLLECTION_IDS = 'collection_ids'
TITLE = 'title'
TEXT = 'text'
CONTAINS_PAPER = 'contains_paper'
OWNED = 'owned'
INCLUDES_ME = 'includes_me'

# Paper
PAPER = 'paper'
PAPERS = 'papers'
PAPER_ID = 'paper_id'
LANGUAGE = 'language'
TITLES = 'titles'
ABSTRACT = 'abstract'
ISSN = 'ISSN'
EISSN = 'eISSN'
DOI = 'DOI'
FILE_URL = 'file_url'
DOWNLOAD_URL = 'download_url'
SOURCE = 'source'

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

#Recommendation
ACTIONS = 'actions'
RECOMMENDATIONS = 'recommendations'
