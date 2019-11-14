import { paperConstants } from "../../actions/actionTypes";
import { paperStatus } from "../../../constants/constants";

const initialState = {
    getPaperStatus: paperStatus.NONE,
    likePaperStatus: paperStatus.NONE,
    unlikePaperStatus: paperStatus.NONE,
    selectedPaper: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case paperConstants.GET_PAPER_SUCCESS:
        return { ...state, getPaperStatus: paperStatus.SUCCESS, selectedPaper: action.target };
    case paperConstants.GET_PAPER_FAILURE:
        return { ...state, getPaperStatus: paperStatus.FAILURE };
    case paperConstants.LIKE_PAPER_SUCCESS:
        return { ...state, likePaperStatus: paperStatus.SUCCESS };
    case paperConstants.LIKE_PAPER_FAILURE:
        return { ...state, likePaperStatus: paperStatus.FAILURE };
    case paperConstants.UNLIKE_PAPER_SUCCESS:
        return { ...state, unlikePaperStatus: paperStatus.SUCCESS };
    case paperConstants.UNLIKE_PAPER_FAILURE:
        return { ...state, unlikePaperStatus: paperStatus.FAILURE };
    default:
        return { ...state };
    }
};
export default reducer;
