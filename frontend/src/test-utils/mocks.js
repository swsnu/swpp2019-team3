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
    const mockCollectionReducer = getMockReducer(initialState.collection);
    const rootReducer = (his) => combineReducers({
        router: connectRouter(his),
        auth: mockAuthReducer,
        collection: mockCollectionReducer,
    });

    const mockStore = createStore(rootReducer(history), applyMiddleware(...middlewares));
    return mockStore;
};

// eslint-disable-next-line react/display-name
export const mockComponent = (componentName) => (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={componentName} {...props} />
);
