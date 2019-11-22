import { replyConstants } from "../../actions/actionTypes";
import { replyStatus } from "../../../constants/constants";

const initialState = {
    make: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    list: {
        status: replyStatus.NONE,
        list: [],
        error: null,
    },
    edit: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    delete: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    selected: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    like: {
        status: replyStatus.NONE,
        count: 0,
        error: null,
    },
    unlike: {
        status: replyStatus.NONE,
        count: 0,
        error: null,
    },
};

const replyReducer = (state = initialState, action) => {
    switch (action.type) {
    case replyConstants.ADD_REPLY_SUCCESS:
        return {
            ...state,
            make: {
                ...state.make,
                status: replyStatus.SUCCESS,
                reply: action.target,
            },
        };
    case replyConstants.ADD_REPLY_FAILURE_MISSING_PARAM:
        return {
            ...state,
            make: {
                ...state.make,
                status: replyStatus.MISSING_PARAM,
                error: action.target,
            },
        };
    case replyConstants.ADD_REPLY_FAILURE_COLLECTION_NOT_EXIST:
        return {
            ...state,
            make: {
                ...state.make,
                status: replyStatus.COLLECTION_NOT_EXIST,
                error: action.target,
            },
        };
    case replyConstants.ADD_REPLY_FAILURE_REVIEW_NOT_EXIST:
        return {
            ...state,
            make: {
                ...state.make,
                status: replyStatus.REVIEW_NOT_EXIST,
                error: action.target,
            },
        };
    case replyConstants.GET_REPLIES_BY_COLLECTION_SUCCESS:
        return {
            ...state,
            list: {
                ...state.list,
                status: replyStatus.SUCCESS,
                list: action.target,
            },
        };
    case replyConstants.GET_REPLIES_BY_REVIEW_SUCCESS:
        return {
            ...state,
            list: {
                ...state.list,
                status: replyStatus.SUCCESS,
                list: action.target,
            },
        };
    case replyConstants.EDIT_REPLY_SUCCESS:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: replyStatus.SUCCESS,
                reply: action.target,
            },
        };
    case replyConstants.EDIT_REPLY_FAILURE_REPLY_NOT_EXIST:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: replyStatus.REPLY_NOT_EXIST,
                error: action.target,
            },
        };
    case replyConstants.EDIT_REPLY_FAILURE_AUTH_ERROR:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: replyStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    case replyConstants.LIKE_REPLY_SUCCESS:
        return {
            ...state,
            like: {
                ...state.like,
                status: replyStatus.SUCCESS,
                count: action.target.likes,
            },
        };
    case replyConstants.LIKE_REPLY_FAILURE:
        return {
            ...state,
            like: {
                ...state.like,
                status: replyStatus.FAILURE,
                error: action.target,
            },
        };
    case replyConstants.UNLIKE_REPLY_SUCCESS:
        return {
            ...state,
            unlike: {
                ...state.unlike,
                status: replyStatus.SUCCESS,
                count: action.target.likes,
            },
        };
    case replyConstants.UNLIKE_REPLY_FAILURE:
        return {
            ...state,
            unlike: {
                ...state.unlike,
                status: replyStatus.FAILURE,
                error: action.target,
            },
        };
    case replyConstants.DEL_REPLY_SUCCESS:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: replyStatus.SUCCESS,
                reply: action.target,
            },
        };
    case replyConstants.DEL_REPLY_FAILURE_REPLY_NOT_EXIST:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: replyStatus.REPLY_NOT_EXIST,
                error: action.target,
            },
        };
    case replyConstants.DEL_REPLY_FAILURE_AUTH_ERROR:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: replyStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    default:
        return { ...state };
    }
};

export default replyReducer;
