import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

<<<<<<< HEAD
import CollectionReducer from "./Collection/CollectionReducer";
// import UserReducer from "./UserReducer";
import authReducer from "./auth";
import paperReducer from "./paper";
=======
// import UserReducer from "./UserReducer";
import authReducer from "./auth/auth";
import paperReducer from "./paper/paper";
>>>>>>> a62f5e1413922c225fba211ce25e6dcbb30c7b8a

const rootReducer = (history) => combineReducers({
    // put reducers here
    paper: paperReducer,
<<<<<<< HEAD
    collection: CollectionReducer,
=======
>>>>>>> a62f5e1413922c225fba211ce25e6dcbb30c7b8a
    // user: UserReducer,
    auth: authReducer,
    router: connectRouter(history),
});
export default rootReducer;
