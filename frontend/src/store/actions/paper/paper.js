import axios from "axios";
import { paperConstants } from "../actionTypes";

const getPaperSuccess = (paper) => ({
    type: paperConstants.GET_PAPER_SUCCESS,
    target: paper.paper,
});

const getPaperFailure = (error) => {
    let actionType = null;
    switch (error.response.status) {
    case 404:
        actionType = paperConstants.GET_PAPER_FAILURE;
        break;
    default:
        break;
    }
    return {
        type: actionType,
        target: error,
    };
};

export const getPaper = (paperId) => (dispatch) => axios.get("/api/paper", { params: paperId })
    .then((res) => dispatch(getPaperSuccess(res.data)))
    .catch((err) => dispatch(getPaperFailure(err)));


const likePaperSuccess = (count) => ({
    type: paperConstants.LIKE_PAPER_SUCCESS,
    target: count.count,
});

const likePaperFailure = (error) => ({
    type: paperConstants.LIKE_PAPER_FAILURE,
    target: error,
});

export const likePaper = (paperId) => (dispatch) => axios.post("/api/like/paper", paperId)
    .then((res) => dispatch(likePaperSuccess(res.data)))
    .catch((err) => dispatch(likePaperFailure(err)));


const unlikePaperSuccess = (count) => ({
    type: paperConstants.UNLIKE_PAPER_SUCCESS,
    target: count.count,
});

const unlikePaperFailure = (error) => ({
    type: paperConstants.UNLIKE_PAPER_FAILURE,
    target: error,
});

export const unlikePaper = (paperId) => (dispatch) => axios.delete("/api/like/paper", { params: paperId })
    .then((res) => dispatch(unlikePaperSuccess(res.data)))
    .catch((err) => dispatch(unlikePaperFailure(err)));


const searchPaperSuccess = (papers) => ({
    type: paperConstants.SEARCH_PAPER_SUCCESS,
    target: papers.papers,
});

const searchPaperFailure = (error) => ({
    type: paperConstants.SEARCH_PAPER_FAILURE,
    target: error,
});

export const searchPaper = (searchWord) => (dispatch) => axios.get("/api/paper/search", { params: searchWord })
    .then((res) => dispatch(searchPaperSuccess(res.data)))
    .catch((err) => dispatch(searchPaperFailure(err)));
