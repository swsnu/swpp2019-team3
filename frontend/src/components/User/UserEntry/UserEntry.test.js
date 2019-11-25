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

    it("props.showCheck test", () => {
        const component = mount(<UserEntry checkhandler={jest.fn()} showCheck />);
        let wrapper = component.find(".entryItem").hostNodes();
        expect(wrapper.length).toBe(1);

        component.setProps({ showCheck: false });
        component.update();
        wrapper = component.find(".entryItem").hostNodes();
        expect(wrapper.length).toBe(0);
    });
});
