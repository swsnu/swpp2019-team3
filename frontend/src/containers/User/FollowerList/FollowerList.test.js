import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import FollowerList from "./FollowerList";
import { userActions } from "../../../store/actions";
import { getMockStore } from "../../../test-utils/mocks";

const mockHistory = { push: jest.fn() };
const makeFollowerList = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <FollowerList history={mockHistory} location={{ pathname: "/followers=1" }} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<FollowerList />", () => {
    let stubInitialState;
    let followerList;
    let spyFollowersUser;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            collection: {},
            review: {},
            auth: {},
            user: {},
        };
        followerList = makeFollowerList(stubInitialState);
        spyFollowersUser = jest.spyOn(userActions, "getFollowersByUserId")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors and call Follower User", () => {
        const component = mount(followerList);
        const wrapper = component.find(".follower-list");
        expect(wrapper.length).toBe(1);
        expect(spyFollowersUser).toBeCalledTimes(1);
    });

    it("should make userCardsLeft and userCardsRight well", () => {
        const component = mount(makeFollowerList(stubInitialState));
        const instance = component.find(FollowerList.WrappedComponent).instance();
        instance.setState(
            {
                users: [{
                    id: 1,
                    username: "girin",
                    email: "swpp@snu.ac.kr",
                    description: "",
                    doIFollow: true,
                    count: {
                        follower: 100,
                        following: 50,
                    },
                }, {
                    id: 2,
                    username: "ggirin",
                    email: "sswpp@snu.ac.kr",
                    description: "",
                    doIFollow: false,
                    count: {
                        follower: 100,
                        following: 50,
                    },
                },
                ],
            },
        );
        component.update();

        const wrapperLeft = component.find("#user-cards-left");
        const wrapperRight = component.find("#user-cards-right");
        expect(component.find("UserCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);
    });
});
