import React from "react";
import { shallow, mount } from "enzyme";
import ReviewEdit from "./ReviewEdit";

describe("<ReviewEdit />", () => {
    it("should render without errors", () => {
        const component = mount(<ReviewEdit />);
        const wrapper = component.find(".review-edit");
        expect(wrapper.length).toBe(1);
    });

    it("should handle click edit button", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<ReviewEdit history={historyMock} />);
        const wrapper = component.find(".review-edit");
        const button = wrapper.find(".edit-button").hostNodes();
        button.simulate("click");
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should handle change on title", () => {
        const event = {
            target: {
                name: "title",
                value: "ABC",
            },
        };
        const wrapper = shallow(<ReviewEdit />);
        wrapper.find(".title-input").simulate("change", event);
        expect(wrapper.state().title).toBe("ABC");
    });

    it("should handle change on content", () => {
        const event = {
            target: {
                name: "content",
                value: "ABC",
            },
        };
        const wrapper = shallow(<ReviewEdit />);
        wrapper.find(".content-input").simulate("change", event);
        expect(wrapper.state().content).toBe("ABC");
    });
});
