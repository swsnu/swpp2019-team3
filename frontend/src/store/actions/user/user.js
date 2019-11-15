import axios from "axios";
import { userConstants } from "../actionTypes";

// get a single user
const getUserByUserIdSuccess = (user) => ({
    type: userConstants.GET_USER,
    target: user,
});

const getUserByUserIdFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.GET_USER_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const getUserByUserId = (userId) => (dispatch) => axios.get("/api/user", { params: { id: userId } })
    .then((res) => { dispatch(getUserByUserIdSuccess(res.data)); })
    .catch((err) => { dispatch(getUserByUserIdFailure(err)); });

// get a list of followers
const getFollowersByUserIdSuccess = (followers) => ({
    type: userConstants.GET_FOLLOWERS,
    target: followers,
});

const getFollowersByUserIdFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.GET_FOLLOWERS_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const getFollowersByUserId = (userId) => (dispatch) => axios.get("/api/user/followed", { params: { id: userId } })
    .then((res) => { dispatch(getFollowersByUserIdSuccess(res.data)); })
    .catch((err) => { dispatch(getFollowersByUserIdFailure(err)); });

// get a list of followings
const getFollowingsByUserIdSuccess = (followers) => ({
    type: userConstants.GET_FOLLOWERS,
    target: followers,
});

const getFollowingsByUserIdFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const getFollowingsByUserId = (userId) => (dispatch) => axios.get("/api/user/following", { params: { id: userId } })
    .then((res) => { dispatch(getFollowingsByUserIdSuccess(res.data)); })
    .catch((err) => { dispatch(getFollowingsByUserIdFailure(err)); });

// follow a user
const addUserFollowingSuccess = (user) => ({
    type: userConstants.ADD_FOLLOWING,
    target: user,
});

const addUserFollowingFailure = (error) => {
    const actionType = error.response.status === 400
        ? userConstants.ADD_FOLLOWING_FAILURE_SELF_FOLLOWING : null;
    return {
        type: actionType,
        target: error,
    };
};

export const addUserFollowing = (targetUserId) => (dispatch) => axios.post("/api/follow", { params: targetUserId })
    .then((res) => { dispatch(addUserFollowingSuccess(res.data)); })
    .catch((err) => { dispatch(addUserFollowingFailure(err)); });


// unfollow a user
const removeUserFollowingSuccess = (user) => ({
    type: userConstants.DEL_FOLLOWING,
    target: user,
});

const removeUserFollowingFailure = (error) => ({
    type: null,
    target: error,
});

export const removeUserFollowing = (targetuserId) => (dispatch) => axios.delete("/api/follow", { params: targetuserId })
    .then((res) => { dispatch(removeUserFollowingSuccess(res.data)); })
    .catch((err) => { dispatch(removeUserFollowingFailure(err)); });


// edit user information
const editUserInfoSuccess = (user) => ({
    type: userConstants.EDIT_USER,
    target: user,
});

const editUserInfoFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.EDIT_USER_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const editUserInfo = (newUserInfo) => (dispatch) => axios.put("/api/user", newUserInfo)
    .then((res) => { dispatch(editUserInfoSuccess(res.data)); })
    .catch((err) => { dispatch(editUserInfoFailure(err)); });
