"""utils.py"""
# -*- coding: utf-8 -*-
import uuid
import hashlib

from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.models.users.user import User
from papersfeed.models.users.user_follow import UserFollow


def select_session(args):
    """Sign In"""
    is_parameter_exists([
        constants.EMAIL, constants.PASSWORD
    ], args)

    # Email
    email = args[constants.EMAIL]

    # Password
    password = args[constants.PASSWORD]

    # Request
    request = args[constants.REQUEST]

    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)
    else:
        if not __is_correct_password(password, user):
            raise ApiError(constants.AUTH_ERROR)

        # Set Session Id
        request.session[constants.ID] = user.id

    users, _, _ = __get_users(Q(id=user.id), user, None)
    if not users:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return users[0]


def delete_session(args):
    """Sign Out"""
    # Request
    request = args[constants.REQUEST]

    try:
        del request.session[constants.ID]
    except KeyError:
        pass


def select_me(args):
    """Get Current User"""

    # Request User-
    request_user = args[constants.USER] if constants.USER in args else None

    # User ID
    user_id = request_user.id

    users, _, _ = __get_users(Q(id=user_id), request_user, None)

    if not users:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return users[0]


def insert_user(args):
    """Insert New User"""
    is_parameter_exists([
        constants.EMAIL, constants.USERNAME, constants.PASSWORD
    ], args)

    # # Request User
    # request_user = args[constants.USER]

    # Email
    email = args[constants.EMAIL]

    # User Name
    username = args[constants.USERNAME]

    # Password
    password = args[constants.PASSWORD]

    # Check parameters are valid
    if not email or not username or not password:
        raise ApiError(constants.PARAMETER_ERROR)

    # Check username
    if User.objects.filter(username=username).exists():
        raise ApiError(constants.USERNAME_ALREADY_EXISTS)

    # Check email
    if User.objects.filter(email=email).exists():
        raise ApiError(constants.EMAIL_ALREADY_EXISTS)

    hashed, salt = __hash_password(password)

    try:
        user = User.objects.create_user(
            description=None, email=email, username=username, password=hashed, salt=salt
        )
    except IntegrityError:
        raise ApiError(constants.USERNAME_ALREADY_EXISTS)

    users, _, _ = __get_users(Q(id=user.id), user, None)

    if not users:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return users[0]


def update_user(args):
    """Update User"""

    # User
    user = args[constants.USER]

    # Descrpition
    description = args[constants.DESCRIPTION] if constants.DESCRIPTION in args else None

    # Email
    email = args[constants.EMAIL] if constants.EMAIL in args else None

    # User Name
    username = args[constants.USERNAME] if constants.USERNAME in args else None

    # Password
    password = args[constants.PASSWORD] if constants.PASSWORD in args else None

    # Update Descrpition
    if description:
        # Change Description
        user.description = description

    # Update Email
    if email:
        # Check email
        if User.objects.filter(email=email).exists():
            raise ApiError(constants.EMAIL_ALREADY_EXISTS)

        # Change Email
        user.email = email

    # Update User Name
    if username:
        # Check username
        if User.objects.filter(username=username).exists():
            raise ApiError(constants.USERNAME_ALREADY_EXISTS)

        # Change User Name
        user.username = username

    # Update Password
    if password:
        hashed, salt = __hash_password(password)

        # Change Password
        user.password = hashed
        user.salt = salt

    user.save()

    users, _, _ = __get_users(Q(id=user.id), user, None)

    if not users:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return users[0]


def remove_user(args):
    """Resign"""

    # Request User
    request_user = args[constants.USER]

    # Request
    request = args[constants.REQUEST]

    # Delete Session
    try:
        del request.session[constants.ID]
    except KeyError:
        pass

    # Delete User
    request_user.delete()


