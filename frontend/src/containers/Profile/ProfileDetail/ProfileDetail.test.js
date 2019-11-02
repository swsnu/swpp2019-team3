import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router-dom";

import ProfileDetail from "./ProfileDetail";

describe("ProfileDetail Test", () => {
    it("should render without errors", () => {
        const component = shallow(<ProfileDetail />);
        let wrapper = component.find(".ProfileDetail");
        expect(wrapper.length).toBe(1);
        wrapper = component.find("#Header");
        expect(wrapper.length).toBe(1);
        wrapper = component.find("#SideBar");
        expect(wrapper.length).toBe(1);
        wrapper = component.find("#collectionCards");
        expect(wrapper.length).toBe(1);
    });

    // it("click edit button and go to edit page", () => {
    //     const component = shallow(<ProfileDetail currentUserID={1} thisUser={{id:1}}/>);
    //     let wrapper = component.find("#editButton");
    //     expect(wrapper.length).toBe(1);
    //     wrapper.simulate("click");
    //     expect(wrapper.find(Link).props().to).toBe("/profile/1/edit");
    // });

    it("if it is not my profile page and I am not following this user, follow button should exist", () => {
        const mockThisUser = {
            id: 1,
            name: "Arthur",
            description: "I used to think my life was a tragedy...",
            followersNum: 12,
            followingsNum: 47,
            amIFollow: false,
        };
        const component = shallow(<ProfileDetail currentUserID={2} thisUser={mockThisUser} />);
        const wrapper = component.find("#followButton");
        expect(wrapper.length).toBe(1);
    });

    it("button should be differ for whether the user is the owner of the profile", () => {
        const component = shallow(<ProfileDetail />);
        component.setProps({ currentUserID: 1, thisUser: { id: 1 } });
        component.update();
        let wrapper = component.find("#editButton");
        expect(wrapper.length).toBe(1);
        component.setProps({ currentUserID: 2, thisUser: { id: 1 } });
        component.update();
        wrapper = component.find("#followButton");
        expect(wrapper.length).toBe(1);
        component.setProps({ currentUserID: 2, thisUser: { id: 1 } });
        component.setState({ amIFollow: true });
        component.update();
        wrapper = component.find("#unfollowButton");
        expect(wrapper.length).toBe(1);
    });

    it("follow / unfollow", () => {
        // ProfileDetail.prototype.setState = jest.fn();
        const component = shallow(<ProfileDetail />);
        component.setProps({ currentUserID: 1, thisUser: { id: 2 } });
        component.update();

        let wrapper = component.find("#followButton");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(wrapper.setState).toHaveBeenCalled();
        expect(wrapper.state("amIFollow")).toBe(true);
        wrapper = component.find("#unfollowButton");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(wrapper.setState).toHaveBeenCalled();
        expect(wrapper.state("amIFollow")).toBe(false);
        wrapper = component.find("#followButton");
        expect(wrapper.length).toBe(1);
    });

    // it("if collectionTabButton is clicked, should render the user's collections", () => {
    //     const component = shallow(<ProfileDetail />);
    //     let wrapper = component.find("#collectionTabButton");
    //     wrapper.simulate("click");
    //     wrapper = component.find("#collectionCards");
    //     expect(wrapper.length).toBe(1);
    // });

    // it("if reviewTabButton is clicked, should render the user's reviews", () => {
    //     const component = shallow(<ProfileDetail />);
    //     const wrapper = component.find("#reviewTabButton");
    //     wrapper.simulate("click");
    //     const wrapper2 = component.find("#reviewCards");
    //     expect(wrapper2.length).toBe(1);
    // });

    it("click follower number and moves to follower list page", () => {
        const component = shallow(<ProfileDetail />);
        component.setProps({ thisUser: { id: 1 } });
        component.update();
        const wrapper = component.find("#followerStat");
        wrapper.simulate("click");
        expect(wrapper.find(Link).props().to).toBe("/profile/1/followers");
    });

    it("click following number and moves to follower list page", () => {
        const component = shallow(<ProfileDetail />);
        component.setProps({ thisUser: { id: 1 } });
        component.update();
        const wrapper = component.find("#followingStat");
        wrapper.simulate("click");
        expect(wrapper.find(Link).props().to).toBe("/profile/1/followings");
    });
});
