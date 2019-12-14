import axios from "axios";
import { userConstants } from "../actionTypes";

// get a single user
const getUserByUserIdSuccess = (user) => ({
    type: userConstants.GET_USER,
    target: user.user,
});

const getUserByUserIdFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.GET_USER_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const getUserByUserId = (userId) => (dispatch) => axios.get("/api/user", { params: userId })
    .then((res) => { dispatch(getUserByUserIdSuccess(res.data)); })
    .catch((err) => { dispatch(getUserByUserIdFailure(err)); });

// get a list of followers
const getFollowersByUserIdSuccess = (data) => ({
    type: userConstants.GET_FOLLOWERS,
    target: { followers: data.users, pageNum: data.page_number, finished: data.is_finished },
});

const getFollowersByUserIdFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.GET_FOLLOWERS_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const getFollowersByUserId = (userId) => (dispatch) => axios.get("/api/user/followed", { params: userId })
    .then((res) => { dispatch(getFollowersByUserIdSuccess(res.data)); })
    .catch((err) => { dispatch(getFollowersByUserIdFailure(err)); });

// get a list of followings
const getFollowingsSuccess = (data) => ({
    type: userConstants.GET_FOLLOWINGS,
    target: { followings: data.users, pageNum: data.page_number, finished: data.is_finished },
});

const getFollowingsFailure = (error) => {
    const actionType = error.response.status === 404
        ? userConstants.GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST : null;
    return {
        type: actionType,
        target: error,
    };
};

export const getFollowingsByUserId = (userId) => (dispatch) => axios.get("/api/user/following", { params: userId })
    .then((res) => { dispatch(getFollowingsSuccess(res.data)); })
    .catch((err) => { dispatch(getFollowingsFailure(err)); });


// get a list of followings not in the certain collection
export const getFollowingsNotInCollection = (userId, collectionId, pageNum) => (dispatch) => axios.get("/api/user/following/collection", { params: { user: userId, collection_id: collectionId, page_number: pageNum } })
    .then((res) => { dispatch(getFollowingsSuccess(res.data)); })
    .catch((err) => { dispatch(getFollowingsFailure(err)); });


// follow a user
const addUserFollowingSuccess = (count) => ({
    type: userConstants.ADD_FOLLOWING,
    target: count.count,
});

const addUserFollowingFailure = (error) => {
    const actionType = error.response.status === 422
        ? userConstants.ADD_FOLLOWING_FAILURE_SELF_FOLLOWING : null;
    return {
        type: actionType,
        target: error,
    };
};

export const addUserFollowing = (targetUserId) => (dispatch) => axios.post("/api/follow", targetUserId)
    .then((res) => { dispatch(addUserFollowingSuccess(res.data)); })
    .catch((err) => { dispatch(addUserFollowingFailure(err)); });


// unfollow a user
const removeUserFollowingSuccess = (count) => ({
    type: userConstants.DEL_FOLLOWING,
    target: count.count,
});

const removeUserFollowingFailure = (error) => ({
    type: userConstants.DEL_FOLLOWING_FAILURE,
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
    let actionType = null;
    if (error.response.status === 404) {
        actionType = userConstants.EDIT_USER_FAILURE_USER_NOT_EXIST;
    } else if (error.response.status === 419) {
        actionType = userConstants.EDIT_USER_FAILURE_USERNAME_ALREADY_EXIST;
    } else if (error.response.status === 420) {
        actionType = userConstants.EDIT_USER_FAILURE_DUPLICATE_EMAIL;
    }
    return {
        type: actionType,
        target: error,
    };
};

export const editUserInfo = (newUserInfo) => (dispatch) => axios.put("/api/user", newUserInfo)
    .then((res) => { dispatch(editUserInfoSuccess(res.data)); })
    .catch((err) => { dispatch(editUserInfoFailure(err)); });


const searchUserSuccess = (data) => ({
    type: userConstants.SEARCH_USER_SUCCESS,
    target: {
        users: data.users,
        pageNum: data.page_number,
        finished: data.is_finished,
        totalCount: data.total_count,
    },
});

const searchUserFailure = (error) => ({
    type: userConstants.SEARCH_USER_FAILURE,
    target: error,
});

export const searchUser = (searchWord, pageNum) => (dispatch) => axios.get("/api/user/search", { params: { text: searchWord, page_number: pageNum } })
    .then((res) => dispatch(searchUserSuccess(res.data)))
    .catch((err) => dispatch(searchUserFailure(err)));


// get a list of searched users not in the certain collection
export const searchUserNotInCollection = (searchWord, collectionId, pageNum) => (dispatch) => axios.get("/api/user/search/collection", { params: { text: searchWord, collection_id: collectionId, page_number: pageNum } })
    .then((res) => { dispatch(searchUserSuccess(res.data)); })
    .catch((err) => { dispatch(searchUserFailure(err)); });
