import { userConstants } from "../../actions/actionTypes";
import { userStatus } from "../../../constants/constants";

const initialState = {
    selectedUser: {},
    selectedFollowers: [],
    selectedFollowings: [],
    followCount: 0,
    unfollowCount: 0,
    status: userStatus.NONE,
    searchedUsers: [],
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
            selectedFollowers: action.target,
            status: userStatus.SUCCESS,
        };
    case userConstants.GET_FOLLOWERS_FAILURE_USER_NOT_EXIST:
        return {
            ...state,
            status: userStatus.USER_NOT_EXIST,
            error: action.target,
        };
    case userConstants.GET_FOLLOWINGS:
        return {
            ...state,
            selectedFollowings: action.target,
            status: userStatus.SUCCESS,
        };
    case userConstants.GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST:
        return {
            ...state,
            status: userStatus.USER_NOT_EXIST,
            error: action.target,
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
        return { ...state, status: userStatus.SUCCESS, searchedUsers: action.target };
    case userConstants.SEARCH_USER_FAILURE:
        return { ...state, status: userStatus.FAILURE };
    default:
        return { ...state };
    }
};

export default UserReducer;
