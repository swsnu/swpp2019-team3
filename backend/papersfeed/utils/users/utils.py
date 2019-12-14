"""utils.py"""
# -*- coding: utf-8 -*-
import uuid
import hashlib
import json

from django.db import IntegrityError, transaction
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count
from notifications.signals import notify

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.utils.collections.utils import __get_collection_user_count
from papersfeed.models.users.user import User
from papersfeed.models.users.user_follow import UserFollow
from papersfeed.models.collections.collection import Collection
from papersfeed.models.collections.collection_user import CollectionUser, COLLECTION_USER_TYPE


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

    # User Photo Index
    photo_index = args[constants.PHOTO_INDEX] if constants.PHOTO_INDEX in args else None

    # Update Descrpition
    if description is not None: #deleting description also should be supported
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

    if photo_index is not None:
        user.photoIndex = photo_index

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

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # User Queryset
    queryset = User.objects.filter(Q(username__icontains=keyword)).values_list('id', flat=True)

    total_count = queryset.count() # count whole users

    # User Ids
    user_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not user_ids.has_next()

    # Users
    users, _, _ = __get_users(Q(id__in=user_ids), request_user, 10)

    return users, page_number, is_finished, total_count


def select_user_following(args):
    """Select Users User is Following"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Requested User ID
    requested_user_id = args[constants.ID]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Check User Id
    if not User.objects.filter(id=requested_user_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Following QuerySet
    queryset = UserFollow.objects.filter(following_user=requested_user_id).values_list('followed_user', flat=True)

    # User Ids
    user_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not user_ids.has_next()

    # Filter Query
    filter_query = Q(id__in=user_ids)

    # Users
    users, _, _ = __get_users(filter_query, request_user, 10)

    return users, page_number, is_finished


def select_user_followed(args):
    """Select User’s Followers"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Requested User ID
    requested_user_id = args[constants.ID]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Check User Id
    if not User.objects.filter(id=requested_user_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Follower QuerySet
    queryset = UserFollow.objects.filter(followed_user=requested_user_id).values_list('following_user', flat=True)

    # User Ids
    user_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not user_ids.has_next()

    # Filter Query
    filter_query = Q(id__in=user_ids)

    # Users
    users, _, _ = __get_users(filter_query, request_user, 10)

    return users, page_number, is_finished


def get_users(filter_query, request_user, count):
    """Public Get Users"""
    return __get_users(filter_query, request_user, count)


def insert_follow(args):
    """Insert Follow"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Followed User Id
    followed_user_id = int(args[constants.ID])

    # Following User
    request_user = args[constants.USER]
    following_user_id = request_user.id

    # Self Follow
    if followed_user_id == following_user_id:
        raise ApiError(constants.UNPROCESSABLE_ENTITY)

    # If Not Already Following, Create One
    if not UserFollow.objects.filter(following_user_id=following_user_id, followed_user_id=followed_user_id).exists():
        userfollow = UserFollow(following_user_id=following_user_id, followed_user_id=followed_user_id)
        userfollow.save()

        followed_user = User.objects.get(id=followed_user_id)

        notify.send(
            request_user,
            recipient=[followed_user],
            verb='started following you',
            action_object=userfollow,
            target=followed_user
        )

    follow_counts = __get_follower_count([followed_user_id], 'followed_user_id')
    return {constants.FOLLOWER: follow_counts[followed_user_id] if followed_user_id in follow_counts else 0}


def remove_follow(args):
    """Remove Follow"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Followed User Id
    followed_user_id = int(args[constants.ID])

    # Following User
    following_user_id = args[constants.USER].id

    # Delete Existing Follow
    UserFollow.objects.filter(following_user_id=following_user_id, followed_user_id=followed_user_id).delete()

    follow_counts = __get_follower_count([followed_user_id], 'followed_user_id')
    return {constants.FOLLOWER: follow_counts[followed_user_id] if followed_user_id in follow_counts else 0}


def select_user_collection(args):
    """Get Users of the given Collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    collection_id = args[constants.ID]

    request_user = args[constants.USER]

    # Decide if results include request_user if she or he is one of members
    includes_me = True if constants.INCLUDES_ME not in args else json.loads(args[constants.INCLUDES_ME])

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Check Collection Id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Members QuerySet
    if includes_me:
        query = Q(collection_id=collection_id)
    else:
        query = Q(collection_id=collection_id) & ~Q(user_id=request_user.id)

    queryset = CollectionUser.objects.filter(query)

    # Members(including owner) Of Collections
    collection_members = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not collection_members.has_next()

    # Member Ids
    member_ids = [collection_member.user_id for collection_member in collection_members]
    member_ids = list(set(member_ids))

    # Get Members
    params = {
        constants.COLLECTION_ID: collection_id
    }
    members, _, _ = __get_users(Q(id__in=member_ids), request_user, 10, params=params)

    return members, page_number, is_finished


def insert_user_collection(args):
    """Add Users(members) of the given Collection"""
    is_parameter_exists([
        constants.ID, constants.USER_IDS
    ], args)

    collection_id = int(args[constants.ID])
    user_ids = args[constants.USER_IDS]

    request_user = args[constants.USER]

    # Check Collection Id
    try:
        collection = Collection.objects.get(id=collection_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Self Add
    if request_user.id in user_ids:
        raise ApiError(constants.UNPROCESSABLE_ENTITY)

    # Add Users to Collection
    for user_id in user_ids:
        CollectionUser.objects.update_or_create(
            collection_id=collection_id,
            user_id=user_id,
            type=COLLECTION_USER_TYPE[2], # pending until invitees accept
        )

    invited_users = User.objects.filter(Q(id__in=user_ids))
    notify.send(
        request_user,
        recipient=invited_users,
        verb='invited you to',
        target=collection
    )

    # Get the number of Members(including owner) Of Collections
    user_counts = __get_collection_user_count([collection_id], 'collection_id')
    return {constants.USERS: user_counts[collection_id] if collection_id in user_counts else 0}


@transaction.atomic
def update_user_collection(args):
    """Transfer ownership of the Collection to the User"""
    is_parameter_exists([
        constants.ID, constants.USER_ID
    ], args)

    collection_id = int(args[constants.ID])
    user_id = args[constants.USER_ID]

    request_user = args[constants.USER]

    # Revoke ownership from request_user
    try:
        collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # if request_user is not owner, then raise AUTH_ERROR
    if collection_user.type != COLLECTION_USER_TYPE[0]:
        raise ApiError(constants.AUTH_ERROR)

    collection_user.type = COLLECTION_USER_TYPE[1]  # change to member
    collection_user.save()

    # Grant ownership to the user whose id is user_id
    try:
        collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=user_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    collection_user.type = COLLECTION_USER_TYPE[0]  # change to owner
    collection_user.save()


def remove_user_collection(args):
    """Remove the Users from the Collection"""
    is_parameter_exists([
        constants.ID, constants.USER_IDS
    ], args)

    collection_id = int(args[constants.ID])
    user_ids = json.loads(args[constants.USER_IDS])

    request_user = args[constants.USER]

    # Check Collection Id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # if request_user is not owner, then raise AUTH_ERROR
    collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=request_user.id)
    if collection_user.type != COLLECTION_USER_TYPE[0]:
        raise ApiError(constants.AUTH_ERROR)

    # the owner cannot delete himself or herself
    # if the owner want to leave a collection, he or she must transfer it to other user
    # or deleting the collection would be a solution
    if request_user.id in user_ids:
        raise ApiError(constants.UNPROCESSABLE_ENTITY)

    CollectionUser.objects.filter(user_id__in=user_ids, collection_id=collection_id).delete()

    # Get the number of Members(including owner) Of Collections
    user_counts = __get_collection_user_count([collection_id], 'collection_id')
    return {constants.USERS: user_counts[collection_id] if collection_id in user_counts else 0}


def remove_user_collection_self(args):
    """Leave the collection (member)"""
    is_parameter_exists([
        constants.ID
    ], args)

    collection_id = int(args[constants.ID])

    request_user = args[constants.USER]

    # Check Collection Id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    try:
        collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # if request_user is not member, then raise AUTH_ERROR
    # the owner cannot delete himself or herself
    # if the owner want to leave a collection, he or she must transfer it to other user
    # or deleting the collection would be a solution
    if collection_user.type != COLLECTION_USER_TYPE[1]:
        raise ApiError(constants.AUTH_ERROR)


def update_user_collection_pending(args):
    """'pending' user accepts invitation"""
    is_parameter_exists([
        constants.ID
    ], args)

    collection_id = int(args[constants.ID])

    request_user = args[constants.USER]

    # Check CollectionUser
    try:
        collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Check Collection Id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # if request_user is not 'pending', then raise AUTH_ERROR
    if collection_user.type != COLLECTION_USER_TYPE[2]:
        raise ApiError(constants.AUTH_ERROR)

    collection_user.type = COLLECTION_USER_TYPE[1]  # change to member
    collection_user.save()

    # Get the number of Members(including owner) Of Collections
    user_counts = __get_collection_user_count([collection_id], 'collection_id')
    return {constants.USERS: user_counts[collection_id] if collection_id in user_counts else 0}


def remove_user_collection_pending(args):
    """'pending' user dismisses invitation"""
    is_parameter_exists([
        constants.ID
    ], args)

    collection_id = int(args[constants.ID])

    request_user = args[constants.USER]

    # Check Collection Id
    if not Collection.objects.filter(id=collection_id).exists():
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Check CollectionUser
    try:
        collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # if request_user is not 'pending', then raise AUTH_ERROR
    if collection_user.type != COLLECTION_USER_TYPE[2]:
        raise ApiError(constants.AUTH_ERROR)

    collection_user.delete()


def select_user_following_collection(args):
    """Get Following Users Not in Collection"""
    is_parameter_exists([
        constants.COLLECTION_ID
    ], args)

    # Collection ID
    collection_id = args[constants.COLLECTION_ID]

    # Request User
    request_user = args[constants.USER]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # QuerySet
    queryset = UserFollow.objects.annotate(
        is_in_collection=__is_in_collection('followed_user', collection_id)
    ).filter(
        following_user=request_user.id,
        is_in_collection=False
    ).values_list('followed_user', flat=True)

    # User Ids
    user_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not user_ids.has_next()

    # Filter Query
    filter_query = Q(id__in=user_ids)

    # Users
    users, _, _ = __get_users(filter_query, request_user, 10)

    return users, page_number, is_finished


def select_user_search_collection(args):
    """Search Users Not in Collection"""
    is_parameter_exists([
        constants.TEXT, constants.COLLECTION_ID
    ], args)

    # Collection ID
    collection_id = args[constants.COLLECTION_ID]

    # Request User
    request_user = args[constants.USER]

    # Search Keyword
    keyword = args[constants.TEXT]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # User Queryset
    queryset = User.objects.annotate(
        is_in_collection=__is_in_collection('id', collection_id)
    ).filter(
        username__icontains=keyword,
        is_in_collection=False
    ).values_list('id', flat=True)

    # User Ids
    user_ids = get_results_from_queryset(queryset, 10, page_number)

    # is_finished
    is_finished = not user_ids.has_next()

    # Users
    users, _, _ = __get_users(Q(id__in=user_ids), request_user, 10)

    return users, page_number, is_finished


def __get_users(filter_query, request_user, count, params=None):
    """Get Users By Query"""
    params = {} if params is None else params
    collection_id = None if constants.COLLECTION_ID not in params else params[constants.COLLECTION_ID]

    queryset = User.objects.filter(
        filter_query
    ).annotate(
        is_following=__is_following('id', request_user),
        is_followed=__is_followed('id', request_user)
    )

    # FIXME: This function needs refactoring so that it works like that of collections/utils or reviews/utils
    total_count = queryset.count() if constants.TOTAL_COUNT in params else None

    users = get_results_from_queryset(queryset, count)

    pagination_value = users[len(users) - 1].id if users else 0

    users = __pack_users(users, request_user, collection_id=collection_id)

    return users, pagination_value, total_count


def __pack_users(users, request_user, collection_id=None):
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
            constants.PHOTO_INDEX: user.photoIndex,
            constants.COUNT: {
                constants.FOLLOWER: follower_counts[user_id] if user_id in follower_counts else 0,
                constants.FOLLOWING: following_counts[user_id] if user_id in following_counts else 0
            }
        }

        if request_user and user.id != request_user.id:
            # 내 정보가 아니면 follow 관계 여부 추가
            packed_user[constants.IS_FOLLOWED] = user.is_followed
            packed_user[constants.IS_FOLLOWING] = user.is_following

        if collection_id:
            packed_user[constants.COLLECTION_USER_TYPE] = CollectionUser.objects.get(
                user_id=user_id, collection_id=collection_id
            ).type

        packed.append(packed_user)

    return packed


def __is_in_collection(outer_ref, collection_id):
    """Check User in Collection"""
    # NOTE: This function assume 'pending' users are members of the collection.
    #       So, 'pending' users don't appear on InviteToCollectionModal
    return Exists(
        CollectionUser.objects.filter(
            user_id=OuterRef(outer_ref),
            collection_id=collection_id
        )
    )


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
