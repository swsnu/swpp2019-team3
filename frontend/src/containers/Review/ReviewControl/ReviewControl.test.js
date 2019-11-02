import React from "react";
import { shallow, mount } from "enzyme";
import ReviewControl from "./ReviewControl";

describe("<ReviewControl />", () => {
    it("should render without errors", () => {
        const component = mount(<ReviewControl />);
        const wrapper = component.find(".review-control");
        expect(wrapper.length).toBe(1);
    });

    it("should handle click edit button", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<ReviewControl history={historyMock} mode={1} />);
        const wrapper = component.find(".review-control");
        const button = wrapper.find(".edit-button").hostNodes();
        expect(button.length).toBe(1);
        button.simulate("click");
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should handle click create button", () => {
        const historyMock = { push: jest.fn() };
        const component = mount(<ReviewControl history={historyMock} mode={0} />);
        const wrapper = component.find(".review-control");
        const button = wrapper.find(".create-button").hostNodes();
        expect(button.length).toBe(1);
        button.simulate("click");
        expect(historyMock.push).toHaveBeenCalledTimes(1);
    });

    it("should handle change on title when create", () => {
        const event = {
            target: {
                name: "title",
                value: "ABC",
            },
        };
        const wrapper = shallow(<ReviewControl mode={0} />);
        const input = wrapper.find(".title-input");
        expect(input.at(0).props().placeholder).toEqual("Enter title");
        input.simulate("change", event);
        expect(wrapper.state().title).toBe("ABC");
    });

    it("should handle change on title when edit", () => {
        const event = {
            target: {
                name: "title",
                value: "ABC",
            },
        };
        const wrapper = shallow(<ReviewControl mode={1} />);
        const input = wrapper.find(".content-input");
        expect(input.at(0).props().placeholder).toEqual("");
        input.simulate("change", event);
        expect(wrapper.state().title).toBe("ABC");
    });

    it("should handle change on content when create", () => {
        const event = {
            target: {
                name: "content",
                value: "ABC",
            },
        };
        const wrapper = shallow(<ReviewControl mode={0} />);
        const input = wrapper.find(".content-input");
        expect(input.at(0).props().placeholder).toEqual("Enter content");
        input.simulate("change", event);
        expect(wrapper.state().content).toBe("ABC");
    });

    it("should handle change on content when edit", () => {
        const event = {
            target: {
                name: "content",
                value: "ABC",
            },
        };

        const wrapper = shallow(<ReviewControl mode={1} />);
        const input = wrapper.find(".content-input");
        expect(input.at(0).props().placeholder).toEqual("");
        input.simulate("change", event);
        expect(wrapper.state().content).toBe("ABC");
    });
});
