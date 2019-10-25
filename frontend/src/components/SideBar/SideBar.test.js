import React from "react";
import { shallow } from "enzyme";
import SideBar from "./SideBar";

describe("<SideBar />", () => {
    it("should render without erros", () => {
        const component = shallow(<SideBar />);
        const wrapper = component.find(".sidebar");
        expect(wrapper.length).toBe(1);
    });
});
