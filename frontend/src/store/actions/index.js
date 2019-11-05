
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
import { signup, signin } from "./auth";

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


export {
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



const authActions = {
    signup,
    signin,
};
export default authActions;
