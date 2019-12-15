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
    getSubscriptions,
    getRecommendations,
    getKeywordsInit,
    makeTasteInit,
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
    getSharedCollectionsByUserId,
    getCollection,
    getCollectionPapers,
    getCollectionMembers,
    setOwner,
    setTitleAndDescription,
    addCollectionPaper,
    removeCollectionPaper,
    addNewMembers,
    deleteMembers,
    acceptInvitation,
    dismissInvitation,
    leaveCollection,
    deleteCollection,
    likeCollection,
    unlikeCollection,
    searchCollection,
    getCollectionLike,
    changeCollectionType,
} from "./collection/collection";

import {
    getUserByUserId,
    getFollowersByUserId,
    getFollowingsByUserId,
    getFollowingsNotInCollection,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
    searchUser,
    searchUserNotInCollection,
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
    getSharedCollectionsByUserId,
    getCollection,
    getCollectionPapers,
    getCollectionMembers,
    setOwner,
    setTitleAndDescription,
    addCollectionPaper,
    removeCollectionPaper,
    addNewMembers,
    deleteMembers,
    acceptInvitation,
    dismissInvitation,
    leaveCollection,
    deleteCollection,
    likeCollection,
    unlikeCollection,
    searchCollection,
    getCollectionLike,
    changeCollectionType,
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
    getSubscriptions,
    getRecommendations,
    getKeywordsInit,
    makeTasteInit,
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
    getFollowingsNotInCollection,
    addUserFollowing,
    removeUserFollowing,
    editUserInfo,
    searchUser,
    searchUserNotInCollection,
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
