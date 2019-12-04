import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";
import { collectionActions, userActions } from "../../../store/actions";
import InviteToCollectionModal from "./InviteToCollectionModal";
import { collectionStatus, signinStatus } from "../../../constants/constants";

const makeInviteToCollectionModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <InviteToCollectionModal />
    </Provider>
);

jest.mock("../../User/UserEntry/UserEntry", () => jest.fn((props) => (
    <input
      className="entryItem"
      id="check"
      type="checkbox"
      checked={props.isChecked}
      onChange={props.checkhandler}
    />
)));

describe("InviteToCollectionModal test", () => {
    let stubInitialState;
    let inviteToCollectionModal;
    let spyGetFollowings;
    let spyAddNewMemers;
    let spySearch;

    beforeEach(() => {
        stubInitialState = {
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
                    memberCount: 0,
                    replies: [],
                },
                getMembers: {
                    status: collectionStatus.NONE,
                    members: [],
                    pageNum: 0,
                    finished: true,
                    error: null,
                },
            },
            user: {
                getFollowers: {},
                getFollowings: {
                    followings: [
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
                },
                search: {},
            },
            review: {},
            reply: {},
        };

        inviteToCollectionModal = makeInviteToCollectionModal(stubInitialState);
        spyGetFollowings = jest.spyOn(userActions, "getFollowingsNotInCollection")
            .mockImplementation(() => () => mockPromise);
        spyAddNewMemers = jest.spyOn(collectionActions, "addNewMembers")
            .mockImplementation(() => () => mockPromise);
        spySearch = jest.spyOn(userActions, "searchUserNotInCollection")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(inviteToCollectionModal);
        const wrapper = component.find(".InviteToCollectionModal");
        expect(wrapper.length).toBe(1);
    });

    it("should set state to open/close modal", async () => {
        const component = mount(inviteToCollectionModal);

        // open and call getFollowingsByUserId by pressing open button
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(spyGetFollowings).toHaveBeenCalledTimes(1);

        await flushPromises();

        const instance = component.find(InviteToCollectionModal.WrappedComponent).instance();
        expect(instance.state.isModalOpen).toBe(true);
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

        const wrapper = component.find(".entryItem");
        expect(wrapper.length).toBe(3);
    });

    it("should call addNewMembers when inviting", () => {
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

        let wrapper = component.find("#check").at(0); // test1
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { checked: true } });
        expect(instance.state.checkedUserIdList).toEqual([1]);

        wrapper = component.find("#inviteButton").hostNodes();
        wrapper.simulate("click");
        expect(spyAddNewMemers).toHaveBeenCalledTimes(1);
    });

    it("should handle search", () => {
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
