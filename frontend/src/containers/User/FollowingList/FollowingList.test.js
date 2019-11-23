import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import FollowingList from "./FollowingList";
import { userActions } from "../../../store/actions";
import { getMockStore } from "../../../test-utils/mocks";

const mockHistory = { push: jest.fn() };
const makeFollowingList = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <FollowingList history={mockHistory} location={{ pathname: "/followings=1" }} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<FollowingList />", () => {
    let stubInitialState;
    let followingList;
    let spyFollowingsUser;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            collection: {},
            review: {},
            auth: {},
            user: {},
        };
        followingList = makeFollowingList(stubInitialState);
        spyFollowingsUser = jest.spyOn(userActions, "getFollowingsByUserId")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors and call Following User", () => {
        const component = mount(followingList);
        const wrapper = component.find(".following-list");
        expect(wrapper.length).toBe(1);
        expect(spyFollowingsUser).toBeCalledTimes(1);
    });

    it("should make userCardsLeft and userCardsRight well", () => {
        const component = mount(makeFollowingList(stubInitialState));
        const instance = component.find(FollowingList.WrappedComponent).instance();
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
