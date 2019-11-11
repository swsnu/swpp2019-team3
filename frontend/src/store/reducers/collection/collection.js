import { collectionConstants } from "../../actions/actionTypes";
import { collectionStatus } from "../../../constants/constants";


const initialState = {
    make: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
    },
    list: {
        status: collectionStatus.NONE,
        list: [],
        error: null,
    },
    edit: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
    },
    delete: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
    },
    selected: {
        status: collectionStatus.NONE,
        error: null,
        collection: {},
        papers: [],
        members: [],
        replies: [],
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case collectionConstants.ADD_COLLECTION:
        return {
            ...state,
            make: {
                ...state.make,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    case collectionConstants.ADD_COLLECTION_FAILURE_MISSING_PARAM:
        return {
            ...state,
            make: {
                ...state.make,
                status: collectionStatus.MISSING_PARAM,
                error: action.target,
            },
        };
    case collectionConstants.GET_COLLECTIONS:
        return {
            ...state,
            list: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                list: action.target,
            },
        };
    case collectionConstants.GET_COLLECTION:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    case collectionConstants.GET_COLLECTION_PAPERS:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                papers: action.target,
            },
        };
    case collectionConstants.GET_COLLECTION_FAILURE_COLLECTION_NOT_EXIST:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.COLLECTION_NOT_EXIST,
                error: action.target,
            },
        };
    // case collectionConstants.GET_COLLECTION_MEMBERS:
        // return { ...state };
    // case collectionConstants.GET_COLLECTION_REPLIES:
        // return { ...state };
    // case collectionConstants.CHANGE_COLLECTION_OWNER:
        // return { ...state };
    case collectionConstants.EDIT_COLLECTION:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    case collectionConstants.EDIT_COLLECTION_FAILURE_COLLECTION_NOT_EXIST:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: collectionStatus.COLLECTION_NOT_EXIST,
                error: action.target,
            },
        };
    case collectionConstants.EDIT_COLLECTION_FAILURE_AUTH_ERROR:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: collectionStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    case collectionConstants.ADD_COLLECTION_PAPER:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    case collectionConstants.DEL_COLLECTION_PAPER:
        return {
            ...state,
            edit: {
                ...state.edit,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    // case collectionConstants.ADD_COLLECTION_MEMBER:
        // return { ...state };
    // case collectionConstants.DEL_COLLECTION_MEMBER:
        // return { ...state };
    case collectionConstants.DEL_COLLECTION:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    case collectionConstants.DEL_COLLECTION_FAILURE_AUTH_ERROR:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: collectionStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    case collectionConstants.DEL_COLLECTION_FAILURE_COLLECTION_NOT_EXIST:
        return {
            ...state,
            delete: {
                ...state.delete,
                status: collectionStatus.COLLECTION_NOT_EXIST,
                error: action.target,
            },
        };
    // case collectionConstants.ADD_COLLECTION_LIKE:
        // return { ...state };
    // case collectionConstants.DEL_COLLECTION_LIKE:
        // return { ...state };
    default:
        return { ...state };
    }
};

export default reducer;
