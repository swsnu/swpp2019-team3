import { userConstants } from "../../actions/actionTypes";
import { userStatus } from "../../../constants/constants";

// may need to be modified after more APIs implemented
const initialState = {
    userSearchResult: [],
    selectedUser: null,
    selectedFollowers: [],
    selectedFollowings: [],
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
            selectedFollowers: action.target,
            status: userStatus.SUCCESS,
        };
    case userConstants.GET_FOLLOWINGS:
        return {
            ...state,
            selectedFollowings: action.target,
            status: userStatus.SUCCESS,
        };
    case userConstants.ADD_FOLLOWING:
        return {
            ...state,
            status: userStatus.SUCCESS,
            // should be modified
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
            status: userStatus.SUCCESS,
            // should be modified
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
    default:
        return { ...state };
    }
};

export default UserReducer;
