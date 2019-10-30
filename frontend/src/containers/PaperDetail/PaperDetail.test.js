import React from "react";
import { mount } from "enzyme";
import PaperDetail from "./PaperDetail";

describe("<Main />", () => {
    it("should render without errors", () => {
        const component = mount(<PaperDetail />);
        const wrapper = component.find(".paperdetail-page");
        expect(wrapper.length).toBe(1);
    });
});
