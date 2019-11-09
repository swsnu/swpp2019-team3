import React from "react";
import { shallow, mount } from "enzyme";
import CollectionCard from "./CollectionCard";

describe("<CollectionCard />", () => {
    afterEach(() => { jest.clearAllMocks(); });
    it("should render without errors", () => {
        const component = shallow(<CollectionCard />);
        const wrapper = component.find(".wrapper");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(<CollectionCard />);
        const wrapper = component.find("#like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(component.state().likeCount).toEqual(1);
        expect(component.state().isLiked).toBe(true);

        wrapper.simulate("click");
        expect(component.state().likeCount).toBe(0);
        expect(component.state().isLiked).toBe(false);
    });

    it("if headerExists is false, then header should not exist", () => {
        const component = mount(<CollectionCard headerExists={false} />);
        const wrapper = component.find(".header");
        expect(wrapper.length).toBe(0);
    });
});
