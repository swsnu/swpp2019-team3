import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
// import { ConnectedRouter } from "connected-react-router";
// import { Route, Switch } from "react-router-dom";

import AccountSetting from "./AccountSetting";
import { userActions } from "../../../store/actions/index";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    paper: {},
    auth: {
        my: {
            id: 1,
        },
    },
    collection: {},
    user: {
        selectedUser: {
            description: "test",
            email: "test@snu.ac.kr",
        },
    },
};

const mockStore = getMockStore(stubInitialState);
const mockHistory = { push: jest.fn() };

describe("AccountSetting Test", () => {
    let accountSetting = null;

    beforeEach(() => {
        accountSetting = (
            <Provider store={mockStore}>
                <AccountSetting history={mockHistory} />
            </Provider>
        );
    });

    afterEach(() => { jest.clearAllMocks(); });

    it("should render without errors", () => {
        const component = mount(accountSetting);
        const wrapper = component.find(".AccountSettingContent");
        expect(wrapper.length).toBe(1);
    });

    it("should have original information", () => {
        const component = mount(accountSetting);
        const instance = component.find(AccountSetting.WrappedComponent).instance();
        expect(instance.state.description).toBe("test");
        expect(instance.state.email).toBe("test@snu.ac.kr");
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
        /* eslint-disable no-unused-vars */
        const mockPromise = new Promise((resolve, reject) => { resolve(); });
        /* eslint-enable no-unused-vars */
        const spyEditMyInfo = jest.spyOn(userActions, "editUserInfo")
            .mockImplementation(() => () => mockPromise);

        const component = mount(accountSetting);
        const wrapper = component.find("#applyButton").at(0);
        wrapper.simulate("click");
        expect(spyEditMyInfo).toHaveBeenCalled();
    });
});
