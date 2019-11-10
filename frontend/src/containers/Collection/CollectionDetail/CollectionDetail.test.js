import React from "react";
import { shallow } from "enzyme";

import CollectionDetail from "./CollectionDetail";

describe("CollectionDetail Test", () => {
    it("should render without errors", () => {
        const component = shallow(<CollectionDetail />);
        let wrapper = component.find(".CollectionInfo");
        expect(wrapper.length).toBe(1);
        wrapper = component.find(".itemList");
        expect(wrapper.length).toBe(1);
    });

    it("Button should be changed", () => {
        const component = shallow(<CollectionDetail />);
        let wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find("#unlikeButton");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);
    });

    it("reply textbox test", () => {
        const component = shallow(<CollectionDetail />);
        const wrapper = component.find("#newReplyContentInput");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "Hello" } });
        expect(component.state().newReplyContent).toBe("Hello");
    });

    it("shows edit button only if I am the member", () => {
        const component = shallow(<CollectionDetail />);
        component.setProps({
            thisCollection: {
                papers: [], members: [], replies: [], amIMember: true,
            },
        });
        component.update();
        let wrapper = component.find("#editButtonLink");
        expect(wrapper.length).toBe(1);

        component.setProps({
            thisCollection: {
                papers: [], replies: [], members: [], amIMember: false,
            },
        });
        component.update();
        wrapper = component.find("#editButtonLink");
        expect(wrapper.length).toBe(0);
    });
});
