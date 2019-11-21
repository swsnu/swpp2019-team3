/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import Modal from "react-bootstrap/Modal";
import Reply from "./Reply";
import { replyActions } from "../../store/actions";
import { replyStatus } from "../../constants/constants";
import { getMockStore } from "../../test-utils/mocks";

const mockHistory = { push: jest.fn() };

const makeReply = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <Reply id={1} history={mockHistory} {...props} />
    </Provider>
);

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<Reply />", () => {
    let stubInitialState;
    let reply;
    let spyLikeReply;
    let spyUnlikeReply;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            auth: {},
            collection: {},
            review: {},
            user: {},
            reply: {
                make: {
                    status: replyStatus.NONE,
                    reply: {},
                    error: null,
                },
                list: {
                    status: replyStatus.NONE,
                    list: [],
                    error: null,
                },
                edit: {
                    status: replyStatus.NONE,
                    reply: {},
                    error: null,
                },
                delete: {
                    status: replyStatus.NONE,
                    reply: {},
                    error: null,
                },
                selected: {
                    status: replyStatus.NONE,
                    reply: {},
                    error: null,
                },
                like: {
                    status: replyStatus.NONE,
                    count: 0,
                    error: null,
                },
                unlike: {
                    status: replyStatus.NONE,
                    count: 0,
                    error: null,
                },
            },
        };
        reply = makeReply(stubInitialState);
        spyLikeReply = jest.spyOn(replyActions, "likeReply")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeReply = jest.spyOn(replyActions, "unlikeReply")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(reply);
        const wrapper = component.find(".reply-component");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(reply);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeReply).toHaveBeenCalledTimes(1);

        wrapper.simulate("click");

        expect(spyUnlikeReply).toHaveBeenCalledTimes(1);
    });

    it("should handle edit button", () => {
        const wrapper = mount(reply);
        const instance = wrapper.find("Reply").instance();
        wrapper.setProps(() => ({
            authorId: 1,
            userId: 1,
            type: "review",
        }));
        wrapper.update();
        const component = wrapper.find(".buttons .edit-button").hostNodes();
        component.simulate("click");
        wrapper.update();
        expect(instance.state.isModalOpen).toBe(true);
        const modal = wrapper.find(Modal);
        expect(modal.length).toBe(1);
    });

    it("should not handle edit, delete button if user is not author", () => {
        const wrapper = mount(reply);
        wrapper.setProps(() => ({
            authorId: 1,
            userId: 7,
        }));
        wrapper.update();
        const editButton = wrapper.find(".buttons .edit-button").hostNodes();
        expect(editButton.length).toBe(0);
        const deleteButton = wrapper.find(".buttons .delete-button").hostNodes();
        expect(deleteButton.length).toBe(0);
    });

    it("should handle delete button", () => {
        const spyDeleteReplyReview = jest.spyOn(replyActions, "deleteReplyReview")
            .mockImplementation(() => () => mockPromise);
        const spyDeleteReplyCollection = jest.spyON(replyActions, "deleteReplyCollection")
            .mockImplementation(() => () => mockPromise);
        const wrapper = mount(reply);
        wrapper.setProps(() => ({
            authorId: 1,
            userId: 1,
            type: "review",
        }));
        wrapper.update();
        let component = wrapper.find(".buttons .delete-button").hostNodes();
        component.simulate("click");
        expect(spyDeleteReplyReview).toHaveBeenCalledTimes(1);

        wrapper.setProps(() => ({
            authorId: 1,
            userId: 1,
            type: "collection",
        }));
        wrapper.update();
        component = wrapper.find(".buttons .delete-button").hostNodes();
        component.simulate("click");
        expect(spyDeleteReplyCollection).toHaveBeenCalledTimes(1);
    });

    it("should handle Change", () => {
        const event = {
            target: {
                value: "ABC",
            },
        };
        const wrapper = mount(reply);
        const instance = wrapper.find("Reply").instance();
        instance.handleChange(event);
        expect(instance.state.tempContent).toBe("ABC");
    });

    it("should handle click confirm button", () => {
        const wrapper = mount(reply);
        const instance = wrapper.find("Reply").instance();
        instance.clickConfirmButtonHandler();
        expect(instance.state.tempContent).toBe("");
    });

    it("should handle click cancel button", () => {
        const wrapper = mount(reply);
        const instance = wrapper.find("Reply").instance();
        const handleCloseMock = jest.spyOn(instance, "handleClose")
            .mockImplementation(() => {});
        instance.clickCancelButtonHandler();
        expect(instance.state.tempContent).toBe("");
        expect(handleCloseMock).toHaveBeenCalledTimes(1);
    });

    it("should handle close modal", () => {
        const wrapper = mount(reply);
        const instance = wrapper.find("Reply").instance();
        instance.handleClose();
        wrapper.update();
        expect(instance.state.isModalOpen).toBe(false);
    });
});
