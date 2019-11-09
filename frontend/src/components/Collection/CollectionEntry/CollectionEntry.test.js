import React from "react";
import { mount } from "enzyme";
import CollectionEntry from "./CollectionEntry";

describe("<CollectionEntry />", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<CollectionEntry checkhandler={jest.fn()} />);
        const wrapper = component.find(".collection-entry").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
