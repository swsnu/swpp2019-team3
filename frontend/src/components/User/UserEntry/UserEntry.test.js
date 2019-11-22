import React from "react";
import { mount } from "enzyme";
import UserEntry from "./UserEntry";

describe("UserEntry Test", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<UserEntry checkhandler={jest.fn()} />);
        const wrapper = component.find(".UserEntry").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
