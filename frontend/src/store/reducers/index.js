import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// import reducers here
import AuthReducer from "./AuthReducer";
import CollectionReducer from "./Collection/CollectionReducer";
import UserReducer from "./UserReducer";

const rootReducer = (history) => combineReducers({
    // put reducers here
    auth: AuthReducer,
    collection: CollectionReducer,
    user: UserReducer,
    router: connectRouter(history),
});

export default rootReducer;
