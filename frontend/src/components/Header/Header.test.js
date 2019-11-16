import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { authActions } from "../../store/actions";
import { signoutStatus } from "../../constants/constants";
import { getMockStore } from "../../test-utils/mocks";
import Header from "./Header";

let stubInitialState = {
    collection: {},
    auth: {
        singoutStatus: signoutStatus.NONE,
        me: null,
    },
    paper: {},
    user: {},
    review: {},
};
const mockHistory = { push: jest.fn() };
const makeHeader = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <Header history={mockHistory} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<Header />", () => {
    let spySignout;

    beforeEach(() => {
        spySignout = jest.spyOn(authActions, "signout")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".header").hostNodes();
        expect(wrapper.length).toBe(1);
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
        expect(headerInstance.state.searchKeyword).toEqual("ABC");
    });

    it("should call signout and redirect when signout succeeds", () => {
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
        // FIXME: async test problem, it should be 1
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });

    it("should not redirect when signout fails", () => {
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

        // FIXME: async test problem
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
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
});
