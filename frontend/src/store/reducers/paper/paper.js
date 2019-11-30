import { paperConstants } from "../../actions/actionTypes";
import { paperStatus } from "../../../constants/constants";

const initialState = {
    getPaperStatus: paperStatus.NONE,
    likePaperStatus: paperStatus.NONE,
    likeCount: 0,
    unlikePaperStatus: paperStatus.NONE,
    unlikeCount: 0,
    selectedPaper: {},
    search: {
        status: paperStatus.NONE,
        papers: [],
        pageNum: 0,
        finished: true,
    },
    getLikedPapers: {
        status: paperStatus.NONE,
        list: [],
        pageNum: 0,
        finished: true,
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case paperConstants.GET_PAPER_SUCCESS:
        return { ...state, getPaperStatus: paperStatus.SUCCESS, selectedPaper: action.target };
    case paperConstants.GET_PAPER_FAILURE:
        return { ...state, getPaperStatus: paperStatus.FAILURE };
    case paperConstants.LIKE_PAPER_SUCCESS:
        return { ...state, likePaperStatus: paperStatus.SUCCESS, likeCount: action.target.likes };
    case paperConstants.LIKE_PAPER_FAILURE:
        return { ...state, likePaperStatus: paperStatus.FAILURE };
    case paperConstants.UNLIKE_PAPER_SUCCESS:
        return {
            ...state,
            unlikePaperStatus: paperStatus.SUCCESS,
            unlikeCount: action.target.likes,
        };
    case paperConstants.UNLIKE_PAPER_FAILURE:
        return { ...state, unlikePaperStatus: paperStatus.FAILURE };
    case paperConstants.SEARCH_PAPER_SUCCESS:
        return {
            ...state,
            search: {
                status: paperStatus.SUCCESS,
                papers: action.target.papers,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case paperConstants.SEARCH_PAPER_FAILURE:
        return {
            ...state,
            search: {
                status: paperStatus.FAILURE,
                papers: [],
                pageNum: 0,
                finished: false,
            },
        };
    case paperConstants.GET_PAPER_LIKE_SUCCESS:
        return {
            ...state,
            getLikedPapers: {
                ...state.getLikedPapers,
                status: paperStatus.SUCCESS,
                list: action.target.papers,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case paperConstants.GET_PAPER_LIKE_FAILURE:
        return {
            ...state,
            getLikedPapers: {
                ...state.getLikedPapers,
                status: paperStatus.FAILURE,
                pageNum: 0,
                finished: true,
            },
        };
    default:
        return { ...state };
    }
};
export default reducer;
