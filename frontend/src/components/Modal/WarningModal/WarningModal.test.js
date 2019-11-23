import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import WarningModal from "./WarningModal";

const stubInitialState = {
    paper: {
    },
    auth: {
        signinStatus: signinStatus.SUCCESS,
        me: { id: 1 },
    },
    collection: {
        make: {
            status: collectionStatus.NONE,
            collection: {},
            error: null,
        },
        list: {
            status: collectionStatus.NONE,
            list: [],
            error: null,
        },
        edit: {
            status: collectionStatus.NONE,
            collection: {},
            error: null,
        },
        delete: {
            status: collectionStatus.NONE,
            collection: {},
            error: null,
        },
        selected: {
            status: collectionStatus.NONE,
            error: null,
            collection: {},
            papers: [],
            members: [],
            replies: [],
        },
    },
    user: {},
    review: {},
    reply: {},
};


const mockHistory = { replace: jest.fn() };
const mockActionWillBeDone = jest.fn();
const makeWarningModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <WarningModal
          openButtonText="test"
          whatToWarnText="warn text test"
          whatActionWillBeDone={mockActionWillBeDone}
          whereToGoAfterConfirm="/main"
          history={mockHistory}
        />
    </Provider>
);

describe("WarningModal test", () => {
    let createWarningModal;
    beforeEach(() => {
        createWarningModal = makeWarningModal(stubInitialState);
    });

    it("should render without errors", () => {
        const component = mount(createWarningModal);
        const wrapper = component.find(".WarningModal");
        expect(wrapper.length).toBe(1);
    });

    it("should set state to open/close modal", () => {
        const component = mount(createWarningModal);

        // open by pressing open button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        const instance = component.find("WarningModal").instance();
        expect(instance.state.isModalOpen).toBe(true);

        // close by pressing cancel button
        wrapper = component.find("#cancelButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(instance.state.isModalOpen).toBe(false);
    });

    it("should do action and redirect to target location when confirm button is pressed", () => {
        const component = mount(createWarningModal);

        // open modal and click confirm button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        wrapper.simulate("click");
        wrapper = component.find("#confirmButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        // what should be done
        const instance = component.find("WarningModal").instance();
        expect(mockActionWillBeDone).toHaveBeenCalledTimes(1);
        expect(mockHistory.replace).toHaveBeenCalledTimes(1);
        expect(instance.state.isModalOpen).toBe(false);
    });
});
