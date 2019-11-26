/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import ManageCollectionMemberModal from "./ManageCollectionMemberModal";
import { collectionActions } from "../../../store/actions";
import { collectionStatus, signinStatus } from "../../../constants/constants";


const makeManageCollectionMemberModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <ManageCollectionMemberModal />
    </Provider>
);

/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */
const flushPromises = () => new Promise(setImmediate);

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
                    memberCount: 3,
                    replies: [],
                },
            },
            user: {},
            review: {},
            reply: {},
        };
        manageCollectionMemberModal = makeManageCollectionMemberModal(stubInitialState);
        spyDeleteMembers = jest.spyOn(collectionActions, "deleteMembers")
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
    it("should call deleteCollection when deleting", async () => {
        const component = mount(manageCollectionMemberModal);
        const instance = component.find(ManageCollectionMemberModal.WrappedComponent).instance();
        instance.setState({
            isModalOpen: true,
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

        let wrapper = component.find("#kickOffEnableButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        component.update();

        wrapper = component.find("#check").at(0); // test2 (excluding 'me')
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { checked: true } });
        expect(instance.state.checkedUserIdList).toEqual([2]);

        wrapper = component.find(".WarningModal #modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find(".WarningModal #confirmButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();

        expect(spyDeleteMembers).toHaveBeenCalledTimes(1);
    });
});
