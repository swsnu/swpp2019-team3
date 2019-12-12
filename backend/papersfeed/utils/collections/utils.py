"""utils.py"""
# -*- coding: utf-8 -*-

from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Exists, OuterRef, Count, Case, When, Subquery
from django.db import models

from papersfeed import constants
from papersfeed.utils.base_utils import is_parameter_exists, get_results_from_queryset, ApiError
from papersfeed.models.collections.collection import Collection, COLLECTION_SHARE_TYPE
from papersfeed.models.collections.collection_like import CollectionLike
from papersfeed.models.collections.collection_user import CollectionUser, COLLECTION_USER_TYPE
from papersfeed.models.collections.collection_paper import CollectionPaper
from papersfeed.models.replies.reply_collection import ReplyCollection
from papersfeed.models.users.user import User
from papersfeed.models.users.user_action import UserAction, USER_ACTION_TYPE
from papersfeed.models.subscription.subscription import Subscription
from papersfeed.models.papers.paper import Paper


def insert_collection(args):
    """Insert Collection"""
    is_parameter_exists([
        constants.TITLE, constants.TEXT
    ], args)

    # Request User
    request_user = args[constants.USER]

    # User Id
    user_id = request_user.id

    # Title
    title = args[constants.TITLE]

    # Text
    text = args[constants.TEXT]

    request_user = args[constants.USER]

    # Check Valid
    if not title or not text:
        raise ApiError(constants.PARAMETER_ERROR)

    # Create New Collection
    collection = Collection.objects.create(title=title, text=text, type=COLLECTION_SHARE_TYPE[0])

    # store an action for subscription feed
    Subscription.objects.create(
        actor=request_user,
        verb="created",
        action_object=collection,
    )

    # Add User To Collection
    CollectionUser.objects.create(collection_id=collection.id, user_id=user_id, type=COLLECTION_USER_TYPE[0])

    collection_id = collection.id

    collections, _, _ = __get_collections(Q(id=collection_id), request_user, None)

    # Does Not Exist
    if not collections:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    collection = collections[0]

    return collection


def update_collection(args):
    """Update Collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Collection Id
    collection_id = args[constants.ID]

    # Get Collection
    try:
        collection = Collection.objects.get(id=collection_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Check Collection User Id
    if not request_user or not CollectionUser.objects.filter(collection_id=collection_id,
                                                             user_id=request_user.id).exists():
        raise ApiError(constants.AUTH_ERROR)

    # Title
    title = args[constants.TITLE]

    # Text
    text = args[constants.TEXT]

    # Update Title
    if title:
        collection.title = title

    # Update Text
    if text:
        collection.text = text

    collection.save()

    collections, _, _ = __get_collections(Q(id=collection.id), request_user, None)

    if not collections:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return collections[0]


def update_collection_type(args):
    """Update Collection Type"""
    is_parameter_exists([
        constants.ID,
        constants.TYPE
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Collection Share Type
    share_type = args[constants.TYPE]

    # Collection Id
    collection_id = args[constants.ID]

    # Check CollectionUser
    try:
        collection_user = CollectionUser.objects.get(collection_id=collection_id, user_id=request_user.id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # if request_user is not owner, then raise AUTH_ERROR
    if collection_user.type != COLLECTION_USER_TYPE[0]:
        raise ApiError(constants.AUTH_ERROR)

    # Get Collection
    try:
        collection = Collection.objects.get(id=collection_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    if share_type == COLLECTION_SHARE_TYPE[0]:
        collection.type = COLLECTION_SHARE_TYPE[0]
    elif share_type == COLLECTION_SHARE_TYPE[1]:
        collection.type = COLLECTION_SHARE_TYPE[1]
    else:
        raise ApiError(constants.PARAMETER_ERROR)

    collection.save()

    collections, _, _ = __get_collections(Q(id=collection.id), request_user, None)

    if not collections:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    return collections[0]


def remove_collection(args):
    """Remove Collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Collection Id
    collection_id = args[constants.ID]

    # Get Collection
    try:
        collection = Collection.objects.get(id=collection_id)
    except ObjectDoesNotExist:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    # Check Collection User Id
    if not request_user or not CollectionUser.objects.filter(collection_id=collection_id,
                                                             user_id=request_user.id).exists():
        raise ApiError(constants.AUTH_ERROR)

    collection.delete()


