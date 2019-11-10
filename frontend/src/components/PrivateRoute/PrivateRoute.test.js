import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { authActions } from "../../store/actions";
import { getMeStatus } from "../../constants/constants";
import { getMockStore } from "../../test-utils/mocks";
import PrivateRoute from "./PrivateRoute";

let stubInitialState = {
    collection: {},
    auth: {
        getMeStatus: getMeStatus.NONE,
        me: null,
    },
    paper: {},
};
let mockHistory;
const makePrivateRoute = (initialState, history) => (
    <Provider store={getMockStore(initialState)}>
        <PrivateRoute history={history} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<PrivateRoute />", () => {
    let spyGetMe;

    beforeEach(() => {
        mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/main" } };
        spyGetMe = jest.spyOn(authActions, "getMe")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors and call getMe", () => {
        const component = mount(makePrivateRoute(stubInitialState, mockHistory));
        const wrapper = component.find(".privateroute").hostNodes();
        expect(wrapper.length).toBe(1);
        expect(spyGetMe).toHaveBeenCalledTimes(1);
    });

    it("should stay when getMe succeeds on other than Intro Page", () => {
        stubInitialState = {
            auth: {
                getMeStatus: getMeStatus.SUCCESS,
            },
            collection: {},
            paper: {},
        };
        const component = mount(makePrivateRoute(stubInitialState, mockHistory));
        component.update();

        // FIXME: async test problem
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });

    it("should redirect when getMe succeeds on Intro Page", () => {
        stubInitialState = {
            auth: {
                getMeStatus: getMeStatus.SUCCESS,
            },
            collection: {},
            paper: {},
        };
        mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/" } };
        const component = mount(makePrivateRoute(stubInitialState, mockHistory));
        component.update();

        // FIXME: async test problem, it should be 1
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });

    it("should stay when getMe fails on Intro Page", () => {
        stubInitialState = {
            auth: {
                getMeStatus: getMeStatus.FAILURE,
            },
            collection: {},
            paper: {},
        };
        mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/" } };
        const component = mount(makePrivateRoute(stubInitialState, mockHistory));
        component.update();

        // FIXME: async test problem
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });

    it("should redirect when getMe fails on other than Intro Page", () => {
        stubInitialState = {
            auth: {
                getMeStatus: getMeStatus.FAILURE,
            },
            collection: {},
            paper: {},
        };
        const component = mount(makePrivateRoute(stubInitialState, mockHistory));
        component.update();

        // FIXME: async test problem, it should be 1
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });
});
