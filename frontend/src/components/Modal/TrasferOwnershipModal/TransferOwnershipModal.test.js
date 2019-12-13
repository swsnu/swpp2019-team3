/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore, mockPromise } from "../../../test-utils/mocks";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import TransferOwnershipModal from "./TransferOwnershipModal";
import { collectionActions } from "../../../store/actions";

const makeTransferModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <TransferOwnershipModal
          collectionId={1}
          collectionName="asdf"
        />
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

describe("TransferOwnershipModal test", () => {
    let stubInitialState;
    let transferModal;
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
                    status: collectionStatus.NONE,
                    error: null,
                    collection: {},
                    papers: [],
                    memberCount: 3,
                    replies: [],
                },
                getMembers: {
                    status: collectionStatus.NONE,
                    members: [
                    ],
                    pageNum: 0,
                    finished: true,
                    error: null,
                },
            },
            user: {},
            review: {},
            reply: {},
        };
        transferModal = makeTransferModal(stubInitialState);
        spyGetMembers = jest.spyOn(collectionActions, "getCollectionMembers")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
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

    it("user entries test: should be rendered and handles checking", () => {
        const component = mount(transferModal);
        const instance = component.find("TransferOwnershipModal").instance();

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
        expect(wrapper.length).toBe(2); // excluding 'me'

        // should handle checking
        wrapper = component.find("#check").at(0);
        wrapper.simulate("change", { target: { checked: true } });
        expect(instance.state.selectedUserId).toBe(2); // the first user of entries is "test2"
        expect(instance.state.selectedUserName).toBe("test2");
    });

    // it("clickWarningConfirmAction should be called in WarningModal", () => {
    //     TODO: Implement this test
    // })

    it("should handle scroll", () => {
        const ref = { current: { scrollTop: 700, clientHeight: 800, scrollHeight: 500 } };
        const spyCreateRef = jest.spyOn(React, "createRef")
            .mockImplementation(() => ref);
        const component = mount(transferModal);

        expect(spyCreateRef).toBeCalledTimes(1);
        const instance = component.find(TransferOwnershipModal.WrappedComponent).instance();
        instance.setState({
            isModalOpen: true, loading: false, memberFinished: false,
        });
        component.update();

        instance.handleScroll();

        expect(spyGetMembers).toBeCalledTimes(1);
    });

    it("should not handle scroll", () => {
        const ref = { current: { scrollTop: 0, clientHeight: 0, scrollHeight: 500 } };
        const spyCreateRef = jest.spyOn(React, "createRef")
            .mockImplementation(() => ref);
        const component = mount(transferModal);
        expect(spyCreateRef).toBeCalledTimes(1);
        const instance = component.find(TransferOwnershipModal.WrappedComponent).instance();
        instance.setState({ isModalOpen: true, loading: false, memberFinished: true });

        component.update();
        instance.handleScroll();

        expect(spyCreateRef).toBeCalledTimes(1);
        expect(spyGetMembers).toBeCalledTimes(0);
    });
});
