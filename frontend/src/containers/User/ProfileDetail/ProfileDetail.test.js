import React from "react";
import { mount } from "enzyme";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { createBrowserHistory } from "history";
import ProfileDetail from "./ProfileDetail";
import { userActions } from "../../../store/actions/index";
import { collectionStatus, reviewStatus } from "../../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";

const makeStubState = (myId, targetId, follow) => (
    {
        paper: {
        },
        auth: {
            signupStatus: null,
            signinStatus: null,
            signoutStatus: null,
            getMeStatus: null,
            me: {
                id: myId,
            },
        },
        collection: {
            list: {
                status: collectionStatus.NONE,
                list: [],
                error: null,
                finished: false,
                pageNum: 1,
            },
            like: {
                status: collectionStatus.NONE,
                count: 0,
                error: null,
            },
            unlike: {
                status: collectionStatus.NONE,
                count: 0,
                error: null,
            },
        },
        review: {
            list: {
                status: reviewStatus.NONE,
                list: [],
                error: null,
                finished: false,
                pageNum: 1,
            },
            like: {
                status: reviewStatus.NONE,
                count: 0,
                error: null,
            },
            unlike: {
                status: reviewStatus.NONE,
                count: 0,
                error: null,
            },
        },
        user: {
            userSearchResult: [],
            selectedUser: {
                id: targetId,
                doIFollow: follow,
            },
            selectedFollowers: [],
            selectedFollowings: [],
            status: null,
            error: null,
        },
        reply: {},
    }
);

const setMockStore = (stubState) => getMockStore(stubState);

/* eslint-disable react/jsx-props-no-spreading */
const setProfileDetail = (stubInit, props) => (
    <Provider store={setMockStore(stubInit)}>
        <ConnectedRouter history={createBrowserHistory()}>
            <Switch>
                <Route
                  path="/"
                  exact
                  render={() => (
                      <div>
                          <ProfileDetail location={{ pathname: "/profile_id=1" }} {...props} />
                      </div>
                  )}
                />
            </Switch>
        </ConnectedRouter>
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

describe("<ProfileDetail />", () => {
    it("should render without errors", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);

        const wrapper = component.find("#profileDetail");
        expect(wrapper.length).toBe(1);
    });

    it("should go to account setting by clicking settingButton", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        expect(component.find("Link").at(2).prop("to")).toBe("/account_setting");
    });

    it("should handle follow feature", () => {
        const spyFollow = jest.spyOn(userActions, "addUserFollowing")
            .mockImplementation(() => () => mockPromise);

        const stubInitState = makeStubState(2, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);

        const wrapper = component.find("#followButton").at(0);
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(spyFollow).toHaveBeenCalled();
    });

    it("should handle unfollow feature", () => {
        const spyUnFollow = jest.spyOn(userActions, "removeUserFollowing")
            .mockImplementation(() => () => mockPromise);

        const stubInitState = makeStubState(2, 1, true);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);

        const instance = component.find(ProfileDetail.WrappedComponent).instance();
        instance.setState({ doIFollow: true });
        component.update();

        const wrapper = component.find("#unfollowButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(spyUnFollow).toHaveBeenCalled();
    });

    it("click follower number and moves to follower list page", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        expect(component.find("Link").at(0).prop("to")).toBe("/profile_id=1/followers");
    });

    it("click following number and moves to follower list page", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        expect(component.find("Link").at(1).prop("to")).toBe("/profile_id=1/followings");
    });

    it("should make collection cards", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        const instance = component.find(ProfileDetail.WrappedComponent).instance();
        instance.setState({
            collections: [
                {
                    id: 1,
                    title: "dfad",
                    user: "Dfafdaf",
                    count: {
                        users: 0,
                        papers: 0,
                    },
                },
                {
                    id: 2,
                    title: "dfad",
                    user: "Dfafdaf",
                    count: {
                        users: 0,
                        papers: 0,
                    },
                },
            ],
        });
        component.update();

        const wrapperCollectionLeft = component.find("#collectionCardsLeft");
        const wrapperCollectionRight = component.find("#collectionCardsRight");
        expect(wrapperCollectionLeft.children().length).toBe(1);
        expect(wrapperCollectionRight.children().length).toBe(1);
    });

    it("should make review cards", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        const instance = component.find(ProfileDetail.WrappedComponent).instance();
        instance.setState({
            reviews: [
                {
                    id: 1,
                    paper: {
                        id: 1,
                    },
                    user: {
                        username: "review_author_1",
                    },
                    title: "review_title_1",
                    date: "2019-11-09",
                    count: {
                        likes: 0,
                        replies: 0,
                    },
                },
                {
                    id: 2,
                    paper: {
                        id: 2,
                    },
                    user: {
                        username: "review_author_2",
                    },
                    title: "review_title_2",
                    date: "2019-11-08",
                    count: {
                        likes: 0,
                        replies: 0,
                    },
                },
            ],
        });
        component.update();

        const wrapperReviewLeft = component.find("#reviewCardsLeft");
        const wrapperReviewRight = component.find("#reviewCardsRight");
        expect(wrapperReviewLeft.children().length).toBe(1);
        expect(wrapperReviewRight.children().length).toBe(1);
    });

    it("should handle view more button", async () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        await flushPromises();
        component.update();

        let wrapper = component.find(".review-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();

        wrapper = component.find(".collection-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();
    });

    it("should not handle view more button", async () => {
        const stubInitialState = (myId, targetId, follow) => (
            {
                paper: {
                },
                auth: {
                    signupStatus: null,
                    signinStatus: null,
                    signoutStatus: null,
                    getMeStatus: null,
                    me: {
                        id: myId,
                    },
                },
                collection: {
                    list: {
                        status: collectionStatus.NONE,
                        list: [],
                        error: null,
                        finished: true,
                        pageNum: 1,
                    },
                    like: {
                        status: collectionStatus.NONE,
                        count: 0,
                        error: null,
                    },
                    unlike: {
                        status: collectionStatus.NONE,
                        count: 0,
                        error: null,
                    },
                },
                review: {
                    list: {
                        status: reviewStatus.NONE,
                        list: [],
                        error: null,
                        finished: true,
                        pageNum: 1,
                    },
                    like: {
                        status: reviewStatus.NONE,
                        count: 0,
                        error: null,
                    },
                    unlike: {
                        status: reviewStatus.NONE,
                        count: 0,
                        error: null,
                    },
                },
                user: {
                    userSearchResult: [],
                    selectedUser: {
                        id: targetId,
                        doIFollow: follow,
                    },
                    selectedFollowers: [],
                    selectedFollowings: [],
                    status: null,
                    error: null,
                },
                reply: {},
            }
        );
        const stubInitState = stubInitialState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        await flushPromises();
        component.update();

        let wrapper = component.find(".review-more-button").hostNodes();
        expect(wrapper.length).toBe(0);
        wrapper = component.find(".collection-more-button").hostNodes();
        expect(wrapper.length).toBe(0);
    });
});
