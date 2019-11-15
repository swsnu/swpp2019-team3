/*
    import actions from here
*/
import {
    signup,
    signin,
    signout,
    getMe,
} from "./auth/auth";

import {
    getPaper,
    likePaper,
    unlikePaper,
} from "./paper/paper";

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
    likeCollection,
    unlikeCollection,
} from "./collection/collection";

import {
    getUserByUserId,
    getFollowersByUserId,
    getFollowingsByUserId,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
} from "./user/user";

import {
    makeNewReview,
    getReviewsByPaperId,
    getReviewsByUserId,
    getReview,
    setReviewContent,
    likeReview,
    unlikeReview,
    deleteReview,
// consume Review,
} from "./review/review";


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
    likeCollection,
    unlikeCollection,
};

export const reviewActions = {
    makeNewReview,
    getReviewsByPaperId,
    getReviewsByUserId,
    getReview,
    setReviewContent,
    likeReview,
    unlikeReview,
    deleteReview,
    // consume Review,
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

export const userActions = {
    getUserByUserId,
    getFollowersByUserId,
    getFollowingsByUserId,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
};
