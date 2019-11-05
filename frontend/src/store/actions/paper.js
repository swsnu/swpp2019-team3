import axios from "axios";
import { paperConstants } from "./actionTypes";

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

const getPaper = (paperId) => (dispatch) => axios.get("/api/paper", { params: paperId })
    .then((res) => dispatch(getPaperSuccess(res.data.data)))
    .catch((err) => dispatch(getPaperFailure(err)));
export default getPaper;
