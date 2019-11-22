import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import TransferOwnershipModal from "./TransferOwnershipModal";

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
};

const mockHistory = { replace: jest.fn() };
const makeTransferModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <TransferOwnershipModal
          collectionId={1}
          collectionName="asdf"
          history={mockHistory}
        />
    </Provider>
);

describe("TransferOwnershipModal test", () => {
    let transferModal;
    beforeEach(() => {
        transferModal = makeTransferModal(stubInitialState);
    });

    it("should render without errors", () => {
        const component = mount(transferModal);
        const wrapper = component.find(".TransferOwnership");
        expect(wrapper.length).toBe(1);
    });

    it("should set state to open/close modal", () => {
        const component = mount(transferModal);

        // open by pressing open button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        const instance = component.find("TransferOwnershipModal").instance();
        expect(instance.state.isModalOpen).toBe(true);

        // close by pressing cancel button
        wrapper = component.find("#cancelButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(instance.state.isModalOpen).toBe(false);
    });

    // it("clickWarningConfirmAction should be called in WarningModal", () => {
    //     TODO: Implement this test
    // })
});
