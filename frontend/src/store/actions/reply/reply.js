import axios from "axios";
import { replyConstants } from "../actionTypes";

// get replies by collection id
const getRepliesByCollectionSucess = (replies) => ({
    type: replyConstants.GET_REPLIES_BY_COLLECTION_SUCCESS,
    target: replies,
});

const getRepliesByCollectionFailure = (error) => ({
    type: null,
    target: error,
});

export const getRepliesByCollection = (collectionIdAndPage) => (dispatch) => axios.get(
    "/api/reply/collection",
    { params: collectionIdAndPage },
)
    .then((res) => dispatch(getRepliesByCollectionSucess(res.data)))
    .catch((err) => dispatch(getRepliesByCollectionFailure(err)));

// get replies by review id
const getRepliesByReviewSuccess = (replies) => ({
    type: replyConstants.GET_REPLIES_BY_REVIEW_SUCCESS,
    target: replies,
});

const getRepliesByReviewFailure = (error) => ({
    type: null,
    target: error,
});

export const getRepliesByReview = (reviewIdAndPage) => (dispatch) => axios.get("/api/reply/review", { params: reviewIdAndPage })
    .then((res) => dispatch(getRepliesByReviewSuccess(res.data)))
    .catch((err) => dispatch(getRepliesByReviewFailure(err)));

// make new reply collection
const makeNewReplyCollectionSuccess = (reply) => ({
    type: replyConstants.ADD_REPLY_SUCCESS,
    target: reply.reply,
});

const makeNewReplyCollectionFailure = (error) => {
    let actionType = null;

    if (error.response.status === 400) {
        actionType = replyConstants.ADD_REPLY_FAILURE_MISSING_PARAM;
    } else if (error.response.status === 404) {
        actionType = replyConstants.ADD_REPLY_FAILURE_COLLECTION_NOT_EXIST;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const makeNewReplyCollection = (reply) => (dispatch) => axios.post("/api/reply/collection", reply)
    .then((res) => dispatch(makeNewReplyCollectionSuccess(res.data)))
    .catch((err) => dispatch(makeNewReplyCollectionFailure(err)));

// make new reply review
const makeNewReplyReviewSuccess = (reply) => ({
    type: replyConstants.ADD_REPLY_SUCCESS,
    target: reply.reply,
});

const makeNewReplyReviewFailure = (error) => {
    let actionType = null;

    if (error.response.status === 400) {
        actionType = replyConstants.ADD_REPLY_FAILURE_MISSING_PARAM;
    } else if (error.response.status === 404) {
        actionType = replyConstants.ADD_REPLY_FAILURE_REVIEW_NOT_EXIST;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const makeNewReplyReview = (reply) => (dispatch) => axios.post("/api/reply/review", reply)
    .then((res) => dispatch(makeNewReplyReviewSuccess(res.data)))
    .catch((err) => dispatch(makeNewReplyReviewFailure(err)));

// edit reply collection
const editReplyCollectionSuccess = (reply) => ({
    type: replyConstants.EDIT_REPLY_SUCCESS,
    target: reply.reply,
});

const editReplyCollectionFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = replyConstants.EDIT_REPLY_FAILURE_REPLY_NOT_EXIST;
    } else if (error.response.status === 403) {
        actionType = replyConstants.EDIT_REPLY_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const editReplyCollection = (reply) => (dispatch) => axios.put("/api/reply/collection", reply)
    .then((res) => dispatch(editReplyCollectionSuccess(res)))
    .catch((err) => dispatch(editReplyCollectionFailure(err)));

// edit reply review
const editReplyReviewSuccess = (reply) => ({
    type: replyConstants.EDIT_REPLY_SUCCESS,
    target: reply.reply,
});

const editReplyReviewFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = replyConstants.EDIT_REPLY_FAILURE_REPLY_NOT_EXIST;
    } else if (error.response.status === 403) {
        actionType = replyConstants.EDIT_REPLY_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const editReplyReview = (reply) => (dispatch) => axios.put("/api/reply/review", reply)
    .then((res) => dispatch(editReplyReviewSuccess(res)))
    .catch((err) => dispatch(editReplyReviewFailure(err)));

// delete reply collection
const deleteReplyCollectionSuccess = (error) => ({
    type: replyConstants.DEL_REPLY_SUCCESS,
    target: error,
});

const deleteReplyCollectionFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = replyConstants.DEL_REPLY_FAILURE_REPLY_NOT_EXIST;
    } else if (error.response.status === 403) {
        actionType = replyConstants.DEL_REPLY_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const deleteReplyCollection = (replyId) => (dispatch) => axios.delete("/api/reply/collection", { params: replyId })
    .then((res) => dispatch(deleteReplyCollectionSuccess(res.data)))
    .catch((err) => dispatch(deleteReplyCollectionFailure(err)));

// delete reply review
const deleteReplyReviewSuccess = (error) => ({
    type: replyConstants.DEL_REPLY_SUCCESS,
    target: error,
});

const deleteReplyReviewFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = replyConstants.DEL_REPLY_FAILURE_REPLY_NOT_EXIST;
    } else if (error.response.status === 403) {
        actionType = replyConstants.DEL_REPLY_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const deleteReplyReview = (replyId) => (dispatch) => axios.delete("/api/reply/review", { params: replyId })
    .then((res) => dispatch(deleteReplyReviewSuccess(res.data)))
    .catch((err) => dispatch(deleteReplyReviewFailure(err)));

// like reply
const likeReplySuccess = (count) => ({
    type: replyConstants.LIKE_REPLY_SUCCESS,
    target: count.count,
});

const likeReplyFailure = (error) => ({
    type: null,
    target: error,
});

export const likeReply = (replyId) => (dispatch) => axios.post("/api/like/reply", replyId)
    .then((res) => dispatch(likeReplySuccess(res.data)))
    .catch((err) => dispatch(likeReplyFailure(err)));


// unlike reply
const unlikeReplySuccess = (count) => ({
    type: replyConstants.UNLIKE_REPLY_SUCCESS,
    target: count.count,
});

const unlikeReplyFailure = (error) => ({
    type: null,
    target: error,
});

export const unlikeReply = (replyId) => (dispatch) => axios.delete("/api/like/reply", { params: replyId })
    .then((res) => dispatch(unlikeReplySuccess(res.data)))
    .catch((err) => dispatch(unlikeReplyFailure(err)));
