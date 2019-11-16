// Search
export const SEARCH = "SEARCH";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAILURE = "SEARCH_FAILURE";

// User
export const userConstants = {
    GET_USER: "GET_USER",
    GET_USER_FAILURE_USER_NOT_EXIST: "GET_USER_FAILURE_USER_NOT_EXIST",
    GET_FOLLOWERS: "GET_FOLLOWERS",
    GET_FOLLOWERS_FAILURE_USER_NOT_EXIST: "GET_FOLLOWERS_FAILURE_USER_NOT_EXIST",
    GET_FOLLOWINGS: "GET_FOLLOWINGS",
    GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST: "GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST",
    ADD_FOLLOWING: "ADD_FOLLOWING",
    ADD_FOLLOWING_FAILURE_SELF_FOLLOWING: "ADD_FOLLOWING_FAILURE_SELF_FOLLOWING",
    DEL_FOLLOWING: "DEL_FOLLOWING",
    DEL_FOLLOWING_FAILURE: "DEL_FOLLOWING_FAILURE",
    EDIT_USER: "EDIT_USER",
    EDIT_USER_FAILURE_USER_NOT_EXIST: "EDIT_USER_FAILURE_USER_NOT_EXIST",
    EDIT_USER_FAILURE_DUPLICATE_EMAIL: "EDIT_USER_FAILURE_DUPLICATE_EMAIL",
};

// Collection
export const collectionConstants = {
    ADD_COLLECTION: "ADD_COLLECTION",
    ADD_COLLECTION_FAILURE_MISSING_PARAM: "ADD_COLLECTION_FAILURE_MISSING_PARAM",
    GET_COLLECTIONS: "GET_COLLECTIONS",
    GET_COLLECTION: "GET_COLLECTION",
    GET_COLLECTION_FAILURE_COLLECTION_NOT_EXIST: "GET_COLLECTION_FAILURE_COLLECTION_NOT_EXIST",
    GET_COLLECTION_PAPERS: "GET_COLLECTION_PAPERS",
    GET_COLLECTION_MEMBERS: "GET_COLLECION_MEMBERS",
    GET_COLLECTION_REPLIES: "GET_COLLECTION_REPLIES",
    CHANGE_COLLECTION_OWNER: "CHANGE_COLLECTION_OWNER",
    EDIT_COLLECTION: "EDIT_COLLECTION",
    EDIT_COLLECTION_FAILURE_COLLECTION_NOT_EXIST: "EDIT_COLLECTION_FAILURE_COLLECTION_NOT_EXIST",
    EDIT_COLLECTION_FAILURE_AUTH_ERROR: "EDIT_COLLECTION_FAILURE_AUTH_ERROR",
    ADD_COLLECTION_PAPER: "ADD_COLLECTION_PAPER",
    DEL_COLLECTION_PAPER: "DEL_COLLECTION_PAPER",
    ADD_COLLECTION_MEMBER: "ADD_COLLECTION_MEMBER",
    DEL_COLLECTION_MEMBER: "DEL_COLLECTION_MEMBER",
    DEL_COLLECTION: "DEL_COLLECTION",
    DEL_COLLECTION_FAILURE_COLLECTION_NOT_EXIST: "DEL_COLLECTION_FAILURE_COLLECTION_NOT_EXIST",
    DEL_COLLECTION_FAILURE_AUTH_ERROR: "DEL_COLLECTION_FAILURE_COLLECTION_AUTH_ERROR",
    ADD_COLLECTION_LIKE: "ADD_COLLECTION_LIKE",
    DEL_COLLECTION_LIKE: "DEL_COLLECION_LIKE",
    LIKE_COLLECTION_SUCCESS: "LIKE_COLLECTION_SUCCESS",
    LIKE_COLLECTION_FAILURE: "LIKE_COLLECTION_FAILURE",
    UNLIKE_COLLECTION_SUCCESS: "UNLIKE_COLLECTION_SUCCESS",
    UNLIKE_COLLECTION_FAILURE: "UNLIKE_COLLECTION_FAILURE",
};

