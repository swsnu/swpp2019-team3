import {
    signup, signin, signout, getMe,
} from "./auth/auth";
import { getPaper, likePaper, unlikePaper } from "./paper/paper";

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
    likePaper,
    unlikePaper,
};
