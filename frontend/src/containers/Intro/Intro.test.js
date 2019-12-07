import React from "react";
import { mount } from "enzyme";

import Intro from "./Intro";
import { mockComponent } from "../../test-utils/mocks";

jest.mock("../../components/Modal/IntroModal/IntroModal", () => jest.fn((props) => (mockComponent("IntroModal")(props))));

describe("<Intro />", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<Intro />);
        const wrapper = component.find("#intro-page");
        expect(wrapper.length).toBe(1);
    });
});
