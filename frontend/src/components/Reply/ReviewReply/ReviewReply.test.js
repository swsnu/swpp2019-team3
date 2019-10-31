import React from "react";
import { shallow, mount } from "enzyme";
import ReviewReply from "./ReviewReply";

describe("<ReviewReply />", () => {
    it("should render without errors", () => {
        const component = shallow(<ReviewReply />);
        const wrapper = component.find(".review-reply-component");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(<ReviewReply isLiked={false} likesCount={0} />);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(component.state().likesCount).toEqual(1);
        expect(component.state().isLiked).toBe(true);

        wrapper.simulate("click");
        expect(component.state().numLikes).toBe(0);
        expect(component.state().isLiked).toBe(false);
    });
});
