import React from "react";
import { shallow } from "enzyme";
import SideBar from "./SideBar";

const mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/main" } };
describe("<SideBar />", () => {
    it("should render without erros", () => {
        const component = shallow(<SideBar history={mockHistory} />);
        const wrapper = component.find(".sidebar");
        expect(wrapper.length).toBe(1);
    });
});
