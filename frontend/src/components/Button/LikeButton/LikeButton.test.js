import React from "react";
import { mount } from "enzyme";
import LikeButton from "./LikeButton";

describe("LikeButton Test", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<LikeButton />);
        const wrapper = component.find(".LikeButton").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should render fill heart if isLiked", () => {
        const component = mount(<LikeButton isLiked />);
        const wrapper = component.find("#heartFillSVG");
        expect(wrapper.length).toBe(1);
    });

    it("should render blank heart if not isLiked", () => {
        const component = mount(<LikeButton isLiked={false} />);
        const wrapper = component.find("#heartBlankSVG");
        expect(wrapper.length).toBe(1);
    });
});
