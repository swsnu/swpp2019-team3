import React from "react";
import { shallow, mount } from "enzyme";
import PaperCard from "./PaperCard";
import { mockComponent } from "../../../test-utils/mocks";

jest.mock("../../Modal/AddPaperModal/AddPaperModal", () => jest.fn(() => (mockComponent("GoMyCollectionsModal")())));

describe("<PaperCard />", () => {
    it("should render without errors", () => {
        const component = shallow(<PaperCard />);
        const wrapper = component.find(".wrapper");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(<PaperCard />);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(component.state().likeCount).toEqual(1);
        expect(component.state().isLiked).toBe(true);

        wrapper.simulate("click");
        expect(component.state().likeCount).toBe(0);
        expect(component.state().isLiked).toBe(false);
    });

    it("if headerExists is false, then header should not exist", () => {
        const component = mount(<PaperCard headerExists={false} />);
        const wrapper = component.find(".header");
        expect(wrapper.length).toBe(0);
    });

    it("if addButtonExists is true, then addButton should exist", () => {
        const component = mount(<PaperCard addButtonExists />);
        const wrapper = component.find(".add-button");
        expect(wrapper.length).toBe(1);
    });

    it("if authors are given, join them and set authorNames appropriately", () => {
        const component = mount(<PaperCard authors={[{ first_name: "A", last_name: "B" },
            { first_name: "C", last_name: "D" }]}
        />);
        const paperCardInstance = component.find(PaperCard).instance();
        expect(paperCardInstance.state.authorNames).toBe("A B, C D");
    });

    it("if keywords are given, join them and set keywords appropriately", () => {
        const component = mount(<PaperCard keywords={["A", "B"]} />);
        const paperCardInstance = component.find(PaperCard).instance();
        expect(paperCardInstance.state.keywords).toBe("A, B");
    });
});