def select_collection(args):
    """Select Collection"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Collection Id
    collection_id = args[constants.ID]

    # Collections
    collections, _, _ = __get_collections(Q(id=collection_id), request_user, None)

    # Does Not Exist
    if not collections:
        raise ApiError(constants.NOT_EXIST_OBJECT)

    collection = collections[0]

    return collection


def select_collection_user(args):
    """Select User's Collections"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # User Id
    user_id = args[constants.ID]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Collections Queryset
    queryset = Q(is_user_collection=True) & (Q(type=COLLECTION_SHARE_TYPE[0]) | Q(is_member=True))

    paper_id = None
    if constants.PAPER in args and args[constants.PAPER] is not None:
        paper_id = args[constants.PAPER]

    # Collections
    params = {
        constants.PAPER_ID: paper_id,
        constants.USER_ID: user_id
    }
    collections, _, is_finished = __get_collections(queryset, request_user, 10, page_number=page_number, params=params)

    return collections, page_number, is_finished


def select_collection_user_shared(args):
    """Select User's Shared Collections"""
    is_parameter_exists([
        constants.ID
    ], args)

    # Request User
    request_user = args[constants.USER]

    # User Id
    user_id = args[constants.ID]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Collections Queryset
    queryset = Q(is_user_collection=True) & Q(is_shared=True) & (Q(type=COLLECTION_SHARE_TYPE[0]) | Q(is_member=True))

    # Collections
    params = {
        constants.USER_ID: user_id
    }
    collections, _, is_finished = __get_collections(queryset, request_user, 10, page_number=page_number, params=params)

    return collections, page_number, is_finished


def select_collection_search(args):
    """Select Collection Search"""
    is_parameter_exists([
        constants.TEXT
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Search Keyword
    keyword = args[constants.TEXT]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Collections Queryset
    queryset = (Q(title__icontains=keyword) | Q(text__icontains=keyword)) & (Q(type=COLLECTION_SHARE_TYPE[0])
                                                                             | Q(is_member=True))

    # Collections
    collections, _, is_finished = __get_collections(queryset, request_user, 10, page_number=page_number)

    return collections, page_number, is_finished


def select_collection_like(args):
    """Select Collection Like"""

    # Request User
    request_user = args[constants.USER]

    # Page Number
    page_number = 1 if constants.PAGE_NUMBER not in args else int(args[constants.PAGE_NUMBER])

    # Collection Ids
    collection_ids = CollectionLike.objects.filter(Q(user_id=request_user.id)).order_by(
        '-creation_date').values_list('collection_id', flat=True)

    # need to maintain the order
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(collection_ids)])

    # Collections
    params = {
        constants.ORDER_BY: preserved
    }
    collections, _, is_finished = __get_collections(Q(id__in=collection_ids), request_user, 10, params=params,
                                                    page_number=page_number)

    return collections, page_number, is_finished


@transaction.atomic
def update_paper_collection(args):
    """Update Paper Collection"""

    is_parameter_exists([
        constants.ID, constants.COLLECTION_IDS
    ], args)

    # Request User
    request_user = args[constants.USER]

    # Paper Id
    paper_id = args[constants.ID]

    # Collection IDs
    collection_ids = args[constants.COLLECTION_IDS]

    # Containing Collections
    containing_collection_ids = __get_collections_contains_paper(paper_id, request_user)

    # Not Containing Collections
    not_containing_collection_ids = list(set(collection_ids) - set(containing_collection_ids))

    # Add To Collections
    __add_paper_to_collections(paper_id, not_containing_collection_ids, request_user)

    # Remove From Collections
    __remove_paper_from_collections(paper_id, list(set(containing_collection_ids) - set(collection_ids)), request_user)

    # store an action for subscription feed
    if not_containing_collection_ids:
        try:
            subscription = Subscription.objects.get(
                actor=request_user,
                verb="added",
                action_object_object_id=paper_id,
                target_object_id=not_containing_collection_ids[0],
            )
            subscription.save() # for updating time
        except Subscription.DoesNotExist:
            paper = Paper.objects.get(id=paper_id)
            collection = Collection.objects.get(id=not_containing_collection_ids[0])
            Subscription.objects.create(
                actor=request_user,
                verb="added",
                action_object=paper,
                target=collection,
            )


