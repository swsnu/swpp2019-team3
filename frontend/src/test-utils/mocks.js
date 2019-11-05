import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

const getMockReducer = jest.fn(
    (initialState) => (state = initialState, action) => {
        switch (action.type) {
        default:
            break;
        }
        return state;
    },
);

export const history = createBrowserHistory();
export const middlewares = [thunk, routerMiddleware(history)];

export const getMockStore = (initialState) => {
    const mockAuthReducer = getMockReducer(initialState.auth);
<<<<<<< HEAD
    const mockCollectionReducer = getMockReducer(initialState.collection);
    const rootReducer = (his) => combineReducers({
        router: connectRouter(his),
        auth: mockAuthReducer,
        collection: mockCollectionReducer,
=======
    const rootReducer = (his) => combineReducers({
        router: connectRouter(his),
        auth: mockAuthReducer,
>>>>>>> 2b3d0721d148abdcb14263cd42b1ee2945a7a00d
    });

    const mockStore = createStore(rootReducer(history), applyMiddleware(...middlewares));
    return mockStore;
};

<<<<<<< HEAD
// eslint-disable-next-line react/display-name
export const mockComponent = (componentName) => (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={componentName} {...props} />
=======
export const mockComponent = (componentName) => (props) => (
    /* eslint-disable react/jsx-props-no-spreading */
    <div className={componentName} {...props} />
    /* eslint-enable react/jsx-props-no-spreading */
>>>>>>> 2b3d0721d148abdcb14263cd42b1ee2945a7a00d
);
