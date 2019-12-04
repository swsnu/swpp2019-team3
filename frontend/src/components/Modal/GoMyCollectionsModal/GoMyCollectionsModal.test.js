import React from "react";
import { mount } from "enzyme";

import GoMyCollectionsModal from "./GoMyCollectionsModal";

const mockHistory = { push: jest.fn() };

describe("<GoMyCollectionsModal />", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(<GoMyCollectionsModal />);
        const wrapper = component.find(".gotomycollectionsmodal");
        expect(wrapper.length).toBe(1);
    });

    it("should open addpapermodal when openTrigger", () => {
        const component = mount(<GoMyCollectionsModal disableCondition={false} />);
        const wrapper = component.find(".update-button").hostNodes();

        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        const instance = component.find(GoMyCollectionsModal).instance();
        expect(instance.state.isModalOpen).toBe(true);
    });

    it("should be closed if cancelButton is clicked", () => {
        const component = mount(<GoMyCollectionsModal disableCondition={false} />);
        let wrapper = component.find(".update-button").hostNodes();
        wrapper.simulate("click");

        wrapper = component.find(".go-button").hostNodes();
        const gotoModalInstance = component.find(GoMyCollectionsModal).instance();

        expect(wrapper.length).toBe(1);

        const cancelButton = component.find(".cancel-button").hostNodes();
        expect(cancelButton.length).toBe(1);
        cancelButton.simulate("click");

        expect(gotoModalInstance.state.isModalOpen).toBe(false);
    });

    it("should redirect to Collection List Page if go-button is clicked", () => {
        const component = mount(<GoMyCollectionsModal
          disableCondition={false}
          history={mockHistory}
        />);
        const wrapper = component.find(".update-button").hostNodes();
        wrapper.simulate("click");

        const goButton = component.find(".go-button").hostNodes();
        const gotoModalInstance = component.find(GoMyCollectionsModal).instance();

        goButton.simulate("click");

        expect(gotoModalInstance.state.isModalOpen).toBe(false);
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
    });
});
