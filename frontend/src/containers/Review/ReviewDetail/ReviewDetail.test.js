import React from "react";
import { mount, shallow } from "enzyme";
import ReviewDetail from "./ReviewDetail";

describe("<ReviewDetail />", () => {
    it("should render without errors", () => {
        const component = mount(<ReviewDetail />);
        const wrapper = component.find(".review-detail");
        expect(wrapper.length).toBe(1);
    });

    it("should handle change on new reply", () => {
        const event = {
            target: {
                value: "ABC",
            },
        };
        const wrapper = shallow(<ReviewDetail />);
        wrapper.find(".reply-input").simulate("change", event);
        expect(wrapper.state().newReply).toBe("ABC");
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(<ReviewDetail />);
        const wrapper = component.find(".review-extra .like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(component.state().likeCount).toEqual(6);
        expect(component.state().isLiked).toBe(true);

        wrapper.simulate("click");
        expect(component.state().likeCount).toBe(5);
        expect(component.state().isLiked).toBe(false);
    });

    it("should handle edit button", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<ReviewDetail history={historyMock} />);
        const button = component.find(".review-extra .edit-button").hostNodes();
        button.simulate("click");
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should not render edit button when user is not author", () => {
        const component = mount(<ReviewDetail />);
        component.setState({ authorId: 1 });
        const button = component.find(".review-extra .edit-button").hostNodes();
        expect(button.length).toBe(0);
    });


    it("should handle delete button", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<ReviewDetail history={historyMock} />);
        const button = component.find(".review-extra .delete-button").hostNodes();
        button.simulate("click");
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should handle add button", () => {
        const component = mount(<ReviewDetail />);
        const button = component.find(".new-reply .new-reply-button").hostNodes();
        button.simulate("click");
        expect(component.state().repliesCount).toBe(3);
    });
});
