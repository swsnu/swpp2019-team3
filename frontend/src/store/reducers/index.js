import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import CollectionReducer from "./Collection/CollectionReducer";
import UserReducer from "./UserReducer";
import authReducer from "./auth";

const rootReducer = (history) => combineReducers({
    // put reducers here
    auth: AuthReducer,
    collection: CollectionReducer,
    user: UserReducer,
    router: connectRouter(history),
    auth: authReducer,
});

export default rootReducer;
