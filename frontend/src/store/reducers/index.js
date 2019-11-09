import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// import UserReducer from "./UserReducer";
import authReducer from "./auth/auth";
import paperReducer from "./paper/paper";

const rootReducer = (history) => combineReducers({
    // put reducers here
    paper: paperReducer,
    // user: UserReducer,
    auth: authReducer,
    router: connectRouter(history),
});
export default rootReducer;
