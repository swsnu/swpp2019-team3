//will implement actions for profile here
import * as actionTypes from '../ActionTypes';
import axios from 'axios';

// getUserByUserId(user_id: number) -> Promise<{status: number, data: User}>: Call backend api to get a user.
export const getUserByUserId = (userID) => {
    return dispatch => {
        return axios.get('/user/'+userID)
            .then(res => dispatch({
                type: actionTypes.GET_USER, selectedUser: res.data
            }));
    };
};

// getUsersByUserName(user_name: string) -> Promise<{status: number, data: User[]}>: Call backend api to get users with the matched name.
// export const getUsersByUserName = (userName) => {
//     // it may be redundant, as we can substitude this with 'getUserByUserId'
//     // if userName is identical as userID, then we may not need seperate userID
//     // we only need this action in 'collection_invite_member', and since that class do searching for select who to invite,
//     // so we may know those member's id anyway
// }

// getFollowersByUserId(user_id: number) -> Promise<{status: number, data: User[]}>: Call backend api to get followers of a user.
export const getFollowersByUserId = (userID) => {
    return dispatch => {
        return axios.get('/user/followed/'+userID)
            .then(res => dispatch({
                type: actionTypes.GET_FOLLOWERS, followers: res.data,
            }));
    };
};

// getFollowingsByUserId(user_id: number) -> Promise<{status: number, data: User[]}>: Call backend api to get followings of a user.
export const getFollowingsByUserId = (userID) => {
    return dispatch => {
        return axios.get('/user/following/'+userID)
            .then(res => dispatch({
                type: actionTypes.GET_FOLLOWINGS, followings: res.data,
            }));
    };
};

// addUserFollowing(user_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to add a new following to a user’s following list.
export const addUserFollowing = (currentUserID, targetUserID) => {
    return dispatch => {
        return axios.post('/follow/'+currentUserID, targetUserID)
            .then(res => dispatch({
                type: actionTypes.ADD_FOLLOWING, newFollowing: res.data,
            }));
    };
};

// removeUserFollowing(user_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to delete a user from the following list of other user.
export const removeUserFollowing = (currentUserID, targetUserID) => {
    return dispatch => {
        return axios.delete('/follow/'+currentUserID, targetUserID)
            .then(res => dispatch({
                type: actionTypes.DEL_FOLLOWING, delFollowing: res.data,
            }));
    };
};

// We may not need addUserFollower and removeUserFollower, as backend will do the work

// // addUserFollower(user_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to add a new follower to a user’s follower list.
// export const addUserFollower = (currentUserID, targetUserID) => {
//     return dispatch => {
//         return axios.post('/follow/'+currentUserID, targetUserID)
//             .then(res => dispatch({
//                 type: actionTypes.ADD_FOLLOWING, newFollowing: res.data,
//             }));
//     };
// }

// // removeUserFollower(user_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to delete a user from the follower list of other user.
// export const removeUserFollower = (currentUserID, targetUserID) => {

// }

// setUserProfile(user_id: number, description: string, photo: number) -> Promise<{status: number, data: User}>: Call backend api to apply the change on a user’s profile.
export const setUserProfile = (userID, description) => {
    return dispatch => {
        return axios.put('/user/'+userID, description)
            .then(res => dispatch({
                type: actionTypes.EDIT_USER_PROFILE, userEdited: res.data
            }));
    };
}
// export const setUserProfile = (userID, description, photo) => {

// }