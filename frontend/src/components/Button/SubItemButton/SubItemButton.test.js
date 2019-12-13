import React from "react";
import { mount } from "enzyme";
import SubItemButton from "./SubItemButton";

describe("SubItemButton Test", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<SubItemButton />);
        const wrapper = component.find(".SubItemButton").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
