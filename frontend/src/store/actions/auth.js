import axios from "axios";

import { authConstants } from "./actionTypes";

const signupSuccess = (user) => ({
    type: authConstants.SIGNUP_SUCCESS,
    target: user,
});

const signupFailure = (error) => {
    let actionType = null;
    switch (error.response.status) {
    case 419:
        actionType = authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME;
        break;
    case 420:
        actionType = authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL;
        break;
    default:
        break;
    }
    return {
        type: actionType,
        target: error,
    };
};

export const signup = (user) => (dispatch) => axios.post("/api/user", user)
    .then((res) => dispatch(signupSuccess(res.data)))
    .catch((err) => dispatch(signupFailure(err)));


const signinSuccess = (user) => ({
    type: authConstants.SIGNIN_SUCCESS,
    target: user,
});

const signinFailure = (error) => {
    let actionType = null;
    switch (error.response.status) {
    case 404:
        actionType = authConstants.SIGNIN_FAILURE_USER_NOT_EXIST;
        break;
    case 403:
        actionType = authConstants.SGININ_FAILURE_WRONG_PW;
        break;
    default:
        break;
    }
    return {
        type: actionType,
        target: error,
    };
};

export const signin = (user) => (dispatch) => axios.get("/api/session", { params: user })
    .then((res) => dispatch(signinSuccess(res.data)))
    .catch((err) => dispatch(signinFailure(err)));
