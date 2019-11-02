import React from "react";
import { mount } from "enzyme";
import Signin from "./Signin";


describe("<Signin />", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<Signin />);
        const wrapper = component.find(".signin");
        expect(wrapper.length).toBe(1);
    });

    it("should be open if openButton is clicked", () => {
        const component = mount(<Signin />);
        const openButton = component.find(".open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".signin-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");

        wrapper = component.find(".signin-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should be closed and redirect if signinButton is clicked", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<Signin history={historyMock} />);
        const signinInstance = component.find(Signin).instance();

        const openButton = component.find(".open-button").hostNodes();
        openButton.simulate("click");

        expect(signinInstance.state.isOpen).toBe(true);

        const signinButton = component.find(".signin-button").hostNodes();
        expect(signinButton.length).toBe(1);
        signinButton.simulate("click");

        expect(signinInstance.state.isOpen).toBe(false);
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should be closed if cancelButton is clicked", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<Signin history={historyMock} />);
        const signinInstance = component.find(Signin).instance();

        const openButton = component.find(".open-button").hostNodes();
        openButton.simulate("click");

        expect(signinInstance.state.isOpen).toBe(true);

        const signinButton = component.find(".cancel-button").hostNodes();
        expect(signinButton.length).toBe(1);
        signinButton.simulate("click");

        expect(signinInstance.state.isOpen).toBe(false);
    });

    it("should set state properly on inputs", () => {
        const component = mount(<Signin />);
        const signinInstance = component.find(Signin).instance();

        const openButton = component.find(".open-button").hostNodes();
        openButton.simulate("click");

        expect(signinInstance.state.isOpen).toBe(true);

        let wrapper = component.find(".id-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_id" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });
        expect(signinInstance.state.id).toBe("my_id");
        expect(signinInstance.state.password).toBe("my_password");
    });
});
