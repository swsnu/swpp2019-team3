import axios from "axios";
import { collectionConstants } from "../actionTypes";

// make new collection
const makeNewCollectionSuccess = (collection) => ({
    type: collectionConstants.ADD_COLLECTION,
    data: collection,
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

export const makeNewCollection = (collection) => (dispatch) => axios.post("api/collection", collection)
    .then((res) => { dispatch(makeNewCollectionSuccess(res.data)); })
    .catch((err) => { (dispatch(makeNewCollectionFailure(err))); });

// getCollectionsByUserId

const getCollectionsByUserIdSuccess = (collections) => ({
    type: collectionConstants.GET_COLLECTIONS,
    target: collections.users,
});

const getCollectionsByUserIdFailure = (error) => ({
    type: null,
    target: error,
});

export const getCollectionsByUserId = () => (dispatch) => axios.get("api/collection/user", { params: { id: 0 } })
    .then((res) => { dispatch(getCollectionsByUserIdSuccess(res.data.data)); })
    .catch((err) => { (dispatch(getCollectionsByUserIdFailure(err))); });

// getCollection

const getCollectionSuccess = (collection) => ({
    type: collectionConstants.GET_COLLECTION,
    target: collection,
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

export const getCollection = (collectionId) => (dispatch) => axios.get("api/collection", { params: { id: collectionId } })
    .then((res) => { dispatch(getCollectionSuccess(res.data)); })
    .catch((err) => { (dispatch(getCollectionFailure(err))); });

// get papers of a collection
const getCollectionPapersSuccess = (papers) => ({
    type: collectionConstants.GET_COLLECTION_PAPERS,
    target: papers,
});

const getCollectionPapersFailure = (error) => ({
    type: null,
    target: error,
});

export const getCollectionPapers = (collectionId) => (dispatch) => axios.get("api/paper/collection", { params: { id: collectionId } })
    .then((res) => { dispatch(getCollectionPapersSuccess(res.data)); })
    .catch((err) => { (dispatch(getCollectionPapersFailure(err))); });

// getCollectionMembers - no matching api

/* export const getCollectionMembers = (collectionID) => (dispatch)
=> axios.get(`/user/collection/${collectionID}`)
    .then((res) => dispatch({
        type: actionTypes.GET_COLLECTION_MEMBERS, members: res.data,
    })); */

// getCollectionReplies - no matching api
/* export const getCollectionReplies = (collectionID) => (dispatch)
=> axios.get(`/reply/collection/${collectionID}`)
    .then((res) => dispatch({
        type: actionTypes.GET_COLLECTION_REPLIES, replies: res.data,
    })); */

// setOwner - no matching api
/* export const setOwner = (collectionID, userID) => (dispatch)
=> axios.put(`/collection/${collectionID}`, { userID })
    .then((res) => dispatch({
        type: actionTypes.CHANGE_COLLECTION_OWNER, newOwnerID: userID,
    })); */

// setNameAndDescription of collection
const setTitleAndDescriptionSuccess = (collection) => ({
    type: collectionConstants.EDIT_COLLECTION,
    target: collection,
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

export const setTitleAndDescription = (collectionId, title, description) => (dispatch) => axios.put("api/collection", { id: collectionId, title, text: description })
    .then((res) => { dispatch(setTitleAndDescriptionSuccess(res.data)); })
    .catch((err) => { (dispatch(setTitleAndDescriptionFailure(err))); });

// add paper to CollectionPaper
const addCollectionPaperSuccess = (collection) => ({
    type: collectionConstants.ADD_COLLECTION_PAPER,
    target: collection,
});

const addCollectionPaperFailure = (error) => ({
    type: null,
    target: error,
});

export const addCollectionPaper = (collectionsAndPaper) => (dispatch) => axios.put("api/paper/collection", collectionsAndPaper)
    .then((res) => { dispatch(addCollectionPaperSuccess(res.data)); })
    .catch((err) => { (dispatch(addCollectionPaperFailure(err))); });

// remove paper from collection
const removeCollectionPaperSuccess = (collection) => ({
    type: collectionConstants.DEL_COLLECTION_PAPER,
    target: collection,
});

const removeCollectionPaperFailure = (error) => ({
    type: null,
    target: error,
});

export const removeCollectionPaper = (collectionIds, paperId) => (dispatch) => axios.put("api/paper/collection", { id: paperId, collection_ids: collectionIds })
    .then((res) => { dispatch(removeCollectionPaperSuccess(res.data)); })
    .catch((err) => { (dispatch(removeCollectionPaperFailure(err))); });

// add member to collection - no matching api
/* export const addCollectionMember = (collectionID, userID) => (dispatch)
=> axios.post(`/user/collection/${collectionID}`, userID)
    .then((res) => dispatch({
        type: actionTypes.ADD_COLLECTION_MEMBER, members: res.data,
    })); */

// remove member from CollectionMember - no matching api
/* export const removeCollectionMember = (collectionID, userID) => (dispatch)
=> axios.delete(`/user/collection/${collectionID}`, userID)
    .then((res) => dispatch({
        type: actionTypes.DEL_COLLECTION_MEMBER, members: res.data,
    })); */

// deleteCollection
const deleteCollectionSuccess = (collection) => ({
    type: collectionConstants.DEL_COLLECTION,
    target: collection,
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

export const deleteCollection = (collectionId) => (dispatch) => axios.delete("api/collection", { params: { id: collectionId } })
    .then((res) => { dispatch(deleteCollectionSuccess(res.data)); })
    .catch((err) => { (dispatch(deleteCollectionFailure(err))); });

// add collection like - no matching api
// export const addCollectionLike = (collectionID) => {
//     return dispatch => {
//         return axios.get()
//             .then(res => dispatch({
//                 type: GET_COLLECION_MEMBERS, members: res.data
//         }));
//     };
// };

// removeCollectionLike - no matching api
// export const removeCollectionLike = (collectionID) => {
//     return dispatch => {
//         return axios.get()
//             .then(res => dispatch({
//                 type: GET_COLLECION_MEMBERS, members: res.data
//         }));
//     };
// };
