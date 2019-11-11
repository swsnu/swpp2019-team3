import {
    signup, signin, signout, getMe,
} from "./auth/auth";
import getPaper from "./paper/paper";

import {
    makeNewCollection,
    getCollectionsByUserId,
    getCollectionsWithContainsByUserId,
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

export const collectionActions = {
    makeNewCollection,
    getCollectionsByUserId,
    getCollectionsWithContainsByUserId,
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
