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
    getPaperLike,
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
    searchCollection,
    getCollectionLike,
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
    getReviewLike,
} from "./review/review";

import {
    getRepliesByCollection,
    getRepliesByReview,
    makeNewReplyCollection,
    makeNewReplyReview,
    editReplyCollection,
    editReplyReview,
    deleteReplyCollection,
    deleteReplyReview,
    likeReply,
    unlikeReply,
} from "./reply/reply";
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
    searchCollection,
    getCollectionLike,
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
    getReviewLike,
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
    getPaperLike,
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

export const replyActions = {
    getRepliesByCollection,
    getRepliesByReview,
    makeNewReplyCollection,
    makeNewReplyReview,
    editReplyCollection,
    editReplyReview,
    deleteReplyCollection,
    deleteReplyReview,
    likeReply,
    unlikeReply,
};
