import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import collectionReducer from "./collection/collection";
import authReducer from "./auth/auth";
import paperReducer from "./paper/paper";
import UserReducer from "./user/user";
import ReviewReducer from "./review/review";

const rootReducer = (history) => combineReducers({
    paper: paperReducer,
    collection: collectionReducer,
    auth: authReducer,
    user: UserReducer,
    review: ReviewReducer,
    router: connectRouter(history),
});
export default rootReducer;
