import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import IntroModal from "./IntroModal";
import { authActions } from "../../../store/actions";
import { signupStatus, signinStatus } from "../../../store/reducers/auth";
import { getMockStore } from "../../../test-utils/mocks";

let stubInitialState = {
    collection: {},
    auth: {
        signupStatus: signupStatus.NONE,
        signinStatus: signinStatus.NONE,
    },
    paper: {},
};
const mockHistory = { push: jest.fn() };
const makeIntroModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <IntroModal history={mockHistory} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<IntroModal />", () => {
    let introModal;
    let spySignup;
    let spySignin;

    beforeEach(() => {
        introModal = makeIntroModal(stubInitialState);
        spySignup = jest.spyOn(authActions, "signup")
            .mockImplementation(() => () => mockPromise);
        spySignin = jest.spyOn(authActions, "signin")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(introModal);
        const wrapper = component.find(".intromodal");
        expect(wrapper.length).toBe(1);
    });


    it("should open signup-modal if signup-open-button is clicked", () => {
        const component = mount(introModal);
        const openButton = component.find(".signup-open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".signup-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");

        wrapper = component.find(".signup-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });


    it("should open signin-modal if signin-open-button is clicked", () => {
        const component = mount(introModal);
        const openButton = component.find(".signin-open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".signin-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");

        wrapper = component.find(".signin-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });


    it("should be closed and redirect if signupButton is clicked", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(true);

        let wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".username-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_username" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        const signupButton = component.find(".signup-button").hostNodes();
        expect(signupButton.length).toBe(1);
        signupButton.simulate("click");

        expect(spySignup).toBeCalledTimes(1);
    });


    it("should be closed and redirect if signinButton is clicked", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSigninOpen).toBe(true);

        let wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        const signinButton = component.find(".signin-button").hostNodes();
        expect(signinButton.length).toBe(1);
        signinButton.simulate("click");

        expect(spySignin).toBeCalledTimes(1);
    });


    it("should be closed if cancelButton is clicked", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(true);

        const cancelButton = component.find(".cancel-button").hostNodes();
        expect(cancelButton.length).toBe(1);
        cancelButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(false);
    });


    it("should set state properly on signup inputs", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSignupOpen).toBe(true);

        let wrapper = component.find(".username-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_username" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });
        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        expect(introModalInstance.state.username).toBe("my_username");
        expect(introModalInstance.state.password).toBe("my_password");
        expect(introModalInstance.state.email).toBe("my_email@papersfeed.com");
    });


    it("should set state properly on signin inputs", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        expect(introModalInstance.state.isSigninOpen).toBe(true);

        let wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });
        expect(introModalInstance.state.email).toBe("my_email@papersfeed.com");
        expect(introModalInstance.state.password).toBe("my_password");
    });

    it("should signupMessage reflect its state", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        introModalInstance.setState({ signupStatus: signupStatus.DUPLICATE_EMAIL });
        const wrapper = component.find("#signup-message");
        expect(wrapper.text()).toEqual("This email already exists");

        introModalInstance.setState({ signupStatus: signupStatus.DUPLICATE_USERNAME });
        expect(wrapper.text()).toEqual("This username already exists");
    });


    it("should signinMessage reflect its state", () => {
        const component = mount(introModal);
        const introModalInstance = component.find(IntroModal.WrappedComponent).instance();

        const openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        introModalInstance.setState({ signinStatus: signinStatus.USER_NOT_EXIST });
        const wrapper = component.find("#signin-message");
        expect(wrapper.text()).toEqual("This user does not exist");

        introModalInstance.setState({ signinStatus: signinStatus.WRONG_PW });
        expect(wrapper.text()).toEqual("Wrong password");
    });


    it("should handle each result of signing up", () => {
        stubInitialState = {
            auth: {
                signupStatus: signupStatus.WAITING,
                signinStatus: signinStatus.NONE,
            },
            collection: {},
            paper: {},
        };
        let component = mount(makeIntroModal(stubInitialState));
        let openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        let wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".username-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_username" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        let signupButton = component.find(".signup-button").hostNodes();
        signupButton.simulate("click");

        let introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signupStatus).toBe(signupStatus.NONE);


        stubInitialState = {
            auth: {
                signupStatus: signupStatus.SUCCESS,
                signinStatus: signinStatus.NONE,
            },
            collection: {},
            paper: {},
        };
        component = mount(makeIntroModal(stubInitialState));
        openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".username-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_username" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        signupButton = component.find(".signup-button").hostNodes();
        signupButton.simulate("click");

        introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signupStatus).toBe(signupStatus.NONE);


        stubInitialState = {
            auth: {
                signupStatus: signupStatus.DUPLICATE_EMAIL,
                signinStatus: signinStatus.NONE,
            },
            collection: {},
            paper: {},
        };
        component = mount(makeIntroModal(stubInitialState));
        openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".username-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_username" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        signupButton = component.find(".signup-button").hostNodes();
        signupButton.simulate("click");

        introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signupStatus).toBe(signupStatus.NONE);
        // FIXME: actually, it should be 'DUPLICATE_EMAIL'!


        stubInitialState = {
            auth: {
                signupStatus: signupStatus.DUPLICATE_USERNAME,
                signinStatus: signinStatus.NONE,
            },
            collection: {},
            paper: {},
        };
        component = mount(makeIntroModal(stubInitialState));
        openButton = component.find(".signup-open-button").hostNodes();
        openButton.simulate("click");

        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".username-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_username" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        signupButton = component.find(".signup-button").hostNodes();
        signupButton.simulate("click");

        introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signupStatus).toBe(signupStatus.NONE);
        // FIXME: actually, it should be 'DUPLICATE_USERNAME'!
    });


    it("should handle each result of signing in", () => {
        stubInitialState = {
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.WAITING,
            },
            collection: {},
            paper: {},
        };
        let component = mount(makeIntroModal(stubInitialState));
        let openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        let wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        let signinButton = component.find(".signin-button").hostNodes();
        signinButton.simulate("click");

        let introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signinStatus).toBe(signinStatus.NONE);


        stubInitialState = {
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.SUCCESS,
            },
            collection: {},
            paper: {},
        };
        component = mount(makeIntroModal(stubInitialState));
        openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        signinButton = component.find(".signin-button").hostNodes();
        signinButton.simulate("click");

        introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signinStatus).toBe(signinStatus.NONE);


        stubInitialState = {
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.USER_NOT_EXIST,
            },
            collection: {},
            paper: {},
        };
        component = mount(makeIntroModal(stubInitialState));

        openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        signinButton = component.find(".signin-button").hostNodes();
        signinButton.simulate("click");

        introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signinStatus).toBe(signinStatus.NONE);
        // FIXME: actually, it should be 'USER_NOT_EXIST'!


        stubInitialState = {
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.WRONG_PW,
            },
            collection: {},
            paper: {},
        };
        component = mount(makeIntroModal(stubInitialState));

        openButton = component.find(".signin-open-button").hostNodes();
        openButton.simulate("click");

        wrapper = component.find(".email-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_email@papersfeed.com" } });
        wrapper = component.find(".password-input").hostNodes();
        wrapper.simulate("change", { target: { value: "my_password" } });

        signinButton = component.find(".signin-button").hostNodes();
        signinButton.simulate("click");

        introModalInstance = component.find(IntroModal.WrappedComponent).instance();
        expect(introModalInstance.state.signinStatus).toBe(signinStatus.NONE);
        // FIXME: actually, it should be 'WRONG_PW'!
    });
});
