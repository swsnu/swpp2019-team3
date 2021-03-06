/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";
import ManageCollectionMemberModal from "./ManageCollectionMemberModal";
import { collectionActions } from "../../../store/actions";
import { collectionStatus, signinStatus } from "../../../constants/constants";


const makeManageCollectionMemberModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <ManageCollectionMemberModal />
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

describe("ManageCollectionMemberModal test", () => {
    let stubInitialState;
    let manageCollectionMemberModal;
    let spyDeleteMembers;
    let spyGetMembers;

    beforeEach(() => {
        stubInitialState = {
            paper: {
            },
            auth: {
                signinStatus: signinStatus.SUCCESS,
                me: {
                    id: 1,
                    username: "test1",
                    description: "asdf",
                },
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
                    collection: {
                        id: 1,
                    },
                    status: collectionStatus.SUCCESS,
                    error: null,
                    papers: [],
                    memberCount: 3,
                    replies: [],
                },
                getMembers: {
                    status: collectionStatus.NONE,
                    members: [
                        {
                            id: 1,
                            username: "test1",
                            description: "asdf",
                            collection_member_type: "owner",
                        },
                        {
                            id: 2,
                            username: "test2",
                            description: "qwer",
                            collection_member_type: "member",
                        },
                        {
                            id: 3,
                            username: "test3",
                            description: "zxcv",
                            collection_member_type: "member",
                        },
                    ],
                    pageNum: 0,
                    finished: true,
                    error: null,
                },
            },
            user: {
                getFollowers: {},
                getFollowings: {},
                search: {},
            },
            review: {},
            reply: {},
        };
        manageCollectionMemberModal = makeManageCollectionMemberModal(stubInitialState);
        spyDeleteMembers = jest.spyOn(collectionActions, "deleteMembers")
            .mockImplementation(() => () => mockPromise);
        spyGetMembers = jest.spyOn(collectionActions, "getCollectionMembers")
            .mockImplementation(() => () => mockPromise);
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

    it("user entries test: should be rendered", () => {
        const component = mount(manageCollectionMemberModal);
        const instance = component.find("ManageCollectionMemberModal").instance();

        instance.setState({
            members: [
                {
                    id: 1,
                    username: "test1",
                    description: "asdf",
                    collection_member_type: "owner",
                },
                {
                    id: 2,
                    username: "test2",
                    description: "qwer",
                    collection_member_type: "member",
                },
                {
                    id: 3,
                    username: "test3",
                    description: "zxcv",
                    collection_member_type: "member",
                },
            ],
        });
        component.update();

        // should be rendered
        let wrapper = component.find("#modalOpenButton").hostNodes();
        wrapper.simulate("click");
        wrapper = component.find(".entryItem");
        expect(wrapper.length).toBe(3);
    });

    // more tests should be implemented
    it("should call deleteMembers when deleting", async () => {
        stubInitialState = {
            ...stubInitialState,
            collection: {
                ...stubInitialState.collection,
                getMembers: {
                    status: collectionStatus.SUCCESS,
                    members: [],
                    pageNum: 1,
                    finished: false,
                },
            },
        };

        const component = mount(makeManageCollectionMemberModal(stubInitialState));
        const instance = component.find(ManageCollectionMemberModal.WrappedComponent).instance();

        let wrapper = component.find(".ManageCollectionMemberModal #modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        await flushPromises();
        component.update();

        wrapper = component.find("#kickOffEnableButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        await flushPromises();
        instance.setState({
            members: [
                {
                    id: 2,
                    username: "test1",
                    description: "asdf",
                    collection_member_type: "owner",
                },
                {
                    id: 3,
                    username: "test2",
                    description: "qwer",
                    collection_member_type: "member",
                },
                {
                    id: 4,
                    username: "test3",
                    description: "zxcv",
                    collection_member_type: "member",
                },
            ],
        });
        component.update();

        wrapper = component.find("#check").at(0);
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { checked: true } });
        expect(instance.state.checkedUserIdList).toEqual([2]);

        wrapper = component.find(".WarningModal #modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find(".WarningModal #confirmButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyDeleteMembers).toHaveBeenCalledTimes(1);
    });

    it("should do uncheck", async () => {
        stubInitialState = {
            ...stubInitialState,
            collection: {
                ...stubInitialState.collection,
                getMembers: {
                    status: collectionStatus.SUCCESS,
                    members: [],
                    pageNum: 1,
                    finished: false,
                },
            },
        };

        const component = mount(makeManageCollectionMemberModal(stubInitialState));
        const instance = component.find(ManageCollectionMemberModal.WrappedComponent).instance();

        let wrapper = component.find(".ManageCollectionMemberModal #modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        await flushPromises();
        component.update();

        wrapper = component.find("#kickOffEnableButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        await flushPromises();
        instance.setState({
            members: [
                {
                    id: 2,
                    username: "test1",
                    description: "asdf",
                    collection_member_type: "owner",
                },
                {
                    id: 3,
                    username: "test2",
                    description: "qwer",
                    collection_member_type: "member",
                },
                {
                    id: 4,
                    username: "test3",
                    description: "zxcv",
                    collection_member_type: "member",
                },
            ],
        });
        component.update();

        wrapper = component.find("#check").at(0);
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { checked: true } });
        expect(instance.state.checkedUserIdList).toEqual([2]);

        wrapper.simulate("change", { target: { checked: false } });
        expect(instance.state.checkedUserIdList).toEqual([]);
    });

    it("should not handle scroll", () => {
        const ref = { current: { scrollTop: 0, clientHeight: 0, scrollHeight: 500 } };
        const spyCreateRef = jest.spyOn(React, "createRef")
            .mockImplementation(() => ref);
        const component = mount(manageCollectionMemberModal);
        expect(spyCreateRef).toBeCalledTimes(1);
        const instance = component.find(ManageCollectionMemberModal.WrappedComponent).instance();
        instance.setState({
            isModal: true, loading: false, showFollowings: true, memberFinished: false,
        });

        component.update();

        instance.handleScroll();

        expect(spyCreateRef).toBeCalledTimes(1);
        expect(spyGetMembers).toBeCalledTimes(0);
    });

    it("should handle scroll in remove mode", async () => {
        const ref = { current: { scrollTop: 700, clientHeight: 800, scrollHeight: 500 } };
        const spyCreateRef = jest.spyOn(React, "createRef")
            .mockImplementation(() => ref);
        const component = mount(manageCollectionMemberModal);

        expect(spyCreateRef).toBeCalledTimes(1);
        const instance = component.find(ManageCollectionMemberModal.WrappedComponent).instance();
        instance.setState({
            isModal: true, loading: false, removeMode: true, memberFinished: false,
        });
        component.update();

        instance.handleScroll();

        expect(spyGetMembers).toBeCalledTimes(1);
    });

    it("should handle scroll not in remove mode", async () => {
        const ref = { current: { scrollTop: 700, clientHeight: 800, scrollHeight: 500 } };
        const spyCreateRef = jest.spyOn(React, "createRef")
            .mockImplementation(() => ref);
        const component = mount(manageCollectionMemberModal);

        expect(spyCreateRef).toBeCalledTimes(1);


        expect(spyGetMembers).toBeCalledTimes(0);
        const instance = component.find(ManageCollectionMemberModal.WrappedComponent).instance();
        instance.setState({
            isModal: true, loading: false, removeMode: false, memberFinished: false,
        });
        component.update();

        instance.handleScroll();

        expect(spyGetMembers).toBeCalledTimes(1);
    });
});
