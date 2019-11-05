/*
import * as actionTypes from "../actions/actionTypes";

const initialState = {
    selectedUser: {
        id: -1,
        name: "",
        description: "",
        followersNum: 0,
        followingsNum: 0,
        isFollowingMe: false,
        amIFollow: false,
    },
    selectedFollowers: [],
    selectedFollowings: [],
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.GET_USER:
        const newSelectedUser = {
            id: action.selectedUser.id,
            name: action.selectedUser.name,
            description: action.selectedUser.description,
            followersNum: action.selectedUser.followersNum,
            followingsNum: action.selectedUser.followingsNum,
        };
        return { ...state, selectedUser: newSelectedUser };
    case actionTypes.GET_FOLLOWERS:
        return { ...state, selectedFollowers: action.followers };
    case actionTypes.GET_FOLLOWINGS:
        return { ...state, selectedFollowings: action.followings };
    case actionTypes.ADD_FOLLOWING:
        return { ...state }; // not yet done
    case actionTypes.DEL_FOLLOWING:
        return { ...state }; // not yet done
    case actionTypes.EDIT_USER_PROFILE:
        const editedUser = {
            id: action.userEdited.id,
            name: action.userEdited.name,
            description: action.userEdited.description,
            followersNum: action.userEdited.followersNum,
            followingsNum: action.userEdited.followingsNum,
        };
        return { ...state, selectedUser: editedUser };
    default:
        break;
    }
    return state;
};

export default UserReducer;
*/
