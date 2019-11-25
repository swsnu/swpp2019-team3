import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import { collectionActions, userActions } from "../../../store/actions";
import InviteToCollectionModal from "./InviteToCollectionModal";
import { collectionStatus, signinStatus } from "../../../constants/constants";

const stubInitialState = {
    paper: {
    },
    auth: {
        signinStatus: signinStatus.SUCCESS,
        me: { id: 4 },
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
            memberCount: 0,
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
        const component = mount(inviteToCollectionModal);
        const wrapper = component.find(".InviteToCollectionModal");
        expect(wrapper.length).toBe(1);
    });

    it("should set state to open/close modal", () => {
        const spyGetFollowings = jest.spyOn(userActions, "getFollowingsByUserId")
            .mockImplementation(() => () => mockPromise);

        const component = mount(inviteToCollectionModal);

        // open and call getFollowingsByUserId by pressing open button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        const instance = component.find(InviteToCollectionModal.WrappedComponent).instance();
        expect(spyGetFollowings).toHaveBeenCalledTimes(1);
        expect(instance.state.isModalOpen).toBe(false); // FIXME: async problems

        instance.setState({ isModalOpen: true });
        component.update();

        // close by pressing cancel button
        wrapper = component.find("#cancelButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(instance.state.isModalOpen).toBe(false);
    });

    it("should show a list of members", () => {
        const component = mount(inviteToCollectionModal);
        const instance = component.find(InviteToCollectionModal.WrappedComponent).instance();
        instance.setState({
            isModalOpen: true,
            users: [
                {
                    id: 1,
                    username: "test1",
                    description: "asdf",
                },
                {
                    id: 2,
                    username: "test2",
                    description: "qwer",
                },
                {
                    id: 3,
                    username: "test3",
                    description: "zxcv",
                },
            ],
        });
        component.update();

        const wrapper = component.find(".UserEntry").hostNodes();
        expect(wrapper.length).toBe(3);
    });

    it("should call addNewMembers when inviting", () => {
        const spyAddNewMemers = jest.spyOn(collectionActions, "addNewMembers")
            .mockImplementation(() => () => mockPromise);

        const component = mount(inviteToCollectionModal);
        const instance = component.find(InviteToCollectionModal.WrappedComponent).instance();
        instance.setState({
            isModalOpen: true,
            users: [
                {
                    id: 1,
                    username: "test1",
                    description: "asdf",
                },
                {
                    id: 2,
                    username: "test2",
                    description: "qwer",
                },
                {
                    id: 3,
                    username: "test3",
                    description: "zxcv",
                },
            ],
            checkedUserIdList: [1],
        });
        component.update();

        const wrapper = component.find("#inviteButton").hostNodes();
        wrapper.simulate("click");
        expect(spyAddNewMemers).toHaveBeenCalledTimes(1);
    });

    it("should handle search", () => {
        const spySearch = jest.spyOn(userActions, "searchUser")
            .mockImplementation(() => () => mockPromise);

        const component = mount(inviteToCollectionModal);

        const instance = component.find(InviteToCollectionModal.WrappedComponent).instance();
        instance.setState({ isModalOpen: true });
        component.update();

        let wrapper = component.find("#userSearchBar").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "qwer" } });

        expect(instance.state.searchKeyWord).toBe("qwer");
        wrapper = component.find("#searchButton").hostNodes();
        wrapper.simulate("click");

        expect(spySearch).toHaveBeenCalledTimes(1);
    });
});