def get_collections(filter_query, request_user, count, params=None, page_number=1):
    """Get Collections"""
    return __get_collections(filter_query, request_user, count, params=params,
                             page_number=page_number)


def __get_collections_contains_paper(paper_id, request_user):
    """Get Collections Containing paper"""
    collection_users = CollectionUser.objects.filter(
        user_id=request_user.id  # User's Collections
    ).annotate(
        exists=Exists(
            CollectionPaper.objects.filter(
                paper_id=paper_id,
                collection_id=OuterRef('collection_id')
            )
        )  # Containing Paper
    ).filter(
        exists=True
    )

    return [collection_user.collection_id for collection_user in collection_users]


def __remove_paper_from_collections(paper_id, collection_ids, request_user):
    """Remove Paper From Collections"""
    if collection_ids:
        CollectionPaper.objects.filter(
            collection_id__in=collection_ids, paper_id=paper_id
        ).delete()

    # Update action count for recommendation
    for _ in range(len(collection_ids)):
        obj = UserAction.objects.get(
            user_id=request_user.id,
            paper_id=paper_id,
            type=USER_ACTION_TYPE[0],
            )
        obj.count = obj.count - 1
        obj.save()


def __add_paper_to_collections(paper_id, collection_ids, request_user):
    """Add Paper To Collections"""
    for collection_id in collection_ids:
        CollectionPaper.objects.update_or_create(
            collection_id=collection_id, paper_id=paper_id, defaults={}
        )

    # Create action for recommendation
    try:
        obj = UserAction.objects.get(
            user_id=request_user.id,
            paper_id=paper_id,
            type=USER_ACTION_TYPE[0]
        )
        obj.count = obj.count + 1
        obj.save()
    except ObjectDoesNotExist:
        UserAction.objects.create(
            user_id=request_user.id,
            paper_id=paper_id,
            type=USER_ACTION_TYPE[0],
            count=1,
        )


def __get_collections(filter_query, request_user, count, params=None, page_number=1):
    """Get Collections By Query"""
    params = {} if params is None else params
    paper_id = None if constants.PAPER_ID not in params else params[constants.PAPER_ID]
    order_by = '-pk' if constants.ORDER_BY not in params else params[constants.ORDER_BY]
    target_user_id = request_user.id if constants.USER_ID not in params else params[constants.USER_ID]

    queryset = Collection.objects.annotate(
        is_user_collection=__is_member('id', target_user_id),
        is_member=__is_member('id', request_user.id),
        is_shared=__is_shared('id', target_user_id)
    ).filter(
        filter_query
    ).annotate(
        is_liked=__is_collection_liked('id', request_user),
        is_owned=__is_collection_owned('id', request_user),
        contains_paper=__contains_paper('id', paper_id),
        owner_id=Subquery(
            CollectionUser.objects.filter(
                collection_id=OuterRef('id'),
                type=COLLECTION_USER_TYPE[0]
            ).values(
                'user_id'
            )[:1],
            output_field=models.IntegerField()
        ),
        collection_user_type=Subquery(
            CollectionUser.objects.filter(
                collection_id=OuterRef('id'),
                user_id=request_user.id,
            ).values(
                'type'
            )[:1],
            output_field=models.CharField()
        )
    ).order_by(order_by)

    collections = get_results_from_queryset(queryset, count, page_number)

    is_finished = True
    if count is not None:
        is_finished = not collections.has_next()

    pagination_value = collections[len(collections) - 1].id if collections else 0

    collections = __pack_collections(collections, request_user, paper_id=paper_id)

    return collections, pagination_value, is_finished


