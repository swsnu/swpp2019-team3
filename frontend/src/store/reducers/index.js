import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import CollectionReducer from "./Collection/CollectionReducer";
// import UserReducer from "./UserReducer";
import authReducer from "./auth";

const rootReducer = (history) => combineReducers({
    // put reducers here
    collection: CollectionReducer,
    // user: UserReducer,
    auth: authReducer,
    router: connectRouter(history),

});

export default rootReducer;
