import React from "react";
import { shallow, mount } from "enzyme";
import Tutorial from "./Tutorial";

describe("<SideBar />", () => {
    let mockHistory;

    beforeEach(() => {
        mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/tutorial" } };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should render without erros", () => {
        const component = shallow(<Tutorial history={mockHistory} />);
        const wrapper = component.find(".tutorial");
        expect(wrapper.length).toBe(1);
    });

    it("should handle start from sign up", () => {
        mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/tutorial", state: { previous: "signup" } } };
        const component = mount(<Tutorial history={mockHistory} />);
        const instance = component.find("Tutorial").instance();
        const wrapper = component.find(".tutorial");
        expect(wrapper.length).toBe(1);

        instance.handleStart();

        expect(mockHistory.push).toBeCalledWith({ pathname: "/init", state: { previous: "signup" } });
    });

    it("should handle start from other", () => {
        mockHistory = { push: jest.fn(), goBack: jest.fn(), location: { pathname: "/tutorial" } };
        const component = mount(<Tutorial history={mockHistory} />);
        const instance = component.find("Tutorial").instance();
        const wrapper = component.find(".tutorial");
        expect(wrapper.length).toBe(1);

        instance.handleStart();

        expect(mockHistory.push).toBeCalledWith("/main");
    });
});
