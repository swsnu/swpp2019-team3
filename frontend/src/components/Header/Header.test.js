/* eslint-disable no-undef */
import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";

describe("<Header />", () => {
    it("should render without errors", () => {
        const component = shallow(<Header />);
        const wrapper = component.find(".header");
        expect(wrapper.length).toBe(1);
    });

    it("should handle input change in searchbar", () => {
        const event = {
            target: {
                value: "ABC",
            },
        };
        const component = shallow(<Header />);
        const wrapper = component.find(".search-input");
        wrapper.simulate("change", event);
        expect(component.state().searchKeyword).toEqual("ABC");
    });
});
