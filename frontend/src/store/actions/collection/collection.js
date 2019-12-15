import axios from "axios";
import { collectionConstants } from "../actionTypes";

// make new collection
const makeNewCollectionSuccess = (collection) => ({
    type: collectionConstants.ADD_COLLECTION,
    target: collection.collection,
});

const makeNewCollectionFailure = (error) => {
    let actionType = null;
    if (error.response.status === 400) {
        actionType = collectionConstants.ADD_COLLECTION_FAILURE_MISSING_PARAM;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const makeNewCollection = (collection) => (dispatch) => axios.post("/api/collection", collection)
    .then((res) => { dispatch(makeNewCollectionSuccess(res.data)); })
    .catch((err) => { (dispatch(makeNewCollectionFailure(err))); });


// getCollectionsByUserId
const getCollectionsByUserIdSuccess = (data) => ({
    type: collectionConstants.GET_COLLECTIONS_SUCCESS,
    target: {
        collections: data.collections,
        pageNum: data.page_number,
        finished: data.is_finished,
        totalCount: data.total_count,
    },
});

const getCollectionsByUserIdFailure = (error) => ({
    type: collectionConstants.GET_COLLECTIONS_FAILURE,
    target: error,
});

// params can be { id: user_id } or { id: user_id, paper: id }
export const getCollectionsByUserId = (params) => (dispatch) => axios.get("/api/collection/user", { params })
    .then((res) => { dispatch(getCollectionsByUserIdSuccess(res.data)); })
    .catch((err) => { (dispatch(getCollectionsByUserIdFailure(err))); });


const getSharedCollectionsByUserIdSuccess = (data) => ({
    type: collectionConstants.GET_SHARED_COLLECTIONS_SUCCESS,
    target: {
        collections: data.collections,
        pageNum: data.page_number,
        finished: data.is_finished,
        totalCount: data.total_count,
    },
});

const getSharedCollectionsByUserIdFailure = (error) => ({
    type: collectionConstants.GET_SHARED_COLLECTIONS_FAILURE,
    target: error,
});

export const getSharedCollectionsByUserId = (userId) => (dispatch) => axios.get("/api/collection/user/shared", { params: userId })
    .then((res) => { dispatch(getSharedCollectionsByUserIdSuccess(res.data)); })
    .catch((err) => { (dispatch(getSharedCollectionsByUserIdFailure(err))); });


// getCollection
const getCollectionSuccess = (collection) => ({
    type: collectionConstants.GET_COLLECTION,
    target: collection.collection,
});

const getCollectionFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = collectionConstants.GET_COLLECTION_FAILURE_COLLECTION_NOT_EXIST;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const getCollection = (collectionId) => (dispatch) => axios.get("/api/collection", { params: collectionId })
    .then((res) => { dispatch(getCollectionSuccess(res.data)); })
    .catch((err) => { dispatch(getCollectionFailure(err)); });


// get papers of a collection
const getCollectionPapersSuccess = (data) => ({
    type: collectionConstants.GET_COLLECTION_PAPERS_SUCCESS,
    target: data,
});

const getCollectionPapersFailure = (error) => ({
    type: collectionConstants.GET_COLLECTION_PAPERS_FAILURE,
    target: error,
});

export const getCollectionPapers = (collectionId) => (dispatch) => axios.get("/api/paper/collection", { params: collectionId })
    .then((res) => { dispatch(getCollectionPapersSuccess(res.data)); })
    .catch((err) => { (dispatch(getCollectionPapersFailure(err))); });

const getCollectionMembersSuccess = (data) => ({
    type: collectionConstants.GET_COLLECTION_MEMBERS_SUCCESS,
    target: { members: data.users, pageNum: data.page_number, finished: data.is_finished },
});

const getCollectionMembersFailure = (error) => ({
    type: collectionConstants.GET_COLLECTION_MEMBERS_FAILURE,
    target: error,
});

export const getCollectionMembers = (collectionID, pageNum, includesMe = true) => (dispatch) => axios.get("/api/user/collection", { params: { id: collectionID, page_number: pageNum, includes_me: includesMe } })
    .then((res) => { dispatch(getCollectionMembersSuccess(res.data)); })
    .catch((err) => { dispatch(getCollectionMembersFailure(err)); });


const setOwnerSuccess = () => ({
    type: collectionConstants.SET_OWNER,
});

const setOwnerFailure = (error) => {
    let actionType = null;
    if (error.response.status === 403) {
        actionType = collectionConstants.SET_OWNER_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const setOwner = (collectionId, targetUserId) => (dispatch) => axios.put("/api/user/collection", { id: collectionId, user_id: targetUserId })
    .then(() => dispatch(setOwnerSuccess()))
    .catch((err) => { dispatch(setOwnerFailure(err)); });


const acceptInvitationSuccess = (count) => ({
    type: collectionConstants.ACCEPT_INVITATION_SUCCESS,
    target: count.count,
});

const acceptInvitationFailure = (error) => ({
    type: collectionConstants.ACCEPT_INVITATION_FAILURE,
    target: error,
});

export const acceptInvitation = (collectionId) => (dispatch) => axios.put("/api/user/collection/pending", { id: collectionId })
    .then((res) => dispatch(acceptInvitationSuccess(res.data)))
    .catch((err) => dispatch(acceptInvitationFailure(err)));


const dismissInvitationSuccess = () => ({
    type: collectionConstants.DISMISS_INVITATION_SUCCESS,
    target: null,
});

const dismissInvitationFailure = (error) => ({
    type: collectionConstants.DISMISS_INVITATION_FAILURE,
    target: error,
});

export const dismissInvitation = (collectionId) => (dispatch) => axios.delete("/api/user/collection/pending", { params: { id: collectionId } })
    .then(() => { dispatch(dismissInvitationSuccess()); })
    .catch((err) => { dispatch(dismissInvitationFailure(err)); });


// setNameAndDescription of collection
const setTitleAndDescriptionSuccess = (collection) => ({
    type: collectionConstants.EDIT_COLLECTION,
    target: collection.collection,
});

const setTitleAndDescriptionFailure = (error) => {
    let actionType = null;
    if (error.response.status === 404) {
        actionType = collectionConstants.EDIT_COLLECTION_FAILURE_COLLECTION_NOT_EXIST;
    }
    if (error.response.status === 403) {
        actionType = collectionConstants.EDIT_COLLECTION_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const setTitleAndDescription = (collectionInfo) => (dispatch) => axios.put("/api/collection", collectionInfo)
    .then((res) => { dispatch(setTitleAndDescriptionSuccess(res.data)); })
    .catch((err) => { (dispatch(setTitleAndDescriptionFailure(err))); });


// add paper to CollectionPaper
const addCollectionPaperSuccess = (collection) => ({
    type: collectionConstants.ADD_COLLECTION_PAPER,
    target: collection.collection,
});

const addCollectionPaperFailure = (error) => ({
    type: null,
    target: error,
});

export const addCollectionPaper = (collectionsAndPaper) => (dispatch) => axios.put("/api/paper/collection", collectionsAndPaper)
    .then((res) => { dispatch(addCollectionPaperSuccess(res.data)); })
    .catch((err) => { dispatch(addCollectionPaperFailure(err)); });

const addNewMembersSuccess = (count) => ({
    type: collectionConstants.ADD_COLLECTION_MEMBER,
    target: count.count,
});

const addNewMembersFailure = (error) => {
    let actionType = null;
    if (error.response.status === 403) {
        actionType = collectionConstants.ADD_COLLECTION_MEMBER_FAILURE_NOT_AUTHORIZED;
    }
    if (error.response.status === 422) {
        actionType = collectionConstants.ADD_COLLECTION_MEMBER_FAILURE_SELF_ADDING;
    }
    return {
        type: actionType,
        target: error,
    };
};

export const addNewMembers = (collectionId, userIdList) => (dispatch) => axios.post("/api/user/collection", { id: collectionId, user_ids: userIdList })
    .then((res) => { dispatch(addNewMembersSuccess(res.data)); })
    .catch((err) => { dispatch(addNewMembersFailure(err)); });


const deleteMembersSuccess = (count) => ({
    type: collectionConstants.DEL_COLLECTION_MEMBER,
    target: count.count,
});

const deleteMembersFailure = (error) => {
    let actionType = null;
    if (error.response.status === 403) {
        actionType = collectionConstants.DEL_COLLECTION_MEMBER_FAILURE_NOT_AUTHORIZED;
    }
    if (error.response.status === 422) {
        actionType = collectionConstants.DEL_COLLECTION_MEMBER_FAILURE_MORE_THAN_USERCOUNT;
    }
    return {
        type: actionType,
        target: error,
    };
};

export const deleteMembers = (collectionId, userIdList) => (dispatch) => axios.delete("/api/user/collection", { params: { id: collectionId, user_ids: JSON.stringify(userIdList) } })
    .then((res) => { dispatch(deleteMembersSuccess(res.data)); })
    .catch((err) => { dispatch(deleteMembersFailure(err)); });


// deleteCollection
const deleteCollectionSuccess = (collection) => ({
    type: collectionConstants.DEL_COLLECTION,
    target: collection.collection,
});

const deleteCollectionFailure = (error) => {
    let actionType = null;
    if (error.response.status === 404) {
        actionType = collectionConstants.DEL_COLLECTION_FAILURE_COLLECTION_NOT_EXIST;
    }
    if (error.response.status === 403) {
        actionType = collectionConstants.DEL_COLLECTION_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const deleteCollection = (collectionId) => (dispatch) => axios.delete("/api/collection", { params: { id: collectionId } })
    .then((res) => { dispatch(deleteCollectionSuccess(res.data)); })
    .catch((err) => { (dispatch(deleteCollectionFailure(err))); });


const likeCollectionSuccess = (count) => ({
    type: collectionConstants.LIKE_COLLECTION_SUCCESS,
    target: count.count,
});

const likeCollectionFailure = (error) => ({
    type: collectionConstants.LIKE_COLLECTION_FAILURE,
    target: error,
});

export const likeCollection = (collectionId) => (dispatch) => axios.post("/api/like/collection", collectionId)
    .then((res) => dispatch(likeCollectionSuccess(res.data)))
    .catch((err) => dispatch(likeCollectionFailure(err)));


const unlikeCollectionSuccess = (count) => ({
    type: collectionConstants.UNLIKE_COLLECTION_SUCCESS,
    target: count.count,
});

const unlikeCollectionFailure = (error) => ({
    type: collectionConstants.UNLIKE_COLLECTION_FAILURE,
    target: error,
});

export const unlikeCollection = (collectionId) => (dispatch) => axios.delete("/api/like/collection", { params: collectionId })
    .then((res) => dispatch(unlikeCollectionSuccess(res.data)))
    .catch((err) => dispatch(unlikeCollectionFailure(err)));


const searchCollectionSuccess = (data) => ({
    type: collectionConstants.SEARCH_COLLECTION_SUCCESS,
    target: {
        collections: data.collections,
        pageNum: data.page_number,
        finished: data.is_finished,
        totalCount: data.total_count,
    },
});

const searchCollectionFailure = (error) => ({
    type: collectionConstants.SEARCH_COLLECTION_FAILURE,
    target: error,
});

export const searchCollection = (searchWord, pageNum) => (dispatch) => axios.get("/api/collection/search", { params: { text: searchWord, page_number: pageNum } })
    .then((res) => dispatch(searchCollectionSuccess(res.data)))
    .catch((err) => dispatch(searchCollectionFailure(err)));


// Get Collection Like
const getCollectionLikeSuccess = (data) => ({
    type: collectionConstants.GET_COLLECTION_LIKE_SUCCESS,
    target: {
        collections: data.collections,
        pageNum: data.page_number,
        finished: data.is_finished,
    },
});

const getCollectionLikeFailure = (error) => ({
    type: collectionConstants.GET_COLLECTION_LIKE_FAILURE,
    target: error,
});

export const getCollectionLike = (pageNum) => (dispatch) => axios.get("/api/collection/like", { params: pageNum })
    .then((res) => dispatch(getCollectionLikeSuccess(res.data)))
    .catch((err) => dispatch(getCollectionLikeFailure(err)));


// Change Collection Type
const changeCollectionTypeSuccess = (data) => ({
    type: collectionConstants.CHANGE_COLLECTION_TYPE_SUCCESS,
    target: data.collection,
});

const changeCollectionTypeFailure = (error) => ({
    type: collectionConstants.CHANGE_COLLECTION_TYPE_FAILURE,
    target: error,
});

export const changeCollectionType = (collectionId, collectionType) => (dispatch) => axios.put("/api/collection/type", { id: collectionId, type: collectionType })
    .then((res) => dispatch(changeCollectionTypeSuccess(res.data)))
    .catch((err) => dispatch(changeCollectionTypeFailure(err)));

const deleteCollectionPaperSuccess = (count) => ({
    type: collectionConstants.DEL_COLLECTION_PAPER_SUCCESS,
    target: count.count.papers,
});

const deleteCollectionPaperFailure = (error) => ({
    type: collectionConstants.DEL_COLLECTION_PAPER_FAILURE,
    target: error,
});

export const deleteCollectionPaper = (collectionAndPaper) => (dispatch) => axios.delete("/api/paper/collection", { params: collectionAndPaper })
    .then((res) => dispatch(deleteCollectionPaperSuccess(res.data)))
    .catch((err) => dispatch(deleteCollectionPaperFailure(err)));
