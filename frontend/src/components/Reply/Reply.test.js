import React from "react";
import { shallow, mount } from "enzyme";
import Modal from "react-bootstrap/Modal";
import Reply from "./Reply";

describe("<Reply />", () => {
    it("should render without errors", () => {
        const component = shallow(<Reply />);
        const wrapper = component.find(".reply-component");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(<Reply isLiked={false} likeCount={0} />);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(component.state().likeCount).toEqual(1);
        expect(component.state().isLiked).toBe(true);

        wrapper.simulate("click");
        expect(component.state().likeCount).toBe(0);
        expect(component.state().isLiked).toBe(false);
    });

    it("should handle edit button", () => {
        const wrapper = mount(<Reply />);
        const component = wrapper.find(".buttons .edit-button").hostNodes();
        component.simulate("click");
        expect(wrapper.state().isModalOpen).toBe(true);
        const modal = wrapper.find(Modal);
        expect(modal.length).toBe(1);
    });

    it("should not handle edit, delete button if user is not author", () => {
        const wrapper = mount(<Reply authorId={1} />);
        const editButton = wrapper.find(".buttons .edit-button").hostNodes();
        expect(editButton.length).toBe(0);
        const deleteButton = wrapper.find(".buttons .delete-button").hostNodes();
        expect(deleteButton.length).toBe(0);
    });

    it("should handle delete button", () => {
        const wrapper = mount(<Reply />);
        const component = wrapper.find(".buttons .delete-button").hostNodes();
        component.simulate("click");
        expect(wrapper.state().isExisting).toBe(false);
        const reply = wrapper.find(".reply");
        expect(reply.length).toBe(0);
        const modal = wrapper.find(Modal);
        expect(modal.length).toBe(0);
    });

    it("should handle Change", () => {
        const event = {
            target: {
                value: "ABC",
            },
        };
        const wrapper = mount(<Reply />);
        wrapper.instance().handleChange(event);
        expect(wrapper.state().tempContent).toBe("ABC");
    });

    it("should handle click confirm button", () => {
        const wrapper = mount(<Reply />);
        wrapper.instance().clickConfirmButtonHandler();
        expect(wrapper.state().tempContent).toBe("");
    });

    it("should handle click cancel button", () => {
        const handleCloseMock = jest.fn();
        const wrapper = mount(<Reply handleClose={handleCloseMock} />);
        wrapper.instance().clickCancelButtonHandler();
        expect(wrapper.state().tempContent).toBe("");
    });

    it("should handle close modal", () => {
        const wrapper = mount(<Reply />);
        wrapper.instance().handleClose();
        expect(wrapper.state().isModalOpen).toBe(false);
    });
});
