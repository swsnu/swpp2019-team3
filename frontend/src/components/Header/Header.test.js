import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Route, Switch, Router } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import { authActions } from "../../store/actions";
import { signoutStatus, notiStatus } from "../../constants/constants";
import { getMockStore, flushPromises } from "../../test-utils/mocks";
import Header from "./Header";
import { history } from "../../store/store";

/* eslint-disable react/jsx-props-no-spreading */
const makeHeader = (initialState, props = {}) => (
    <Router history={history}>
        <Provider store={getMockStore(initialState)}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route path="/" exact render={() => (<Header {...props} />)} />
                </Switch>
            </ConnectedRouter>
        </Provider>
    </Router>
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
                notifications: {
                    getStatus: notiStatus.NONE,
                    readStatus: notiStatus.NONE,
                    notifications: [],
                    pageNum: 0,
                    finished: true,
                    totalCount: 0,
                },
            },
            paper: {},
            user: {},
            review: {},
            reply: {},
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

    it("should render notifications properly", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: {
                    getStatus: notiStatus.NONE,
                    readStatus: notiStatus.NONE,
                    notifications: [{
                        id: 1,
                        actor: { id: 1, username: "user1" },
                        verb: "liked",
                        target: { type: "review", id: 1, string: "review_title" },
                    },
                    {
                        id: 2,
                        actor: { id: 1, username: "user1" },
                        verb: "liked",
                        target: { type: "collection", id: 1, string: "collection_title" },
                    },
                    {
                        id: 3,
                        actor: { id: 1, username: "user1" },
                        verb: "started following you",
                        target: { type: "user", id: 1, string: "user2" },
                    },
                    ],
                    pageNum: 0,
                    finished: true,
                    totalCount: 0,
                },
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const instance = component.find(Header.WrappedComponent).instance();
        instance.openNoti();
        await flushPromises();
        component.update();

        const wrapper = component.find(".notification-entry");
        expect(wrapper.length).toBe(3);
    });

    it("should call readNoti if read-button is clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: {
                    getStatus: notiStatus.NONE,
                    readStatus: notiStatus.NONE,
                    notifications: [{
                        id: 1,
                        actor: { id: 1, username: "user1" },
                        verb: "liked",
                        target: { type: "review", id: 1, string: "review_title" },
                    },
                    ],
                    pageNum: 0,
                    finished: true,
                    totalCount: 0,
                },
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const instance = component.find(Header.WrappedComponent).instance();
        instance.openNoti();
        await flushPromises();
        component.update();

        const wrapper = component.find(".read-button");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyReadNoti).toHaveBeenCalledTimes(1);
    });

    it("should not call readNoti if actor-link is clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: {
                    getStatus: notiStatus.NONE,
                    readStatus: notiStatus.NONE,
                    notifications: [{
                        id: 1,
                        actor: { id: 1, username: "user1" },
                        verb: "liked",
                        target: { type: "review", id: 1, string: "review_title" },
                    },
                    ],
                    pageNum: 0,
                    finished: true,
                    totalCount: 0,
                },
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const instance = component.find(Header.WrappedComponent).instance();
        instance.openNoti();
        await flushPromises();
        component.update();

        const wrapper = component.find("#actor-link").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyReadNoti).toHaveBeenCalledTimes(0);
    });

    it("should call not readNoti if target-link is clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                notifications: {
                    getStatus: notiStatus.NONE,
                    readStatus: notiStatus.NONE,
                    notifications: [{
                        id: 1,
                        actor: { id: 1, username: "user1" },
                        verb: "liked",
                        target: { type: "review", id: 1, string: "review_title" },
                    },
                    ],
                    pageNum: 0,
                    finished: true,
                    totalCount: 0,
                },
            },
        };
        header = makeHeader(stubInitialState);
        const component = mount(header);

        const instance = component.find(Header.WrappedComponent).instance();
        instance.openNoti();
        await flushPromises();
        component.update();

        const wrapper = component.find("#target-link").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyReadNoti).toHaveBeenCalledTimes(0);
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
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                signoutStatus: signoutStatus.SUCCESS,
            },
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".signout-button").hostNodes();
        wrapper.simulate("click");

        expect(spySignout).toHaveBeenCalledTimes(1);
        // FIXME: async problems
    });

    it("should not call signout when signout fails", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                signoutStatus: signoutStatus.FAILURE,
            },
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".signout-button").hostNodes();
        wrapper.simulate("click");

        expect(spySignout).toHaveBeenCalledTimes(1);
        // FIXME: async problems
    });

    it("if me exists, should set state appropriately", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                signoutStatus: signoutStatus.FAILURE,
                me: { username: "swpp" },
            },
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".username-header").hostNodes();
        expect(wrapper.text()).toEqual("swpp");
    });

    it("should redirect if enter is pressed and search-input exists", () => {
        const spyPush = jest.spyOn(history, "push");
        const component = mount(makeHeader(stubInitialState));

        const wrapper = component.find(".search-input").hostNodes();
        wrapper.simulate("change", { target: { value: "abc" } });
        // if press other key, nothing should happen
        wrapper.simulate("keypress", { charCode: 17 });
        expect(spyPush).toHaveBeenCalledTimes(0);

        wrapper.simulate("keypress", { charCode: 13 });
        expect(spyPush).toHaveBeenCalledTimes(1);
    });
});
