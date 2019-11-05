import axios from "axios";
import paperConstants from "./actionTypes";

const getPaperSuccess = (paper) => ({
    type: paperConstants.GET_PAPER_SUCCESS,
    target: paper,
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

export const getPaper = (paperId) => (dispatch) => axios.post("/api/paper", paperId)
    .then((res) => dispatch(getPaperSuccess(res.data)))
    .catch((err) => dispatch(getPaperFailure(err)));
