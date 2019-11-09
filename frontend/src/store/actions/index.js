import {
    getUserByUserId,
    // getUserByUserName,
    getFollowersByUserId,
    getFollowingsByUserId,
    addUserFollowing,
    removeUserFollowing,
    // addUserFollower,
    // removeUserFollower,
    setUserProfile,
} from "./Profile/ProfileActions";
import { signup, signin } from "./auth/auth";
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
} from "./Collection/collection";


export {
    getUserByUserId,
    // getUserByUserName,
    getFollowersByUserId,
    getFollowingsByUserId,
    addUserFollowing,
    removeUserFollowing,
    // addUserFollower,
    // removeUserFollower,
    setUserProfile,
};

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
};
export const paperActions = {
    getPaper,
};
