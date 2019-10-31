import * as actionTypes from "../../actions/ActionTypes";

const initialState = {
    replies: [{
        id: 0,
        authorId: -1,
        author: "dfdf",
        review: 0,
        content: "dffffffffffffff",
    },
    {
        id: 0,
        authorId: -1,
        author: "dfdf",
        review: 0,
        content: "dffffffffffffff",
    },
    {
        id: 0,
        authorId: -1,
        author: "dfdf",
        review: 0,
        content: "dffffffffffffff",
    }],
    selected: {
        reply: {
            id: 0,
            authorId: -1,
            author: "dfdf",
            review: 0,
            content: "dffffffffffffff",
        },
        isLiked: false,
        likesCount: 0,
    },
};

const ReviewReplyReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.MAKE_REVIEW_REPLY:
        return {
            ...state,
            selected: {
                ...state.selected,
                reply: action.data,
            },
        };
    case actionTypes.GET_REPLIES_BY_REVIEW:
        return {
            ...state,
            replies: action.data,
        };
    case actionTypes.EDIT_REVIEW_REPLY:
        return {
            ...state,
            selected: {
                ...state.selected,
                reply: action.data,
            },
        };
    case actionTypes.DEL_REVIEW_REPLY:
        return {
            ...state,
            selected: {
                ...state.selected,
                reply: null,
            },
        };
    case actionTypes.LIKE_REVIEW_REPLY:
        return {
            ...state,
            selected: {
                ...state.selected,
                isLiked: true,
                likesCount: this.state.selected.likesCount + 1,
            },
        };
    case actionTypes.LIKE_REVIEW_REPLY_CANCEL:
        return {
            ...state,
            selected: {
                ...state.selected,
                isLiked: false,
                likesCount: this.state.selected.likesCount - 1,
            },
        };
    case actionTypes.GET_REVIEW_LIKES_COUNT:
        return {
            ...state,
            selected: {
                ...state.selected,
                likesCount: action.data,
            },
        };
    case actionTypes.GET_REVIEW_REPLY_IS_LIKED:
        return {
            ...state,
            selected: {
                ...state.selected,
                isLiked: action.data,
            },
        };
    default:
        return {
            ...state,
        };
    }
};

export default ReviewReplyReducer;
