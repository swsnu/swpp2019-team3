/* eslint-disable max-len */
/* // will implement actions for review here

import axios from "axios";
import * as actionTypes from "../ActionTypes";

// getReviewsByUserId(user_id: number) -> Promise<{status: number, data: Review[]}>: Call backend api to get reviews written by the selected user.
export const getReviewsByUserId = (userID) => (dispatch) => {

};

export const getUserByUserId = (userID) => (dispatch) => axios.get(`/user/${userID}`)
    .then((res) => dispatch({
        type: actionTypes.GET_USER, selectedUser: res.data,
    }));


// implement another functions at below

// makeNewReview(paper_id: number, user_id: number, content: string) -> Promise<{status: number, data: Review}>: Call backend api to make a new review.
// getReviewsByPaperId(paper_id: number) -> Promise<{status: number, data: Review[]}>: Call backend api to get reviews on the selected paper.
// getRecentReviewsByUserId(user_id: number) -> Promise<{status: number, data: Review[]}>: Call backend api to get reviews which the user recently viewed.
// getReview(review_id: number) -> Promise<{status: number, data: Review}>: Call backend api to get the selected review
// setReviewContent(review_id:number, review_title: string, review_content: string) -> Promise<{status: number, data: Review}>: Call backend api to apply the title and content change of a review
// addReviewLike(review_id:number, user_id:number) -> Promise<{status: number, data: Review}>: Call backend api to add the user to the list of the users who like the review.
// removeReviewLike(review_id:number, user_id:number) -> Promise<{status: number, data: Review}>: Call backend api to remove the user from the list of the users who like the review.
// deleteReview(review_id:number) -> Promise<{status: number, data: Review}>: Call backend api to delete the review.
// getReviewLikesCount(review_id) -> Promise<{status: number, data: number}>: Call backend api to get the number of users who like this review.
// getReviewIsLiked(review_id:number, user_id:number) -> Promise<{status: number, data: boolean}>: Call backend api to check if the current user likes the review.
// consumeReview(review_id: number, user_id: number) -> Promise<{status: number, data: Review}>: Call backend api to log the user viewed the review.
*/
