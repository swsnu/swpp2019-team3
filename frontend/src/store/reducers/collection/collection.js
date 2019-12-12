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
        pageNum: 0,
        finished: true,
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
        collection: {},
        error: null,
        papers: {}, // papers: [], page_number: number, is_finished: bool
        memberCount: 0,
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
    getMembers: {
        status: collectionStatus.NONE,
        members: [],
        pageNum: 0,
        finished: true,
        error: null,
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
            list: {
                ...state.list,
                list: [action.target].concat(state.list.list),
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
                list: action.target.collections,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
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
    case collectionConstants.GET_COLLECTION_PAPERS_SUCCESS:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                papers: action.target,
            },
        };
    case collectionConstants.GET_COLLECTION_PAPERS_FAILURE:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.FAILURE,
                error: action.target,
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
    case collectionConstants.GET_COLLECTION_MEMBERS_SUCCESS:
        return {
            ...state,
            getMembers: {
                status: collectionStatus.SUCCESS,
                members: action.target.members,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case collectionConstants.GET_COLLECTION_MEMBERS_FAILURE:
        return {
            ...state,
            getMembers: {
                status: collectionStatus.FAILURE,
                members: [],
                pageNum: 0,
                finished: false,
                error: action.target,
            },
        };
    case collectionConstants.SET_OWNER:
        return {
            ...state,
        };
    case collectionConstants.SET_OWNER_FAILURE_AUTH_ERROR:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.AUTH_ERROR,
                error: action.target,
            },
        };
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
    case collectionConstants.ADD_COLLECTION_MEMBER:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                memberCount: action.target.users,
            },
        };
    case collectionConstants.ADD_COLLECTION_MEMBER_FAILURE_NOT_AUTHORIZED:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    case collectionConstants.ADD_COLLECTION_MEMBER_FAILURE_SELF_ADDING:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.USER_SELF_ADDING,
                error: action.target,
            },
        };
    case collectionConstants.DEL_COLLECTION_MEMBER:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                memberCount: action.target.users,
            },
        };
    case collectionConstants.DEL_COLLECTION_MEMBER_FAILURE_NOT_AUTHORIZED:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.AUTH_ERROR,
                error: action.target,
            },
        };
    case collectionConstants.DEL_COLLECTION_MEMBER_FAILURE_MORE_THAN_USERCOUNT:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.FAILURE,
                error: action.target,
            },
        };
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
                list: action.target.collections,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case collectionConstants.SEARCH_COLLECTION_FAILURE:
        return {
            ...state,
            list: {
                ...state.list,
                status: collectionStatus.FAILURE,
                error: action.target,
                pageNum: 0,
                finished: false,
            },
        };
    case collectionConstants.GET_COLLECTION_LIKE_SUCCESS:
        return {
            ...state,
            list: {
                ...state.list,
                status: collectionStatus.SUCCESS,
                list: action.target.collections,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case collectionConstants.GET_COLLECTION_LIKE_FAILURE:
        return {
            ...state,
            list: {
                ...state.list,
                status: collectionStatus.FAILURE,
                error: action.target,
                pageNum: 0,
                finished: false,
            },
        };
    case collectionConstants.CHANGE_COLLECTION_TYPE_SUCCESS:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.SUCCESS,
                collection: action.target,
            },
        };
    case collectionConstants.CHANGE_COLLECTION_TYPE_FAILURE:
        return {
            ...state,
            selected: {
                ...state.selected,
                status: collectionStatus.FAILURE,
                error: action.target,
            },
        };
    default:
        return { ...state };
    }
};

export default reducer;
