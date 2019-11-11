import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import CollectionReducer from "./Collection/CollectionReducer";
import authReducer from "./auth/auth";
import paperReducer from "./paper/paper";
import UserReducer from "./user/UserReducer";

const rootReducer = (history) => combineReducers({
    paper: paperReducer,
    collection: CollectionReducer,
    auth: authReducer,
    user: UserReducer,
    router: connectRouter(history),
});
export default rootReducer;
