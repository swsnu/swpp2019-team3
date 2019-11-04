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
        wrapper = component.find(".itemTabSection");
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
        component.setState({ doIFollow: true });
        component.update();
        wrapper = component.find("#unfollowButton");
        expect(wrapper.length).toBe(1);
    });

    it("follow / unfollow", () => {
        const component = shallow(<ProfileDetail />);
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
    });

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
