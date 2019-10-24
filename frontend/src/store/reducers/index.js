import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// import reducers here

const rootReducer = (history) => combineReducers({
    // put reducers here

    router: connectRouter(history),
});

export default rootReducer;
