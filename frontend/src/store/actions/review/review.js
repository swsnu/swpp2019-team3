import axios from "axios";
import { reviewConstants } from "../actionTypes";

// make new review
const makeNewReviewSuccess = (review) => ({
    type: reviewConstants.ADD_REVIEW,
    target: review.review,
});

const makeNewReviewFailure = (error) => {
    let actionType = null;

    if (error.response.status === 400) {
        actionType = reviewConstants.ADD_REVIEW_FAILURE_MISSING_PARAM;
    } else if (error.response.status === 404) {
        actionType = reviewConstants.ADD_REVIEW_FAILURE_PAPER_NOT_EXIST;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const makeNewReview = (review) => (dispatch) => axios.post("/api/review", review)
    .then((res) => dispatch(makeNewReviewSuccess(res.data)))
    .catch((err) => dispatch(makeNewReviewFailure(err)));

// get reviews by paper id
const getReviewsByPaperIdSuccess = (reviews) => (
    {
        type: reviewConstants.GET_REVIEWS_BY_PAPER,
        target: reviews.reviews,
    }
);

const getReviewsByPaperIdFailure = (error) => (
    {
        type: null,
        target: error,
    }
);

export const getReviewsByPaperId = (paperId) => (dispatch) => axios.get("/api/review/paper", { params: paperId })
    .then((res) => dispatch(getReviewsByPaperIdSuccess(res.data)))
    .catch((err) => dispatch(getReviewsByPaperIdFailure(err)));

// get rviews by user id
const getReviewsByUserIdSuccess = (reviews) => (
    {
        type: reviewConstants.GET_REVIEWS_BY_USER,
        target: reviews.reviews,
    }
);

const getReviewsByUserIdFailure = (error) => (
    {
        type: null,
        target: error,
    }
);

export const getReviewsByUserId = (userId) => (dispatch) => axios.get("/api/review/user", { params: userId })
    .then((res) => dispatch(getReviewsByUserIdSuccess(res.data)))
    .catch((err) => dispatch(getReviewsByUserIdFailure(err)));

// get recent reviews by user id - no matching api
const getReviewSuccess = (review) => (
    {
        type: reviewConstants.GET_REVIEW,
        target: review.review,
    }
);

const getReviewFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = reviewConstants.GET_REVIEW_FAILURE_REVIEW_NOT_EXIST;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const getReview = (reviewId) => (dispatch) => axios.get("/api/review", { params: reviewId })
    .then((res) => dispatch(getReviewSuccess(res.data)))
    .catch((err) => dispatch(getReviewFailure(err)));

// edit review
const setReviewContentSuccess = (review) => ({
    type: reviewConstants.EDIT_REVIEW,
    target: review.review,
});

const setReviewContentFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = reviewConstants.EDIT_REVIEW_FAILURE_REVIEW_NOT_EXIST;
    } else if (error.response.status === 403) {
        actionType = reviewConstants.EDIT_REVIEW_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const setReviewContent = (review) => (dispatch) => axios.put("/api/review", review)
    .then((res) => dispatch(setReviewContentSuccess(res.data)))
    .catch((err) => dispatch(setReviewContentFailure(err)));

// add review like
const likeReviewSuccess = (count) => ({
    type: reviewConstants.LIKE_REVIEW_SUCCESS,
    target: count.count,
});

const likeReviewFailure = (error) => ({
    type: reviewConstants.LIKE_REVIEW_FAILURE,
    target: error,
});

export const likeReview = (reviewId) => (dispatch) => axios.post("/api/like/review", reviewId)
    .then((res) => dispatch(likeReviewSuccess(res.data)))
    .catch((err) => dispatch(likeReviewFailure(err)));

// remove review like
const unlikeReviewSuccess = (count) => ({
    type: reviewConstants.UNLIKE_REVIEW_SUCCESS,
    target: count.count,
});

const unlikeReviewFailure = (error) => ({
    type: reviewConstants.UNLIKE_REVIEW_FAILURE,
    target: error,
});

export const unlikeReview = (reviewId) => (dispatch) => axios.delete("/api/like/review", { params: reviewId })
    .then((res) => dispatch(unlikeReviewSuccess(res.data)))
    .catch((err) => dispatch(unlikeReviewFailure(err)));

// delete review
const deleteReviewSuccess = (review) => ({
    type: reviewConstants.DEL_REVIEW,
    target: review,
});

const deleteReviewFailure = (error) => {
    let actionType = null;

    if (error.response.status === 404) {
        actionType = reviewConstants.DEL_REVIEW_FAILURE_REVIEW_NOT_EXIST;
    } else if (error.response.status === 403) {
        actionType = reviewConstants.DEL_REVIEW_FAILURE_AUTH_ERROR;
    }

    return {
        type: actionType,
        target: error,
    };
};

export const deleteReview = (reviewId) => (dispatch) => axios.delete("/api/review", { params: reviewId })
    .then((res) => dispatch(deleteReviewSuccess(res.data)))
    .catch((err) => dispatch(deleteReviewFailure(err)));

// consume review - no matching api
