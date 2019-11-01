import React from "react";
import { shallow, mount } from "enzyme";
import ReviewCreate from "./ReviewCreate";

describe("<ReviewCreate />", () => {
    it("should render without errors", () => {
        const component = mount(<ReviewCreate />);
        const wrapper = component.find(".review-create");
        expect(wrapper.length).toBe(1);
    });

    it("should handle click crate button", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<ReviewCreate history={historyMock} />);
        const wrapper = component.find(".review-create");
        const button = wrapper.find(".create-button").hostNodes();
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
        const wrapper = shallow(<ReviewCreate />);
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
        const wrapper = shallow(<ReviewCreate />);
        wrapper.find(".content-input").simulate("change", event);
        expect(wrapper.state().content).toBe("ABC");
    });
});
