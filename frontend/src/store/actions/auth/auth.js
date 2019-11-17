import axios from "axios";

import { authConstants } from "../actionTypes";

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
        actionType = authConstants.SIGNIN_FAILURE_WRONG_PW;
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

const signoutSuccess = () => ({
    type: authConstants.SIGNOUT_SUCCESS,
    target: null,
});

const signoutFailure = (error) => ({
    type: authConstants.SIGNOUT_FAILURE,
    target: error,
});

export const signout = () => (dispatch) => axios.delete("/api/session")
    .then(() => dispatch(signoutSuccess()))
    .catch((err) => dispatch(signoutFailure(err)));


const getMeSuccess = (user) => ({
    type: authConstants.GETME_SUCCESS,
    target: user,
});

const getMeFailure = (error) => ({
    type: authConstants.GETME_FAILURE,
    target: error,
});

export const getMe = () => (dispatch) => axios.get("/api/user/me")
    .then((res) => dispatch(getMeSuccess(res.data)))
    .catch((err) => dispatch(getMeFailure(err)));


const getNotiSuccess = (notifications) => ({
    type: authConstants.GET_NOTI_SUCCESS,
    target: notifications.notifications,
});

const getNotiFailure = (error) => ({
    type: authConstants.GET_NOTI_FAILURE,
    target: error,
});

export const getNoti = () => (dispatch) => axios.get("/api/notification")
    .then((res) => dispatch(getNotiSuccess(res.data)))
    .catch((err) => dispatch(getNotiFailure(err)));


const readNotiSuccess = () => ({
    type: authConstants.READ_NOTI_SUCCESS,
    target: null,
});

const readNotiFailure = (error) => ({
    type: authConstants.READ_NOTI_FAILURE,
    target: error,
});

export const readNoti = (notificationId) => (dispatch) => axios.put("/api/notification", notificationId)
    .then(() => dispatch(readNotiSuccess()))
    .catch((err) => dispatch(readNotiFailure(err)));
