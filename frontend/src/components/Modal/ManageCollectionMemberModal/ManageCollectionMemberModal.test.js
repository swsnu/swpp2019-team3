import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import ManageCollectionMemberModal from "./ManageCollectionMemberModal";
import { collectionStatus, signinStatus } from "../../../constants/constants";

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

const makeManageCollectionMemberModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <ManageCollectionMemberModal />
    </Provider>
);

describe("InviteToCollectionModal test", () => {
    let manageCollectionMemberModal;

    beforeEach(() => {
        manageCollectionMemberModal = makeManageCollectionMemberModal(stubInitialState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(manageCollectionMemberModal);
        const wrapper = component.find(".ManageCollectionMemberModal");
        expect(wrapper.length).toBe(1);
    });

    it("should set state to open/close modal", () => {
        const component = mount(manageCollectionMemberModal);

        // open by pressing open button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        const instance = component.find("ManageCollectionMemberModal").instance();
        expect(instance.state.isModalOpen).toBe(true);

        // close by pressing cancel button
        wrapper = component.find("#closeButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(instance.state.isModalOpen).toBe(false);
    });
});
