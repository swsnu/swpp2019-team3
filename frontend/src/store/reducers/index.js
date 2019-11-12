import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import collectionReducer from "./collection/collection";
import authReducer from "./auth/auth";
import paperReducer from "./paper/paper";

const rootReducer = (history) => combineReducers({
    paper: paperReducer,
    collection: collectionReducer,
    auth: authReducer,
    router: connectRouter(history),
});
export default rootReducer;
