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

    it("should window open is called when url button is clicked", () => {
        const spyOpen = jest.spyOn(window, "open")
            .mockImplementation(jest.fn());

        const component = mount(<PaperSpec />);
        const wrapper = component.find(".url-button").hostNodes();
        wrapper.simulate("click");

        expect(spyOpen).toHaveBeenCalledTimes(1);
    });

    it("if keywords are given, join them and set keywords appropriately", () => {
        const component = mount(<PaperSpec keywords={[
            { name: "A", type: "author" },
            { name: "B", type: "abstract" },
            { name: "C", type: "author" }]}
        />);
        const wrapper = component.find("#author-keywords-content");
        expect(wrapper.text()).toEqual("A, C");
    });
});
