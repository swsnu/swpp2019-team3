import axios from "axios";
import * as actionTypes from "../ActionTypes";

// setReviewContent(review_id:number, review_title: string, review_content: string)
// -> Promise<{status: number, data: Review}>
export const setReviewContent = (reviewId, reviewTitle, reviewContent) => (dispatch) => axios.put("/review", { id: reviewId, title: reviewTitle, content: reviewContent })
    .then((res) => dispatch({
        type: actionTypes.EDIT_REVIEW, data: res.data,
    }));

// makeNewReview(paper_id: number, user_id: number, title: string, content: string)
// -> Promise<{status: number, data: Review}>
export const makeNewReview = (paperId, userId, reviewTitle, reviewContent) => (dispatch) => axios.post("/review", {
    paper: paperId, author: userId, title: reviewTitle, content: reviewContent,
})
    .then((res) => dispatch({
        type: actionTypes.EDIT_REVIEW, data: res.data,
    }));

// getReview(review_id: number)
// -> Promise<{status: number, data: Review}>
export const getReview = (reviewId) => (dispatch) => axios.get("/review", { review: reviewId })
    .then((res) => dispatch({
        type: actionTypes.GET_REVIEW, data: res.data,
    }));

// addReviewLike(review_id:number, user_id:number)
// -> Promise<{status: number, data: Review}>
export const addReviewLike = (reviewId, userId) => (dispatch) => axios.post("/like/review", { user: userId, review: reviewId })
    .then((res) => dispatch({
        type: actionTypes.LIKE_REVIEW, data: res.data,
    }));

// removeReviewLike(review_id:number, user_id:number)
// -> Promise<{status: number, data: Review}>
export const removeReviewLike = (reviewId, userId) => (dispatch) => axios.delete("/like/review", { user: userId })
    .then((res) => dispatch({
        type: actionTypes.LIKE_REVIEW_CANCEL, data: res.data,
    }));

// deleteReview(review_id:number)
// -> Promise<{status: number, data: Review}>
export const deleteReview = (reviewId) => (dispatch) => axios.delete("/review", { review: reviewId })
    .then((res) => dispatch({
        type: actionTypes.DEL_REVIEW, data: res.data,
    }));

// getReviewLikesCount(review_id)
// -> Promise<{status: number, data: number}>
export const getReviewLikesCount = (reviewId) => (dispatch) => axios.get("like/review", { review: reviewId })
    .then((res) => dispatch({
        type: actionTypes.GET_REVIEW_LIKES_COUNT, data: res.data,
    }));

// getReviewIsLiked(review_id:number, user_id:number)
// -> Promise<{status: number, data: boolean}>
export const getReviewIsLiked = (reviewId, userId) => (dispatch) => axios.get("like/review", { review: reviewId, user: userId })
    .then((res) => dispatch({
        type: actionTypes.GET_REVIEW_LIKES_COUNT, data: res.data,
    }));

// consumeReview(review_id: number, user_id: number)
// -> Promise<{status: number, data: Review}>
export const consumeReview = (reviewId, userId) => (dispatch) => axios.post("/consume/review", { user: userId, review: reviewId })
    .then((res) => dispatch({
        type: actionTypes.CONSUME_REVIEW, data: res.data,
    }));

// getReviewsByPaperId(paper_id: number) -> Promise<{status: number, data: Review[]}>
// getReviewsByUserId(user_id: number) -> Promise<{status: number, data: Review[]}>
// getRecentReviewsByUserId(user_id: number) -> Promise<{status: number, data: Review[]}>
