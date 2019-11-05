import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import authReducer from "./auth";
import paperReducer from "./paper";

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    paper: paperReducer,
});

export default rootReducer;
