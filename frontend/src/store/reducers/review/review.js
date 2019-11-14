import { reviewConstants } from "../../actions/actionTypes";
import { reviewStatus } from "../../../constants/constants";

const initialState = {
    make: {
        status: reviewStatus.NONE,
        review: {},
        error: null,
    },
    list: {
        status: reviewStatus.NONE,
        list: [],
        error: null,
    },
    edit: {
        status: reviewStatus.NONE,
        review: {},
        error: null,
    },
    delete: {
        status: reviewStatus.NONE,
        review: {},
        error: null,
    },
    selected: {
        status: reviewStatus.NONE,
        review: {},
        error: null,
        replies: [],
    },
    like: {
        status: reviewStatus.NONE,
        count: 0,
        error: null,
    },
    unlike: {
        status: reviewStatus.NONE,
        count: 0,
        error: null,
    },
};

const ReviewReducer = (state = initialState, action) => {
    switch (action.type) {
    case reviewConstants.ADD_REVIEW:
        return {
            ...state,
            make: {
                ...state.make,
                status: reviewStatus.SUCCESS,
                review: action.target,
            },
        };
    case reviewConstants.ADD_REVIEW_FAILURE_MISSING_PARAM:
        return {
            ...state,
            make: {
                ...state.make,
                status: reviewStatus.MISSING_PARAM,
                error: action.target,
            },
        };
    case reviewConstants.ADD_REVIEW_FAILURE_PAPER_NOT_EXIST:
        return {
            ...state,
            make: {
                ...state.make,
                status: reviewStatus.PAPER_NOT_EXIST,
                error: action.target,
            },
        };
    case reviewConstants.GET_REVIEWS_BY_PAPER:
        return {
            ...state,
            list: {
                ...state.list,
                status: reviewStatus.SUCCESS,
                list: action.target,
            },
        };
    case reviewConstants.GET_REVIEWS_BY_USER:
        return {
            ...state,
            list: {
                ...state.list,
                status: reviewStatus.SUCCESS,
                list: action.target,
            },
        };
    // case reviewConstants.GET_RECENT_REVIEWS:
    // return;
    case reviewConstants.GET_REVIEW:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: reviewStatus.SUCCESS,
                review: action.target,
            },
        };
    case reviewConstants.GET_REVIEW_FAILURE_REVIEW_NOT_EXIST:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: reviewStatus.REVIEW_NOT_EXIST,
                error: action.target,
            },
        };
    case reviewConstants.EDIT_REVIEW:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: reviewStatus.SUCCESS,
                review: action.target,
            },
        };
    case reviewConstants.EDIT_REVIEW_FAILURE_REVIEW_NOT_EXIST:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: reviewStatus.REVIEW_NOT_EXIST,
                error: action.target,
            },
        };
    case reviewConstants.EDIT_REVIEW_FAILURE_AUTH_ERROR:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: reviewStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    case reviewConstants.LIKE_REVIEW_SUCCESS:
        return {
            ...state,
            like: {
                ...state.like,
                status: reviewStatus.SUCCESS,
                count: action.target.likes,
            },
        };
    case reviewConstants.LIKE_REVIEW_FAILURE:
        return {
            ...state,
            like: {
                ...state.like,
                status: reviewStatus.FAILURE,
                error: action.target,
            },
        };
    case reviewConstants.UNLIKE_REVIEW_SUCCESS:
        return {
            ...state,
            unlike: {
                ...state.unlike,
                status: reviewStatus.SUCCESS,
                count: action.target.likes,
            },
        };
    case reviewConstants.UNLIKE_REVIEW_FAILURE:
        return {
            ...state,
            unlike: {
                ...state.unlike,
                status: reviewStatus.FAILURE,
                error: action.target,
            },
        };
    case reviewConstants.DEL_REVIEW:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: reviewStatus.SUCCESS,
                review: action.target,
            },
        };
    case reviewConstants.DEL_REVIEW_FAILURE_REVIEW_NOT_EXIST:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: reviewStatus.REVIEW_NOT_EXIST,
                error: action.target,
            },
        };
    case reviewConstants.DEL_REVIEW_FAILURE_AUTH_ERROR:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: reviewStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    // case reviewConstants.CONSUME_REVIEW:
    default:
        return { ...state };
    }
};

export default ReviewReducer;
