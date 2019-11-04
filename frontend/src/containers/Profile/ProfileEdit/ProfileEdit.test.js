import React from "react";
import { shallow } from "enzyme";
import ProfileEdit from "./ProfileEdit";

describe("ProfileEdit Test", () => {
    it("should render without errors", () => {
        const component = shallow(<ProfileEdit />);
        let wrapper = component.find("#editDescription");
        expect(wrapper.length).toBe(1);
        wrapper = component.find("#applyButton");
        expect(wrapper.length).toBe(1);
    });

    it("should have original description", () => {
        const component = shallow(<ProfileEdit userDescription="asdf" />);
        expect(component.state("description")).toBe("asdf");
    });

    it("if edit button is clicked, should redirect to ProfileEdit", () => {
        const historyMock = { push: jest.fn() };
        const component = shallow(<ProfileEdit currentUserID={1} history={historyMock} />);
        const wrapper = component.find("#applyButton");
        wrapper.simulate("click");
        expect(historyMock.push.mock.calls[0]).toEqual(["/profile/1"]);
    });

    it("should set state properly on title and content input", () => {
        const component = shallow(<ProfileEdit />);
        const wrapper = component.find("#editDescription");
        wrapper.simulate("change", { target: { value: "...but now I realize it's a comedy." } });
        expect(component.state("description")).toBe("...but now I realize it's a comedy.");
    });
});
