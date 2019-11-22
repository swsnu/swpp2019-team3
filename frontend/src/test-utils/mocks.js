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
    const mockPaperReducer = getMockReducer(initialState.paper);
    const mockCollectionReducer = getMockReducer(initialState.collection);
    const mockUserReducer = getMockReducer(initialState.user);
    const mockReviewReducer = getMockReducer(initialState.review);
    const mockReplyReducer = getMockReducer(initialState.reply);
    const rootReducer = (his) => combineReducers({
        router: connectRouter(his),
        auth: mockAuthReducer,
        paper: mockPaperReducer,
        collection: mockCollectionReducer,
        user: mockUserReducer,
        review: mockReviewReducer,
        reply: mockReplyReducer,
    });

    const mockStore = createStore(rootReducer(history), applyMiddleware(...middlewares));
    return mockStore;
};

// eslint-disable-next-line react/display-name
export const mockComponent = (componentName) => (props) => (
    /* eslint-disable react/jsx-props-no-spreading */
    <div className={componentName} {...props} />
    /* eslint-enable react/jsx-props-no-spreading */
);
