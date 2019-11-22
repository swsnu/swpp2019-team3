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
    like: {
        status: collectionStatus.NONE,
        count: 0,
        error: null,
    },
    unlike: {
        status: collectionStatus.NONE,
        count: 0,
        error: null,
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case collectionConstants.ADD_COLLECTION:
        // eslint-disable-next-line no-case-declarations
        // const collectionListList = this.state.list.list;
        return {
            ...state,
            make: {
                ...state.make,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
            // list: {
            //     ...state.list,
            //     list: collectionListList.concat(action.target),
            // },
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
    case collectionConstants.LIKE_COLLECTION_SUCCESS:
        return {
            ...state,
            like: {
                ...state.like,
                status: collectionStatus.SUCCESS,
                count: action.target.likes,
            },
        };
    case collectionConstants.LIKE_COLLECTION_FAILURE:
        return {
            ...state,
            like: {
                ...state.like,
                status: collectionStatus.FAILURE,
                error: action.target,
            },
        };
    case collectionConstants.UNLIKE_COLLECTION_SUCCESS:
        return {
            ...state,
            unlike: {
                ...state.unlike,
                status: collectionStatus.SUCCESS,
                count: action.target.likes,
            },
        };
    case collectionConstants.UNLIKE_COLLECTION_FAILURE:
        return {
            ...state,
            unlike: {
                ...state.unlike,
                status: collectionStatus.FAILURE,
                error: action.target,
            },
        };
    case collectionConstants.SEARCH_COLLECTION_SUCCESS:
        return {
            ...state,
            list: {
                ...state.list,
                status: collectionStatus.SUCCESS,
                list: action.target,
            },
        };
    case collectionConstants.SEARCH_COLLECTION_FAILURE:
        return {
            ...state,
            list: {
                ...state.list,
                status: collectionStatus.FAILURE,
                error: action.target,
            },
        };
    default:
        return { ...state };
    }
};

export default reducer;
