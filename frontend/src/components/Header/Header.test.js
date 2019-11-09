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
};
const mockHistory = { push: jest.fn() };
const makeHeader = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <Header history={mockHistory} />
    </Provider>
);

describe("<Header />", () => {
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

    it("should redirect when signout succeed", () => {
        stubInitialState = {
            auth: {
                signoutStatus: signoutStatus.SUCCESS,
            },
            collection: {},
            paper: {},
        };
        const component = mount(makeHeader(stubInitialState));
        const wrapper = component.find(".signout-button").hostNodes();
        wrapper.simulate("click");

        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });
});
