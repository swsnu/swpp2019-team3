import React from "react";
import { mount } from "enzyme";
import IntroModal from "./IntroModal";


describe("<IntroModal />", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<IntroModal />);
        const wrapper = component.find(".intromodal");
        expect(wrapper.length).toBe(1);
    });

    it("should open signup-modal if signup-open-button is clicked", () => {
        const component = mount(<IntroModal />);
        const openButton = component.find(".signup-open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".signup-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");

        wrapper = component.find(".signup-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should open signin-modal if signin-open-button is clicked", () => {
        const component = mount(<IntroModal />);
        const openButton = component.find(".signin-open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".signin-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");

        wrapper = component.find(".signin-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should be closed and redirect if signupButton is clicked", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<IntroModal history={historyMock} />);
        const introModalInstance = component.find(IntroModal).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(true);

        const signupButton = component.find(".signup-button").hostNodes();
        expect(signupButton.length).toBe(1);
        signupButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(false);
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should be closed and redirect if signinButton is clicked", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<IntroModal history={historyMock} />);
        const introModalInstance = component.find(IntroModal).instance();

        const openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSigninOpen).toBe(true);

        const signinButton = component.find(".signin-button").hostNodes();
        expect(signinButton.length).toBe(1);
        signinButton.simulate("click");

        expect(introModalInstance.state.isSigninOpen).toBe(false);
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should be closed if cancelButton is clicked", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<IntroModal history={historyMock} />);
        const introModalInstance = component.find(IntroModal).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(true);

        const cancelButton = component.find(".cancel-button").hostNodes();
        expect(cancelButton.length).toBe(1);
        cancelButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(false);
    });

    it("should set state properly on signup inputs", () => {
        const component = mount(<IntroModal />);
        const introModalInstance = component.find(IntroModal).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(true);

        let wrapper = component.find(".id-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_id" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });
        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email" } });
        expect(introModalInstance.state.id).toBe("my_id");
        expect(introModalInstance.state.password).toBe("my_password");
        expect(introModalInstance.state.email).toBe("my_email");
    });

    it("should set state properly on signin inputs", () => {
        const component = mount(<IntroModal />);
        const introModalInstance = component.find(IntroModal).instance();

        const openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSigninOpen).toBe(true);

        let wrapper = component.find(".id-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_id" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });
        expect(introModalInstance.state.id).toBe("my_id");
        expect(introModalInstance.state.password).toBe("my_password");
    });
});
