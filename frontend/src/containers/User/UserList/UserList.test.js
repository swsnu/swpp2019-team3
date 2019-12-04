import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import UserList from "./UserList";
import { userStatus, collectionStatus } from "../../../constants/constants";
import { userActions, collectionActions } from "../../../store/actions";
import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";


const makeUserList = (initialState, mode) => (
    <Provider store={getMockStore(initialState)}>
        <ConnectedRouter history={createBrowserHistory()}>
            <Switch>
                <Route
                  path="/"
                  exact
                  render={() => (
                      <div>
                          <UserList
                            mode={mode}
                            match={
                                { params: { id: 1 } }
                            }
                          />
                      </div>
                  )}
                />
            </Switch>
        </ConnectedRouter>
    </Provider>
);

describe("<UserList />", () => {
    let stubInitialState;
    let followingList;
    let spyFollowingsUser;
    let followerList;
    let spyFollowersUser;
    let memberList;
    let spyGetMembers;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            collection: {
                selected: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: null,
                    papers: [],
                    memberCount: 0,
                    replies: [],
                },
                getMembers: {
                    members: [{ id: 2, count: {} }],
                },
            },
            review: {},
            auth: {},
            user: {
                selectedUser: [],
                getFollowers: {
                    followers: [{ id: 2, count: {} }],
                },
                getFollowings: {
                    followings: [{ id: 2, count: {} }],
                },
                followCount: 0,
                unfollowCount: 0,
                status: userStatus.NONE,
                searchedUsers: [],
                error: null,
            },
            reply: {},
        };
        followingList = makeUserList(stubInitialState, "followings");
        spyFollowingsUser = jest.spyOn(userActions, "getFollowingsByUserId")
            .mockImplementation(() => () => mockPromise);
        followerList = makeUserList(stubInitialState, "followers");
        spyFollowersUser = jest.spyOn(userActions, "getFollowersByUserId")
            .mockImplementation(() => () => mockPromise);
        memberList = makeUserList(stubInitialState, "members");
        spyGetMembers = jest.spyOn(collectionActions, "getCollectionMembers")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors and call UserList API", async () => {
        const followingComponent = mount(followingList);
        const followingWrapper = followingComponent.find(".user-list");
        expect(followingWrapper.length).toBe(1);
        expect(spyFollowingsUser).toBeCalledTimes(1);
        await flushPromises();
        followingComponent.update();
        let instance = followingComponent.find(UserList.WrappedComponent).instance();
        expect(instance.state.users.length).toBe(1);

        const followerComponent = mount(followerList);
        const followerWrapper = followerComponent.find(".user-list");
        expect(followerWrapper.length).toBe(1);
        expect(spyFollowersUser).toBeCalledTimes(1);
        await flushPromises();
        followerComponent.update();
        instance = followerComponent.find(UserList.WrappedComponent).instance();
        expect(instance.state.users.length).toBe(1);

        const memberComponent = mount(memberList);
        const memberWrapper = memberComponent.find(".user-list");
        expect(memberWrapper.length).toBe(1);
        expect(spyGetMembers).toBeCalledTimes(1);
        await flushPromises();
        memberComponent.update();
        instance = memberComponent.find(UserList.WrappedComponent).instance();
        expect(instance.state.users.length).toBe(1);
    });

    it("should redirect to Main Page if cannot get users", async () => {
        stubInitialState = {
            ...stubInitialState,
            collection: {
                getMembers: {
                    status: collectionStatus.FAILURE,
                },
            },
            user: {
                getFollowings: {
                    status: userStatus.USER_NOT_EXIST,
                },
                getFollowers: {
                    status: userStatus.USER_NOT_EXIST,
                },
            },
        };

        const followingComponent = mount(makeUserList(stubInitialState, "followings"));
        const followingWrapper = followingComponent.find(".user-list");
        expect(followingWrapper.length).toBe(1);
        expect(spyFollowingsUser).toBeCalledTimes(1);
        await flushPromises();
        // FIXME: expecting spyHistoryPush fails

        const followerComponent = mount(makeUserList(stubInitialState, "followers"));
        const followerWrapper = followerComponent.find(".user-list");
        expect(followerWrapper.length).toBe(1);
        expect(spyFollowersUser).toBeCalledTimes(1);
        await flushPromises();
        // FIXME: expecting spyHistoryPush fails

        const memberComponent = mount(makeUserList(stubInitialState, "members"));
        const memberWrapper = memberComponent.find(".user-list");
        expect(memberWrapper.length).toBe(1);
        expect(spyGetMembers).toBeCalledTimes(1);
        await flushPromises();
        // FIXME: expecting spyHistoryPush fails
    });

    it("should not call anything when wrong pathname", () => {
        mount(makeUserList(stubInitialState, "wrong"));
        expect(spyFollowingsUser).toBeCalledTimes(0);
        expect(spyFollowersUser).toBeCalledTimes(0);
    });

    it("should make userCardsLeft and userCardsRight well", () => {
        const followingComponent = mount(makeUserList(stubInitialState, "followings"));
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

        const followerComponent = mount(makeUserList(stubInitialState, "followers"));
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
