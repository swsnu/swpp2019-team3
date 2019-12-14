import React from "react";
import { mount } from "enzyme";
import PhotoCheckBox from "./PhotoCheckBox";

describe("PhotoCheckBox Test", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<PhotoCheckBox checkhandler={jest.fn()} />);
        const wrapper = component.find(".PhotoCheckBox").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
