/*
    import actions from here
*/
import {
    signup,
    signin,
    signout,
    getMe,
    getNoti,
    readNoti,
} from "./auth/auth";

import {
    getPaper,
    likePaper,
    unlikePaper,
    searchPaper,
} from "./paper/paper";

import {
    makeNewCollection,
    getCollectionsByUserId,
    getCollection,
    getCollectionPapers,
    // getCollectionMembers,
    // getCollectionReplies,
    setOwner,
    setTitleAndDescription,
    addCollectionPaper,
    removeCollectionPaper,
    addNewMembers,
    // removeCollectionMember,
    deleteCollection,
    likeCollection,
    unlikeCollection,
    searchCollection,
} from "./collection/collection";

import {
    getUserByUserId,
    getFollowersByUserId,
    getFollowingsByUserId,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
    searchUser,
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
    setOwner,
    setTitleAndDescription,
    addCollectionPaper,
    removeCollectionPaper,
    addNewMembers,
    // removeCollectionMember,
    deleteCollection,
    likeCollection,
    unlikeCollection,
    searchCollection,
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
    getNoti,
    readNoti,
};
export const paperActions = {
    getPaper,
    likePaper,
    unlikePaper,
    searchPaper,
};

export const userActions = {
    getUserByUserId,
    getFollowersByUserId,
    getFollowingsByUserId,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
    searchUser,
};
