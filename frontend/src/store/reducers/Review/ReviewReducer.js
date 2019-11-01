/* import * as actionTypes from "../../actions/ActionTypes";

const initialState = {
    reviews: [],
    selected: {
        review: {
            id: 0,
            authorId: 0,
            author: "dfdf",
            paper: 7,
            title: "good",
            content: "contentcontentcontentcontent",
        },
        replies: [{
            id: 0,
            authorId: 0,
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
        likesCount: 0,
        isLiked: false,
    },
};

const ReviewReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.EDIT_REVIEW:
        return {
            ...state,
            selected: {
                ...state.selected,
                review: action.data,
            },
        };
    case actionTypes.MAKE_REVIEW:
        return {
            ...state,
            selected: {
                ...state.selected,
                review: action.data,
            },
        };
    case actionTypes.GET_REVIEW:
        return {
            ...state,
            selected: {
                ...state.selected,
                review: action.data,
            },
        };
    case actionTypes.LIKE_REVIEW:
        return {
            ...state,
            selected: {
                ...state.selected,
                isLiked: true,
            },
        };
    case actionTypes.LIKE_REVIEW_CANCEL:
        return {
            ...state,
            selected: {
                ...state.selected,
                isLiked: false,
            },
        };
    case actionTypes.DEL_REVIEW:
        return {
            ...state,
        };
    case actionTypes.GET_REVIEW_LIKES_COUNT:
        return {
            ...state,
            selected: {
                likesCount: action.data,
            },
        };
    case actionTypes.GET_REVIEW_IS_LIKED:
        return {
            ...state,
            selected: {
                isLiked: action.data,
            },
        };
    case actionTypes.CONSUME_REVIEW:
        return {
            ...state,
        };
    default:
        return {
            ...state,
        };
    }
};

export default ReviewReducer; */
