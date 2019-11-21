import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
// import { ConnectedRouter } from "connected-react-router";
// import { Route, Switch } from "react-router-dom";

import AccountSetting from "./AccountSetting";
import { userActions } from "../../../store/actions/index";
import { userStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";


const mockHistory = { push: jest.fn() };

/* eslint-disable react/jsx-props-no-spreading */
const makeAccountSetting = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <AccountSetting history={mockHistory} {...props} />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("AccountSetting Test", () => {
    let stubInitialState;
    let accountSetting = null;
    let spyEditMyInfo = null;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            auth: {
                me: { id: 1, email: "test@snu.ac.kr", description: "test" },
            },
            collection: {},
            user: {},
            review: {},
            reply: {},
        };
        accountSetting = makeAccountSetting(stubInitialState);

        spyEditMyInfo = jest.spyOn(userActions, "editUserInfo")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(accountSetting);
        const wrapper = component.find(".AccountSettingContent");
        expect(wrapper.length).toBe(1);
    });

    it("should set state properly on title and content input", () => {
        const component = mount(accountSetting);
        let wrapper = component.find("#editDescription");
        wrapper.simulate("change", { target: { value: "change description" } });
        wrapper = component.find("#editEmail");
        wrapper.simulate("change", { target: { value: "changed@snu.ac.kr" } });
        const instance = component.find(AccountSetting.WrappedComponent).instance();
        expect(instance.state.description).toBe("change description");
        expect(instance.state.email).toBe("changed@snu.ac.kr");
    });

    it("if edit button is clicked, should handle editing feature", () => {
        const component = mount(accountSetting);
        let wrapper = component.find("#editDescription");
        wrapper.simulate("change", { target: { value: "change description" } });
        wrapper = component.find("#editEmail");
        wrapper.simulate("change", { target: { value: "changed@snu.ac.kr" } });

        wrapper = component.find("#applyButton").hostNodes();
        wrapper.simulate("click");
        expect(spyEditMyInfo).toHaveBeenCalledTimes(1);
    });

    it("when status is DUPLICATE_EMAIL, show the corresponding message", () => {
        const component = mount(accountSetting);
        const instance = component.find(AccountSetting.WrappedComponent).instance();
        instance.setState({ editUserStatus: userStatus.DUPLICATE_EMAIL });
        component.update();
        const wrapper = component.find("#edituser-message");
        expect(wrapper.text()).toEqual("This email already exists");
    });
});
