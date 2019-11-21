import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import UserCard from "./UserCard";
import { getMockStore } from "../../../test-utils/mocks";
import { userActions } from "../../../store/actions";

const mockHistory = { push: jest.fn() };

/* eslint-disable react/jsx-props-no-spreading */
const makeUserCard = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <UserCard id={1} history={mockHistory} {...props} />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<UserCard />", () => {
    let stubInitialState;
    let userCard;
    let spyFollow;
    let spyUnfollow;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            auth: {},
            collection: {},
            review: {},
            user: {},
        };
        userCard = makeUserCard(stubInitialState);
        spyFollow = jest.spyOn(userActions, "addUserFollowing")
            .mockImplementation(() => () => mockPromise);
        spyUnfollow = jest.spyOn(userActions, "removeUserFollowing")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(userCard);
        const wrapper = component.find(".wrapper");
        expect(wrapper.length).toBe(1);
    });

    it("should call addUserFollowing when follow-button is clicked", () => {
        const component = mount(userCard);
        const wrapper = component.find(".follow-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyFollow).toHaveBeenCalledTimes(1);
    });

    it("should call removeUserFollowing when doIFollow and follow-button is clicked", () => {
        const component = mount(userCard);
        const instance = component.find(UserCard.WrappedComponent).instance();
        instance.setState({ doIFollow: true });
        component.update();

        const wrapper = component.find(".follow-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnfollow).toHaveBeenCalledTimes(1);
    });
});
