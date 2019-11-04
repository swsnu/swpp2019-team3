import React from "react";
import { mount } from "enzyme";
import Intro from "./Intro";

describe("<Intro />", () => {
    it("should render without errors", () => {
        const component = mount(<Intro />);
        const wrapper = component.find(".intro-page");
        expect(wrapper.length).toBe(1);
    });
});
