import { userConstants } from "../../actions/actionTypes";
import { userStatus } from "../../../constants/constants";

const initialState = {
    selectedUser: {},
    getFollowers: {
        status: userStatus.NONE,
        followers: [],
        pageNum: 0,
        finished: true,
        error: null,
    },
    getFollowings: {
        status: userStatus.NONE,
        followings: [],
        pageNum: 0,
        finished: true,
        error: null,
    },
    search: {
        status: userStatus.NONE,
        users: [],
        pageNum: 0,
        finished: true,
        error: null,
    },
    followCount: 0,
    unfollowCount: 0,
    status: userStatus.NONE,
    error: null,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
    case userConstants.GET_USER:
        return {
            ...state,
            selectedUser: action.target,
            status: userStatus.SUCCESS,
        };
    case userConstants.GET_USER_FAILURE_USER_NOT_EXIST:
        return {
            ...state,
            status: userStatus.USER_NOT_EXIST,
            error: action.target,
        };
    case userConstants.GET_FOLLOWERS:
        return {
            ...state,
            getFollowers: {
                status: userStatus.SUCCESS,
                followers: action.target.followers,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case userConstants.GET_FOLLOWERS_FAILURE_USER_NOT_EXIST:
        return {
            ...state,
            getFollowers: {
                status: userStatus.USER_NOT_EXIST,
                followers: [],
                pageNum: 0,
                finished: false,
                error: action.target,
            },
        };
    case userConstants.GET_FOLLOWINGS:
        return {
            ...state,
            getFollowings: {
                status: userStatus.SUCCESS,
                followings: action.target.followings,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case userConstants.GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST:
        return {
            ...state,
            getFollowings: {
                status: userStatus.USER_NOT_EXIST,
                followings: [],
                pageNum: 0,
                finished: false,
                error: action.target,
            },
        };
    case userConstants.ADD_FOLLOWING:
        return {
            ...state,
            followCount: action.target.follower,
            status: userStatus.SUCCESS,
        };
    case userConstants.ADD_FOLLOWING_FAILURE_SELF_FOLLOWING:
        return {
            ...state,
            status: userStatus.SELF_FOLLOWING,
            error: action.target,
        };
    case userConstants.DEL_FOLLOWING:
        return {
            ...state,
            unfollowCount: action.target.follower,
            status: userStatus.SUCCESS,
        };
    case userConstants.EDIT_USER:
        return {
            ...state,
            selectedUser: action.target,
            status: userStatus.SUCCESS,
        };
    case userConstants.EDIT_USER_FAILURE_USER_NOT_EXIST:
        return {
            ...state,
            status: userStatus.USER_NOT_EXIST,
            error: action.target,
        };
    case userConstants.EDIT_USER_FAILURE_DUPLICATE_EMAIL:
        return {
            ...state,
            status: userStatus.DUPLICATE_EMAIL,
            error: action.target,
        };
    case userConstants.SEARCH_USER_SUCCESS:
        return {
            ...state,
            search: {
                status: userStatus.SUCCESS,
                users: action.target.users,
                pageNum: action.target.pageNum,
                finished: action.target.finished,
            },
        };
    case userConstants.SEARCH_USER_FAILURE:
        return {
            ...state,
            search: {
                status: userStatus.FAILURE,
                users: [],
                pageNum: 0,
                finished: false,
                error: action.target,
            },
        };
    default:
        return { ...state };
    }
};

export default UserReducer;
