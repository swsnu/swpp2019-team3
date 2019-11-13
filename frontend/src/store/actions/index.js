/*
    import actions from here
*/

import {
    signup, signin, signout, getMe,
} from "./auth/auth";
import getPaper from "./paper/paper";

import {
    makeNewCollection,
    getCollectionsByUserId,
    getCollection,
    getCollectionPapers,
    // getCollectionMembers,
    // getCollectionReplies,
    // setOwner,
    setTitleAndDescription,
    addCollectionPaper,
    removeCollectionPaper,
    // addCollectionMember,
    // removeCollectionMember,
    deleteCollection,
    // addCollectionLike,
    // removeCollectionLike,
} from "./collection/collection";

import {
    getUserByUserId,
    // getFollowers,
    // getFollowings,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
} from "./user/user";


/*
    export actions from here
*/

export const collectionActions = {
    makeNewCollection,
    getCollectionsByUserId,
    getCollection,
    getCollectionPapers,
    // getCollectionMembers,
    // getCollectionReplies,
    // setOwner,
    setTitleAndDescription,
    addCollectionPaper,
    removeCollectionPaper,
    // addCollectionMember,
    // removeCollectionMember,
    deleteCollection,
    // addCollectionLike,
    // removeCollectionLike,
};

export const authActions = {
    signup,
    signin,
    signout,
    getMe,
};
export const paperActions = {
    getPaper,
};

export const userActions = {
    getUserByUserId,
    // getFollowers,
    // getFollowings,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
};
