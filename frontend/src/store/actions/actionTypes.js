// Search
export const SEARCH = "SEARCH";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAILURE = "SEARCH_FAILURE";

// Profile
export const GET_USER = "GET_USER";
export const GET_FOLLOWERS = "GET_FOLLOWERS";
export const GET_FOLLOWINGS = "GET_FOLLOWINGS";
export const ADD_FOLLOWING = "ADD_FOLLOWING";
export const DEL_FOLLOWING = "DEL_FOLLOWING";
export const EDIT_USER_PROFILE = "EDIT_USER_PROFILE";

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
};

// Review
// add more actionTypes at below
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
};

export const paperConstants = {
    // GetPaper
    GET_PAPER_SUCCESS: "GET_PAPER_SUCCESS",
    GET_PAPER_FAILURE: "GET_PAPER_FAILURE",
};
