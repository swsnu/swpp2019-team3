/* eslint-disable max-len */
/* import axios from "axios";
import * as actionTypes from "../ActionTypes";

// makeNewReply(review_id: number, user_id: number, content: string)
// -> Promise<{status: number, data: Reply}>: Call backend api to make a new reply.
export const makeNewReply = (reviewId, userId, replyContent) => (dispatch) => axios.post("/reply/review", { author: userId, review: reviewId, content: replyContent })
    .then((res) => dispatch({
        type: actionTypes.MAKE_REVIEW_REPLY, data: res.data,
    }));

// getRepliesByReviewId(review_id: number)
// -> Promise<{status: number, data: Reply}>:
// Call backend api to get replies related to the selected review.
export const getRepliesByReviewId = (reviewId) => (dispatch) => axios.get("/reply/review", { reply: reviewId })
    .then((res) => dispatch({
        type: actionTypes.GET_REPLIES_BY_REVIEW, data: res.data,
    }));

// setReplyContent(reply_id: number, content:string)
// -> Promise<{status: number, data: Reply}>:
// Call backend api to set the content of the selected reply.
export const setReplyContent = (replyId, replyContent) => (dispatch) => axios.put("/reply/review", { reply: replyId, content: replyContent })
    .then((res) => dispatch({
        type: actionTypes.EDIT_REVIEW_REPLY, data: res.data,
    }));

// addReplyLike(reply_id: number, user_id:number)
// -> Promise<{status: number, data: Reply}>:
// Call backend api to add the user to the list of the users who like the reply.
export const addReplyLike = (replyId, userId) => (dispatch) => axios.post("/like/reply", { reply: replyId, user: userId })
    .then((res) => dispatch({
        type: actionTypes.LIKE_REVIEW_REPLY, data: res.data,
    }));

// removeReplyLike(reply_id: number, user_id:number)
// -> Promise<{status: number, data: Reply}>:
// Call backend api to remove the user from the list of the users who like the reply.
export const removeReplyLike = (replyId, userId) => (dispatch) => axios.delete("/like/reply", { user: userId, reply: replyId })
    .then((res) => dispatch({
        type: actionTypes.LIKE_REVIEW_REPLY_CANCEL, data: res.data,
    }));

// deleteReply(reply_id: number)
// -> Promise<{status: number, data: Reply}>: Call backend api to delete the reply.
export const deleteReply = (replyId) => (dispatch) => axios.delete("/reply/review", { reply: replyId })
    .then((res) => dispatch({
        type: actionTypes.DEL_REVIEW_REPLY, data: res.data,
    }));

// getReplyLikesCount(reply_id)
// -> Promise<{status: number, data: number}>:
// Call backend api to get the number of users who like this reply.
export const getReplyLikesCount = (replyId) => (dispatch) => axios.get("like/reply", { reply: replyId })
    .then((res) => dispatch({
        type: actionTypes.GET_REVIEW_LIKES_COUNT, data: res.data,
    }));

// getReplyIsLiked(reply_id:number, user_id:number)
// -> Promise<{status: number, data: boolean}>:
// Call backend api to check if the current user likes the reply.
export const getReplyIsLiked = (replyId, userId) => (dispatch) => axios.get("like/reply", { reply: replyId, user: userId })
    .then((res) => dispatch({
        type: actionTypes.GET_REVIEW_REPLY_IS_LIKED, data: res.data,
    }));
*/