# pylint: disable=unused-argument, too-many-locals
def __pack_collections(collections, request_user, paper_id=None):
    """Pack Collections"""
    packed = []

    collection_ids = [collection.id for collection in collections]

    # User Count
    user_counts = __get_collection_user_count(collection_ids, 'collection_id')

    # Paper Count
    paper_counts = __get_collection_paper_count(collection_ids, 'collection_id')

    # Like count
    like_counts = __get_collection_like_count(collection_ids, 'collection_id')

    # Reply Count
    reply_counts = __get_collection_reply_count(collection_ids, 'collection_id')

    # Owner User
    user_ids = [collection.owner_id for collection in collections]
    owner_id = int(user_ids[0]) if user_ids else None
    user = {
        constants.ID: owner_id,
        constants.USERNAME: User.objects.get(id=owner_id).username if owner_id else None
    }

    for collection in collections:
        collection_id = collection.id

        packed_collection = {
            constants.ID: collection_id,
            constants.TITLE: collection.title,
            constants.TEXT: collection.text,
            constants.LIKED: collection.is_liked,
            constants.OWNED: collection.is_owned,
            constants.COUNT: {
                constants.USERS: user_counts[collection_id] if collection_id in user_counts else 0,
                constants.PAPERS: paper_counts[collection_id] if collection_id in paper_counts else 0,
                constants.LIKES: like_counts[collection_id] if collection_id in like_counts else 0,
                constants.REPLIES: reply_counts[collection_id] if collection_id in reply_counts else 0
            },
            constants.CREATION_DATE: collection.creation_date,
            constants.MODIFICATION_DATE: collection.modification_date,
            constants.TYPE: collection.type,
            constants.COLLECTION_USER_TYPE: collection.collection_user_type,
            constants.OWNER: user
        }

        if paper_id:
            packed_collection[constants.CONTAINS_PAPER] = collection.contains_paper

        packed.append(packed_collection)

    return packed
# pylint: enable=unused-argument, too-many-locals


def __is_collection_liked(outer_ref, request_user):
    """Check If Collection is Liked by User"""
    return Exists(
        CollectionLike.objects.filter(collection_id=OuterRef(outer_ref),
                                      user_id=request_user.id if request_user else None)
    )


def __is_member(outer_ref, user_id):
    """Check If Collection is Member by User"""
    return Exists(
        CollectionUser.objects.filter(collection_id=OuterRef(outer_ref),
                                      user_id=user_id)
    )


def __is_shared(outer_ref, user_id):
    """Check If Collection is Shared"""
    return Exists(CollectionUser.objects.filter(Q(collection_id=OuterRef(outer_ref)), ~Q(user_id=user_id)))


def __is_collection_owned(outer_ref, request_user):
    """Check If Collection is Owned by User"""
    return Exists(
        CollectionUser.objects.filter(collection_id=OuterRef(outer_ref),
                                      type=COLLECTION_USER_TYPE[0],
                                      user_id=request_user.id if request_user else None)
    )


def __get_collection_like_count(collection_ids, group_by_field):
    """Get Number of Likes of Collections"""
    collection_likes = CollectionLike.objects.filter(
        collection_id__in=collection_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {collection_like[group_by_field]: collection_like['count'] for collection_like in collection_likes}


def __get_collection_user_count(collection_ids, group_by_field):
    """Get Number of Users in Collections"""
    collection_users = CollectionUser.objects.filter(
        collection_id__in=collection_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {collection_user[group_by_field]: collection_user['count'] for collection_user in collection_users}


def __get_collection_paper_count(collection_ids, group_by_field):
    """Get Number of Papers in Collections"""
    collection_papers = CollectionPaper.objects.filter(
        collection_id__in=collection_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {collection_paper[group_by_field]: collection_paper['count'] for collection_paper in collection_papers}


def __get_collection_reply_count(collection_ids, group_by_field):
    """Get Number of Replies of Collections"""
    collection_replies = ReplyCollection.objects.filter(
        collection_id__in=collection_ids
    ).values(
        group_by_field
    ).annotate(
        count=Count(group_by_field)
    ).order_by(
        group_by_field
    )

    return {collection_reply[group_by_field]: collection_reply['count'] for collection_reply in collection_replies}


def __contains_paper(outer_ref, paper_id):
    """Check If Collection contains the given Paper"""
    return Exists(
        CollectionPaper.objects.filter(collection_id=OuterRef(outer_ref), paper_id=paper_id if paper_id else None)
    )
