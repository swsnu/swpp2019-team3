import * as actionTypes from '../actions/ActionTypes';

const initialState = {
    collections: [],
    selected: {
        collection: null,
        papers: [],
        members: [],
        replies: [],
        likesCount: 0,
        isLiked: false,
    },
};

// details should be implemented
const CollectionReducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.ADD_COLLECTION:
            return {...state};
        case actionTypes.GET_COLLECTION:
            return {...state};
        case actionTypes.GET_COLLECTION_PAPERS:
            return {...state};
        case actionTypes.GET_COLLECTION_MEMBERS:
            return {...state};
        case actionTypes.GET_COLLECTION_REPLIES:
            return {...state};
        case actionTypes.CHANGE_COLLECTION_OWNER:
            return {...state};
        case actionTypes.EDIT_COLLECTION:
            return {...state};
        case actionTypes.ADD_COLLECTION_PAPER:
            return {...state};
        case actionTypes.DEL_COLLECTION_PAPER:
            return {...state};
        case actionTypes.ADD_COLLECTION_MEMBER:
            return {...state};
        case actionTypes.DEL_COLLECTION_MEMBER:
            return {...state};
        case actionTypes.DEL_COLLECTION:
            return {...state};
        default:
            break;
    }
    return state;
}

export default CollectionReducer;