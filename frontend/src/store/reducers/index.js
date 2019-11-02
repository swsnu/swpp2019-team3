import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import authReducer from "./auth";

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
});

export default rootReducer;
