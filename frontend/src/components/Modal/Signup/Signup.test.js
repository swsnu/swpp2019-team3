import React from "react";
import { mount } from "enzyme";
import Signup from "./Signup";


describe("<Signup />", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<Signup />);
        const wrapper = component.find(".signup");
        expect(wrapper.length).toBe(1);
    });

    it("should be open if openButton is clicked", () => {
        const component = mount(<Signup />);
        const openButton = component.find(".open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".signup-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");

        wrapper = component.find(".signup-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should be closed if signupButton is clicked", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<Signup history={historyMock} />);
        const signupInstance = component.find(Signup).instance();

        const openButton = component.find(".open-button").hostNodes();
        openButton.simulate("click");

        expect(signupInstance.state.isOpen).toBe(true);

        const signupButton = component.find(".signup-button").hostNodes();
        expect(signupButton.length).toBe(1);
        signupButton.simulate("click");

        expect(signupInstance.state.isOpen).toBe(false);
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should set state properly on inputs", () => {
        const component = mount(<Signup />);
        const signupInstance = component.find(Signup).instance();

        const openButton = component.find(".open-button").hostNodes();
        openButton.simulate("click");

        expect(signupInstance.state.isOpen).toBe(true);

        let wrapper = component.find(".id-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_id" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });
        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email" } });
        expect(signupInstance.state.id).toBe("my_id");
        expect(signupInstance.state.password).toBe("my_password");
        expect(signupInstance.state.email).toBe("my_email");
    });
});
