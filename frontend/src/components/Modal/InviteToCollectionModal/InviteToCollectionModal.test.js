import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import { userActions } from "../../../store/actions";
import InviteToCollectionModal from "./InviteToCollectionModal";
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

const makeInviteToCollectionModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <InviteToCollectionModal />
    </Provider>
);

/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("InviteToCollectionModal test", () => {
    let inviteToCollectionModal;

    beforeEach(() => {
        inviteToCollectionModal = makeInviteToCollectionModal(stubInitialState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const spyGetFollowings = jest.spyOn(userActions, "getFollowingsByUserId")
            .mockImplementation(() => () => mockPromise);

        const component = mount(inviteToCollectionModal);
        const wrapper = component.find(".InviteToCollectionModal");
        expect(wrapper.length).toBe(1);

        // FIXME : it should be '1'
        expect(spyGetFollowings).toHaveBeenCalledTimes(0);
    });

    it("should set state to open/close modal", () => {
        const component = mount(inviteToCollectionModal);

        // open by pressing open button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        const instance = component.find("InviteToCollectionModal").instance();
        expect(instance.state.isModalOpen).toBe(true);

        // close by pressing cancel button
        wrapper = component.find("#cancelButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(instance.state.isModalOpen).toBe(false);
    });

    // it("should show a list of members", () => {

    // })

    it("should handle search", () => {
        const spySearch = jest.spyOn(userActions, "searchUser")
            .mockImplementation(() => () => mockPromise);

        const component = mount(inviteToCollectionModal);
        let wrapper = component.find("#modalOpenButton").hostNodes();
        wrapper.simulate("click");
        wrapper = component.find("#userSearchBar").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "qwer" } });
        const instance = component.find(InviteToCollectionModal.WrappedComponent).instance();
        expect(instance.state.searchKeyWord).toBe("qwer");
        wrapper = component.find("#searchButton").hostNodes();
        wrapper.simulate("click");

        expect(spySearch).toHaveBeenCalledTimes(1);
    });
});
