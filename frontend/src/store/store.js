import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import rootReducer from "./reducers/index";


const logger = (store) => (next) => (action) => {
    window.console.log("[Middleware] Dispatching", action);
    const result = next(action);
    window.console.log("[Middleware] Next State", store.getState());
    return result;
};

export const history = createBrowserHistory();
export const middlewares = [logger, thunk, routerMiddleware(history)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer(history), composeEnhancers(
    applyMiddleware(...middlewares),
));

export default store;
