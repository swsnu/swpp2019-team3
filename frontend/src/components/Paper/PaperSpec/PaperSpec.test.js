import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import PaperSpec from "./PaperSpec";
import { paperStatus, signinStatus } from "../../../constants/constants";
import { getMockStore, mockComponent } from "../../../test-utils/mocks";
import { paperActions } from "../../../store/actions";

const stubInitialState = {
    paper: {

    },
    auth: {},
    collection: {},
    review: {},
};

const mockHistory = { push: jest.fn() };

/* eslint-disable react/jsx-props-no-spreading */
const makePaperSpec = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <PaperSpec id={1} history={mockHistory} {...props} />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

jest.mock("../../Modal/AddPaperModal/AddPaperModal", () => jest.fn(() => (mockComponent("AddPaperModal")())));

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<PaperSpec />", () => {
    let paperSpec;
    let spyLikePaper;
    let spyUnlikePaper;

    beforeEach(() => {
        paperSpec = makePaperSpec(stubInitialState);
        spyLikePaper = jest.spyOn(paperActions, "likePaper")
            .mockImplementation(() => () => mockPromise);
        spyUnlikePaper = jest.spyOn(paperActions, "unlikePaper")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(paperSpec);
        const wrapper = component.find(".paperspec");
        expect(wrapper.length).toBe(1);
    });

    it("should call likePaper when Like Button is clicked", () => {
        const component = mount(paperSpec);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikePaper).toHaveBeenCalledTimes(1);
    });

    it("should call unlikePaper when IsLiked and Like Button is clicked", () => {
        const component = mount(paperSpec);
        const instance = component.find(PaperSpec.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikePaper).toHaveBeenCalledTimes(1);
    });

    it("should window open is called when url button is clicked", () => {
        const spyOpen = jest.spyOn(window, "open")
            .mockImplementation(jest.fn());

        const component = mount(paperSpec);
        const wrapper = component.find(".url-button").hostNodes();
        wrapper.simulate("click");

        expect(spyOpen).toHaveBeenCalledTimes(1);
    });

    it("if keywords are given, join them and set keywords appropriately", () => {
        paperSpec = makePaperSpec(stubInitialState, {
            keywords: [
                { name: "A", type: "author" },
                { name: "B", type: "abstract" },
                { name: "C", type: "author" }],
        });
        const component = mount(paperSpec);

        let wrapper = component.find("#author-keywords-content");
        expect(wrapper.text()).toEqual("A, C");
        wrapper = component.find("#abstract-keywords-content");
        expect(wrapper.text()).toEqual("B");
    });
});
