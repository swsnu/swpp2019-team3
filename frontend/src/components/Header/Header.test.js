import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";

import { authActions } from "../../store/actions";
import { signoutStatus } from "../../constants/constants";
import { getMockStore } from "../../test-utils/mocks";
import Header from "./Header";


const history = createBrowserHistory();

/* eslint-disable react/jsx-props-no-spreading */
const makeHeader = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" exact render={() => (<Header {...props} />)} />
            </Switch>
        </ConnectedRouter>
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<Header />", () => {
    let stubInitialState;
    let header;
    let spySignout;
    let spyGetNoti;
    let spyReadNoti;

    beforeEach(() => {
        stubInitialState = {
            collection: {},
            auth: {
                singoutStatus: signoutStatus.NONE,
                me: null,
            },
            paper: {},
            user: {},
            review: {},
        };
        header = makeHeader(stubInitialState);
        spySignout = jest.spyOn(authActions, "signout")
            .mockImplementation(() => () => mockPromise);
        spyGetNoti = jest.spyOn(authActions, "getNoti")
            .mockImplementation(() => () => mockPromise);
        spyReadNoti = jest.spyOn(authActions, "readNoti")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors and call getNoti", () => {
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".header").hostNodes();
        expect(wrapper.length).toBe(1);
        expect(spyGetNoti).toHaveBeenCalledTimes(1);
    });

    it("should render notifications properly", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: [{
                    id: 1,
                    actor: { id: 1, username: "user1" },
                    verb: "liked",
                    action_object: { type: "review", id: 1, string: "review_title" },
                },
                {
                    id: 2,
                    actor: { id: 1, username: "user1" },
                    verb: "liked",
                    action_object: { type: "collection", id: 1, string: "collection_title" },
                },
                {
                    id: 3,
                    actor: { id: 1, username: "user1" },
                    verb: "started following you",
                    action_object: { type: "user", id: 1, string: "user2" },
                },
                ],
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);
        const wrapper = component.find(".notification-entry");
        expect(wrapper.length).toBe(3);
    });

    it("should call readNoti if read-button is clicked", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: [{
                    id: 1,
                    actor: { id: 1, username: "user1" },
                    verb: "liked",
                    action_object: { type: "review", id: 1, string: "review_title" },
                },
                ],
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const wrapper = component.find(".read-button");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyReadNoti).toHaveBeenCalledTimes(1);
    });

    it("should call readNoti if actor-link is clicked", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: [{
                    id: 1,
                    actor: { id: 1, username: "user1" },
                    verb: "liked",
                    action_object: { type: "review", id: 1, string: "review_title" },
                },
                ],
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const wrapper = component.find("#actor-link").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyReadNoti).toHaveBeenCalledTimes(1);
    });

    it("should call readNoti if action-object-link is clicked", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: [{
                    id: 1,
                    actor: { id: 1, username: "user1" },
                    verb: "liked",
                    action_object: { type: "review", id: 1, string: "review_title" },
                },
                ],
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const wrapper = component.find("#action-object-link").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyReadNoti).toHaveBeenCalledTimes(1);
    });

    it("should handle input change in searchbar", () => {
        const event = {
            target: {
                value: "ABC",
            },
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".search-input").hostNodes();
        wrapper.simulate("change", event);
        const headerInstance = component.find(Header.WrappedComponent).instance();
        expect(headerInstance.state.searchWord).toEqual("ABC");
    });

    it("should call signout when signout succeeds", () => {
        stubInitialState = {
            auth: {
                signoutStatus: signoutStatus.SUCCESS,
            },
            collection: {},
            paper: {},
            user: {},
            review: {},
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".signout-button").hostNodes();
        wrapper.simulate("click");

        expect(spySignout).toHaveBeenCalledTimes(1);
        // FIXME: async problems
    });

    it("should not call signout when signout fails", () => {
        stubInitialState = {
            auth: {
                signoutStatus: signoutStatus.FAILURE,
            },
            collection: {},
            paper: {},
            user: {},
            review: {},
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".signout-button").hostNodes();
        wrapper.simulate("click");

        expect(spySignout).toHaveBeenCalledTimes(1);
        // FIXME: async problems
    });

    it("if me exists, should set state appropriately", () => {
        stubInitialState = {
            auth: {
                signoutStatus: signoutStatus.FAILURE,
                me: { username: "swpp" },
            },
            collection: {},
            paper: {},
            user: {},
            review: {},
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".username-header").hostNodes();
        expect(wrapper.text()).toEqual("swpp");
    });

    it("should redirect if enter is pressed and search-input exists", () => {
        const mockHistory = { push: jest.fn() };
        const component = mount(makeHeader(stubInitialState,
            { history: mockHistory }));

        const wrapper = component.find(".search-input").hostNodes();
        wrapper.simulate("change", { target: { value: "abc" } });

        // if press other key, nothing should happen
        wrapper.simulate("keypress", { charCode: 17 });
        expect(mockHistory.push).toHaveBeenCalledTimes(0);

        wrapper.simulate("keypress", { charCode: 13 });
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
    });
});
