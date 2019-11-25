/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
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
            collection: {},
            status: collectionStatus.NONE,
            error: null,
            papers: [],
            members: [
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
            memberCount: 3,
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

jest.mock("../WarningModal/WarningModal", () => jest.fn((props) => (
    <button
      id="mockWarningButton"
      onClick={props.clickFn}
    />
)));
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

    it("user entries test: should be rendered and handles checking", () => {
        const component = mount(manageCollectionMemberModal);
        const instance = component.find("ManageCollectionMemberModal").instance();

        instance.setState({
            members: [
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

        // should be rendered
        let wrapper = component.find("#modalOpenButton").hostNodes();
        wrapper.simulate("click");
        wrapper = component.find(".entryItem");
        expect(wrapper.length).toBe(3);

        // should handle checking
        wrapper = component.find("#check").at(0);
        wrapper.simulate("change", { target: { checked: true } });

        expect(instance.state.checkedUserIdList).toEqual([1]);
    });
});