// Review
// add more actionTypes at below
export const reviewConstants = {
    ADD_REVIEW: "ADD_REVIEW",
    ADD_REVIEW_FAILURE_MISSING_PARAM: "ADD_REVIEW_FAILURE_MISSING_PARAM",
    ADD_REVIEW_FAILURE_PAPER_NOT_EXIST: "ADD_REVIEW_FAILURE_PAPER_NOT_EXIST",
    GET_REVIEWS_BY_PAPER: "GET_REVIEWS_BY_PAPER",
    GET_REVIEWS_BY_USER: "GET_REVIEWS_BY_USER",
    GET_RECENT_REVIEWS: "GET_RECENT_REVIEWS",
    GET_REVIEW: "GET_REVIEW",
    GET_REVIEW_FAILURE_REVIEW_NOT_EXIST: "GET_REVIEW_FAILURE_REVIEW_NOT_EXIST",
    EDIT_REVIEW: "EDIT_REVIEW",
    EDIT_REVIEW_FAILURE_REVIEW_NOT_EXIST: "EDIT_REVIEW_FAILURE_REVIEW_NOT_EXIST",
    EDIT_REVIEW_FAILURE_AUTH_ERROR: "EDIT_REVIEW_FAILURE_AUTH_ERROR",
    ADD_REVIEW_LIKE: "ADD_REVIEW_LIKE",
    DEL_REVIEW_LIKE: "DEL_REVIEW_LIKE",
    DEL_REVIEW: "DEL_REVIEW",
    DEL_REVIEW_FAILURE_REVIEW_NOT_EXIST: "DEL_REVIEW_FAILURE_REVIEW_NOT_EXIST",
    DEL_REVIEW_FAILURE_AUTH_ERROR: "DEL_REVIEW_FAILURE_AUTH_ERROR",
    CONSUME_REVIEW: "CONSUME_REVIEW",
    LIKE_REVIEW_SUCCESS: "LIKE_REVIEW_SUCCESS",
    LIKE_REVIEW_FAILURE: "LIKE_REVIEW_FAILURE",
    UNLIKE_REVIEW_SUCCESS: "UNLIKE_REVIEW_SUCCESS",
    UNLIKE_REVIEW_FAILURE: "UNLIKE_REVIEW_FAILURE",
};

export const GET_REVIEWS = "GET_REVIEWS";

export const authConstants = {
    // SignUp
    SIGNUP_REQUEST: "SIGNUP_REQUEST",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    SIGNUP_FAILURE_DUPLICATE_USERNAME: "SIGNUP_FAILURE_DUPLICATE_USERNAME",
    SIGNUP_FAILURE_DUPLICATE_EMAIL: "SIGNUP_FAILURE_DUPLICATE_EMAIL",

    // Signin
    SIGNIN_REQUEST: "SIGNIN_REQUEST",
    SIGNIN_SUCCESS: "SIGNIN_SUCCESS",
    SIGNIN_FAILURE_USER_NOT_EXIST: "SIGNIN_FAILURE_USER_NOT_EXIST",
    SIGNIN_FAILURE_WRONG_PW: "SIGNIN_FAILURE_WRONG_PW",

    // Signout
    SIGNOUT_REQUEST: "SIGNOUT_REQUEST",
    SIGNOUT_SUCCESS: "SIGNOUT_SUCCESS",
    SIGNOUT_FAILURE: "SIGNOUT_FAILURE",

    // GetMe
    GETME_SUCCESS: "GETME_SUCCESS",
    GETME_FAILURE: "GETME_FAILURE",
};

export const paperConstants = {
    // GetPaper
    GET_PAPER_SUCCESS: "GET_PAPER_SUCCESS",
    GET_PAPER_FAILURE: "GET_PAPER_FAILURE",
    LIKE_PAPER_SUCCESS: "LIKE_PAPER_SUCCESS",
    LIKE_PAPER_FAILURE: "LIKE_PAPER_FAILURE",
    UNLIKE_PAPER_SUCCESS: "UNLIKE_PAPER_SUCCESS",
    UNLIKE_PAPER_FAILURE: "UNLIKE_PAPER_FAILURE",
};