def select_user(args):
    """Get Single User"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER] if constants.USER in args else None

    # User ID
    user_id = args[constants.ID]

    users, _, _ = __get_users(Q(id=user_id), request_user, None)

    if not users:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return users[0]


def select_user_search(args):
    """Select User Search"""
    is_parameter_exists([
        constants.TEXT
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Search Keyword
    keyword = args[constants.TEXT]

    # User Ids
    user_ids = User.objects.filter(Q(username__icontains=keyword)) \
        .values_list('id', flat=True)

    # Filter Query
    filter_query = Q(id__in=user_ids)

    # Users
    users, _, _ = __get_users(filter_query, request_user, None)

    return users


def get_users(filter_query, request_user, count):
    """Public Get Users"""
    return __get_users(filter_query, request_user, count)


def __get_users(filter_query, request_user, count):
    """Get Users By Query"""
    queryset = User.objects.filter(
        filter_query
    ).annotate(
        is_following=__is_following('id', request_user),
        is_followed=__is_followed('id', request_user)
    )

    users = get_results_from_queryset(queryset, count)

    pagination_value = users[len(users) - 1].id if users else 0

    is_finished = len(users) < count if count and pagination_value != 0 else True

    users = __pack_users(users, request_user)

    return users, pagination_value, is_finished


def __pack_users(users, request_user):
    """Pack User Info"""
    packed = []

    user_ids = [user.id for user in users]

    # Follower Count
    follower_counts = __get_follower_count(user_ids, 'followed_user_id')

    # Following Count
    following_counts = __get_following_count(user_ids, 'following_user_id')

    for user in users:
        user_id = user.id

        packed_user = {
            constants.ID: user_id,
            constants.USERNAME: user.username,
            constants.EMAIL: user.email,
            constants.DESCRIPTION: user.description if user.description else '',
            constants.COUNT: {
                constants.FOLLOWER: follower_counts[user_id] if user_id in follower_counts else 0,
                constants.FOLLOWING: following_counts[user_id] if user_id in following_counts else 0
            }
        }

        if request_user and user.id != request_user.id:
            # 내 정보가 아니면 follow 관계 여부 추가
            packed_user[constants.IS_FOLLOWED] = user.is_followed
            packed_user[constants.IS_FOLLOWING] = user.is_following

        packed.append(packed_user)

    return packed


def insert_follow(args):
    """Insert Follow"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Followed User Id
    followed_user_id = args[constants.ID]

    # Following User
    following_user_id = args[constants.USER].id

    # Self Follow
    if followed_user_id == following_user_id:
        raise ApiError(constants.PARAMETER_ERROR)

    # If Not Already Following, Create One
    if not UserFollow.objects.filter(following_user_id=following_user_id, followed_user_id=followed_user_id).exists():
        UserFollow.objects.create(following_user_id=following_user_id, followed_user_id=followed_user_id)

    follow_counts = __get_follower_count([followed_user_id], 'followed_user_id')
    return {constants.FOLLOWER: follow_counts[followed_user_id] if followed_user_id in follow_counts else 0}


def remove_follow(args):
    """Remove Follow"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Followed User Id
    followed_user_id = args[constants.ID]

    # Following User
    following_user_id = args[constants.USER].id

    # Delete Existing Follow
    UserFollow.objects.filter(following_user_id=following_user_id, followed_user_id=followed_user_id).delete()

    follow_counts = __get_follower_count([followed_user_id], 'followed_user_id')
    return {constants.FOLLOWER: follow_counts[followed_user_id] if followed_user_id in follow_counts else 0}


def __is_following(outer_ref, request_user):
    """Check User Following"""
    return Exists(
        UserFollow.objects.filter(
            followed_user_id=OuterRef(outer_ref),
            following_user_id=request_user.id if request_user else None
        )
    )


def __is_followed(outer_ref, request_user):
    """Check User Followed"""
    return Exists(
        UserFollow.objects.filter(
            followed_user_id=request_user.id if request_user else None,
            following_user_id=OuterRef(outer_ref)
        )
    )


def __get_follower_count(user_ids, group_by_field):
    """User Follower Count"""
    followers = UserFollow.objects.filter(
        Q(followed_user_id__in=user_ids)
    ).values(
        group_by_field
    ).annotate(
        follower_count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {follower[group_by_field]: follower['follower_count'] for follower in followers}


def __get_following_count(user_ids, group_by_field):
    """User Following Count"""
    followings = UserFollow.objects.filter(
        Q(following_user_id__in=user_ids)
    ).values(
        group_by_field
    ).annotate(
        following_count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {following[group_by_field]: following['following_count'] for following in followings}


def __hash_password(password):
    """Hash Password"""
    salt = str(uuid.uuid4())

    hashed_password = hashlib.sha256(salt.encode() + password.encode()).hexdigest()

    return hashed_password, salt


# 비밀번호 확인
def __is_correct_password(password, user):
    if user.salt is None:
        raise ApiError(constants.AUTH_ERROR)

    hashed_password = hashlib.sha256(user.salt.encode() + password.encode()).hexdigest()

    return hashed_password == user.password
