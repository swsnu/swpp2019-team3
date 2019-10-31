import React from "react";
import { mount } from "enzyme";
import PaperSpec from "./PaperSpec";

describe("<PaperSpec />", () => {
    it("should render without errors", () => {
        const component = mount(<PaperSpec />);
        const wrapper = component.find(".paperspec");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(<PaperSpec />);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(component.state().likeCount).toEqual(1);
        expect(component.state().isLiked).toBe(true);

        wrapper.simulate("click");
        expect(component.state().likeCount).toBe(0);
        expect(component.state().isLiked).toBe(false);
    });
});
