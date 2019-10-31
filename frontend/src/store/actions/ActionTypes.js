// Search
export const SEARCH = "SEARCH";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAILURE = "SEARCH_FAILURE";

// Login
export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

// Review
export const EDIT_REVIEW = "EDIT_REVIEW";
export const MAKE_REVIEW = "MAKE_REVIEW";
export const GET_REVIEW = "GET_REVIEW";
export const LIKE_REVIEW = "LIKE_REVIEW";
export const LIKE_REVIEW_CANCEL = "LIKE_REVIEW_CANCEL";
export const DEL_REVIEW = "DEL_REVIEW";
export const GET_REVIEW_LIKES_COUNT = "GET_REVIEW_LIKES_COUNT";
export const GET_REVIEW_IS_LIKED = "GET_REVIEW_IS_LIKED";
export const CONSUME_REVIEW = "CONSUME_REVIEW";
// getReviewsByPaperId(paper_id: number) -> Promise<{status: number, data: Review[]}>
// getReviewsByUserId(user_id: number) -> Promise<{status: number, data: Review[]}>
// getRecentReviewsByUserId(user_id: number) -> Promise<{status: number, data: Review[]}>

// Review Reply
export const MAKE_REVIEW_REPLY = "MAKE_REVIEW_REPLY";
export const GET_REPLIES_BY_REVIEW = "GET_REPLIES_BY_REVIEW_=Id";
export const EDIT_REVIEW_REPLY = "EDIT_REVIEW_REPLY";
export const DEL_REVIEW_REPLY = "DEL_REVIEW_REPLY";
export const LIKE_REVIEW_REPLY = "LIKE_REVIEW_REPLY";
export const LIKE_REVIEW_REPLY_CANCEL = "LIKE_REVIEW_REPLY_CANCEL";
export const GET_REVIEW_REPLY_LIKES_COUNT = "GET_REVIEW_REPLY_LIKES_COUNT";
export const GET_REVIEW_REPLY_IS_LIKED = "GET_REVIEW_REPLY_IS_LIKED";
