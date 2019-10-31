import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import ReviewReducer from "./Review/ReviewReducer";
import ReviewReplyReducer from "./Review/ReviewReplyReducer";

const rootReducer = (history) => combineReducers({
    review: ReviewReducer,
    reviewReply: ReviewReplyReducer,
    router: connectRouter(history),
});

export default rootReducer;
