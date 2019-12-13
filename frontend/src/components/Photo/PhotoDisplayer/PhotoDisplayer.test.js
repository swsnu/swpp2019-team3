import React from "react";
import { mount } from "enzyme";
import PhotoDisplayer from "./PhotoDisplayer";

describe("PhotoDisplayer test", () => {
    it("should render without errors", () => {
        const component = mount(<PhotoDisplayer />);
        const wrapper = component.find("#userPhoto").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
