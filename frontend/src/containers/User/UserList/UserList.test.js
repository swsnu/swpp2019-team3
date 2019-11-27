import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import UserList from "./UserList";
import { userActions } from "../../../store/actions";
import { getMockStore, mockPromise } from "../../../test-utils/mocks";

const mockHistory = { push: jest.fn() };
const makeFollowingList = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <UserList history={mockHistory} location={{ pathname: "/profile_id=1/followings" }} />
    </Provider>
);
const makeFollowerList = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <UserList history={mockHistory} location={{ pathname: "/profile_id=1/followers" }} />
    </Provider>
);
const makeWrongList = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <UserList history={mockHistory} location={{ pathname: "/profile_id=1/wrong" }} />
    </Provider>
);

describe("<UserList />", () => {
    let stubInitialState;
    let followingList;
    let spyFollowingsUser;
    let followerList;
    let spyFollowersUser;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            collection: {},
            review: {},
            auth: {},
            user: {},
            reply: {},
        };
        followingList = makeFollowingList(stubInitialState);
        spyFollowingsUser = jest.spyOn(userActions, "getFollowingsByUserId")
            .mockImplementation(() => () => mockPromise);
        followerList = makeFollowerList(stubInitialState);
        spyFollowersUser = jest.spyOn(userActions, "getFollowersByUserId")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors and call UserList API", () => {
        const followingComponent = mount(followingList);
        const followingWrapper = followingComponent.find(".user-list");
        expect(followingWrapper.length).toBe(1);
        expect(spyFollowingsUser).toBeCalledTimes(1);

        const followerComponent = mount(followerList);
        const followerWrapper = followerComponent.find(".user-list");
        expect(followerWrapper.length).toBe(1);
        expect(spyFollowersUser).toBeCalledTimes(1);
    });

    it("should not call anything when wrong pathname", () => {
        mount(makeWrongList(stubInitialState));
        expect(spyFollowingsUser).toBeCalledTimes(0);
        expect(spyFollowersUser).toBeCalledTimes(0);
    });

    it("should make userCardsLeft and userCardsRight well", () => {
        const followingComponent = mount(makeFollowingList(stubInitialState));
        const followingInstance = followingComponent.find(UserList.WrappedComponent).instance();
        followingInstance.setState(
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
        followingComponent.update();

        const followingWrapperLeft = followingComponent.find("#user-cards-left");
        const followingWrapperRight = followingComponent.find("#user-cards-right");
        expect(followingComponent.find("UserCard").length).toBe(2);
        expect(followingWrapperLeft.children().length).toBe(1);
        expect(followingWrapperRight.children().length).toBe(1);

        const followerComponent = mount(makeFollowerList(stubInitialState));
        const followerInstance = followerComponent.find(UserList.WrappedComponent).instance();
        followerInstance.setState(
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
        followerComponent.update();

        const followerWrapperLeft = followerComponent.find("#user-cards-left");
        const followerWrapperRight = followerComponent.find("#user-cards-right");
        expect(followerComponent.find("UserCard").length).toBe(2);
        expect(followerWrapperLeft.children().length).toBe(1);
        expect(followerWrapperRight.children().length).toBe(1);
    });
});
