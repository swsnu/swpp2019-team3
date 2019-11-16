import React from "react";
import { mount } from "enzyme";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import ProfileDetail from "./ProfileDetail";
import { userActions } from "../../../store/actions/index";
import { collectionStatus, reviewStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";

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
            make: {
                status: collectionStatus.NONE,
                collection: {},
                error: null,
            },
            list: {
                status: collectionStatus.NONE,
                list: [],
                error: null,
            },
            edit: {
                status: collectionStatus.NONE,
                collection: {},
                error: null,
            },
            delete: {
                status: collectionStatus.NONE,
                collection: {},
                error: null,
            },
            selected: {
                status: collectionStatus.NONE,
                error: null,
                collection: {},
                papers: [],
                members: [],
                replies: [],
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
    }
);

const setMockStore = (stubState) => getMockStore(stubState);
// const mockHistory = { push: jest.fn() };

const setProfileDetail = (stubInit) => (
    <Provider store={setMockStore(stubInit)}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route
                  path="/"
                  exact
                  render={() => (
                      <div>
                          <ProfileDetail location={{ pathname: "/profile_id=1" }} />
                      </div>
                  )}
                />
            </Switch>
        </ConnectedRouter>
    </Provider>
);

describe("<ProfileDetail />", () => {
    it("should render without errors", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);

        const wrapper = component.find(".ProfileDetailContent");
        expect(wrapper.length).toBe(1);
    });

    it("should go to account setting by clicking settingButton", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);
        expect(component.find("Link").at(2).prop("to")).toBe("/account_setting");
    });

    it("should handle follow feature", () => {
        /* eslint-disable no-unused-vars */
        const mockPromise = new Promise((resolve, reject) => { resolve(); });
        /* eslint-enable no-unused-vars */
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
        /* eslint-disable no-unused-vars */
        const mockPromise = new Promise((resolve, reject) => { resolve(); });
        /* eslint-enable no-unused-vars */
        const spyUnFollow = jest.spyOn(userActions, "removeUserFollowing")
            .mockImplementation(() => () => mockPromise);

        const stubInitState = makeStubState(2, 1, true);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);

        const wrapper = component.find("#unfollowButton").at(0);
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

    it("should make card", () => {
        const stubInitState = makeStubState(1, 1, false);
        const profileDetail = setProfileDetail(stubInitState);
        const component = mount(profileDetail);

        component.setProps({
            thisUserCollections: [{
                type: "Collection",
                source: "liked",
                id: 1,
                title: "dfad",
                user: "Dfafdaf",
                numPapers: 14,
                numReplies: 15,
            }, {
                type: "Collection",
                source: "liked",
                id: 1,
                title: "dfad",
                user: "Dfafdaf",
                numPapers: 14,
                numReplies: 15,
            }],
            thisUserReviews: [{
                type: "Review",
                source: "liked",
                id: 3,
                title: "dfad",
                user: "Dfafdaf",
                numPapers: 14,
                numReplies: 15,
            }, {
                type: "Review",
                source: "liked",
                id: 3,
                title: "dfad",
                user: "Dfafdaf",
                numPapers: 14,
                numReplies: 15,
            }],
        });
        // const instance = component.find("ProfileDetail").instance();
        // expect()

        // const spyCardMaker =

        const wrapperCollectionLeft = component.find("#collectionCardsLeft");
        const wrapperCollectionRight = component.find("#collectionCardsRight");
        const wrapperReviewLeft = component.find("#reviewCardsLeft");
        const wrapperReviewRight = component.find("#reviewCardsRight");
        expect(wrapperCollectionLeft.length).toBe(1);
        expect(wrapperCollectionRight.length).toBe(1);
        expect(wrapperReviewLeft.length).toBe(1);
        expect(wrapperReviewRight.length).toBe(1);
    });
});
