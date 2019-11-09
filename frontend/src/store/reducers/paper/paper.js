import { paperConstants } from "../../actions/actionTypes";
import { getPaperStatus } from "../../../constants/constants";

const initialState = {
    getPaperStatus: getPaperStatus.NONE,
    selectedPaper: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case paperConstants.GET_PAPER_SUCCESS:
        return { ...state, getPaperStatus: getPaperStatus.SUCCESS, selectedPaper: action.target };
    case paperConstants.GET_PAPER_FAILURE:
        return { ...state, getPaperStatus: getPaperStatus.FAILURE };
    default:
        return { ...state };
    }
};
export default reducer;
