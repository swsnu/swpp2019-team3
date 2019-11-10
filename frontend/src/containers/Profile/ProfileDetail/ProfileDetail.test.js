import React from "react";
import { mount } from "enzyme";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import ProfileDetail from "./ProfileDetail";
// import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";


const stubInitialState = {
    paper: {
    },
    auth: {},
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
    },
};

const mockStore = getMockStore(stubInitialState);

describe("<ProfileDetail />", () => {
    let profileDetail;

    beforeEach(() => {
        profileDetail = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                          path="/"
                          exact
                          render={() => (
                              <div>
                                  <ProfileDetail />
                              </div>
                          )}
                        />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    });
    it("should render without errors", () => {
        const component = mount(profileDetail);
        const wrapper = component.find("ProfileDetail");
        expect(wrapper.length).toBe(1);
        const section = wrapper.find(".itemTabSection");
        expect(section.length).toBe(1);
    });

    it("button should be differ for whether the user is the owner of the profile", () => {
        const component = mount(profileDetail);
        const wrapper = component.find("ProfileDetail");
        component.setProps({ currentUserID: 1, thisUser: { id: 1 } });
        component.update();
        let button = component.find("#editButton").hostNodes();
        expect(button.length).toBe(1);
        component.setProps({ currentUserID: 2, thisUser: { id: 1 } });
        component.update();
        // wrapper = component.find("#followButton").hostNodes();
        // expect(wrapper.length).toBe(1);
        component.setProps({ currentUserID: 2, thisUser: { id: 1 } });
        component.update();
        wrapper.setState({ doIFollow: true });

        button = component.find("#unfollowButton").hostNodes();
        // expect(button.length).toBe(1);
    });

    /* it("follow / unfollow", () => {
        const component = mount(profileDetail);
        component.setProps({ currentUserID: 1, thisUser: { id: 2 } });
        component.update();

        let wrapper = component.find("#followButton");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        wrapper = component.find("#unfollowButton");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        wrapper = component.find("#followButton");
        expect(wrapper.length).toBe(1);
    }); */

    /* it("click follower number and moves to follower list page", () => {
        const component = mount(profileDetail);
        component.setProps({ thisUser: { id: 1 } });
        component.update();
        const wrapper = component.find("#followerStat").hostNodes();
        wrapper.simulate("click");
        expect(wrapper.find("#followerStat").props().to).toBe("/profile/1/followers");
    });

    it("click following number and moves to follower list page", () => {
        const component = mount(profileDetail);
        component.setProps({ thisUser: { id: 1 } });
        component.update();
        const wrapper = component.find("#followingStat").hostNodes();
        wrapper.simulate("click");
        expect(wrapper.find("#followingStat").props().to).toBe("/profile/1/followings");
    }); */

    it("should make card", () => {
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
