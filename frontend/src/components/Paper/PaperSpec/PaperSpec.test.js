import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import PaperSpec from "./PaperSpec";
import { getMockStore, mockComponent, mockPromise } from "../../../test-utils/mocks";
import { paperActions } from "../../../store/actions";


const mockHistory = { push: jest.fn() };

/* eslint-disable react/jsx-props-no-spreading */
const makePaperSpec = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <PaperSpec id={1} history={mockHistory} {...props} />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

jest.mock("../../Modal/AddPaperModal/AddPaperModal", () => jest.fn(() => (mockComponent("AddPaperModal")())));

describe("<PaperSpec />", () => {
    let stubInitialState;
    let paperSpec;
    let spyLikePaper;
    let spyUnlikePaper;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            auth: {},
            collection: {},
            review: {},
            user: {},
            reply: {},
        };
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
        const wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikePaper).toHaveBeenCalledTimes(1);
    });

    it("should call unlikePaper when IsLiked and Like Button is clicked", () => {
        const component = mount(paperSpec);
        const instance = component.find(PaperSpec.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikePaper).toHaveBeenCalledTimes(1);
    });

    it("should window open is called when url button is clicked", () => {
        const spyOpen = jest.spyOn(window, "open")
            .mockImplementation(jest.fn());

        paperSpec = makePaperSpec(stubInitialState, {
            link: "http://arxiv.org/pdf/1805.04177v1",
        });
        const component = mount(paperSpec);
        const wrapper = component.find(".url-button").hostNodes();
        wrapper.simulate("click");

        expect(spyOpen).toHaveBeenCalledTimes(1);
    });

    it("if keywords are given, set keywords appropriately", () => {
        paperSpec = makePaperSpec(stubInitialState, {
            keywords: [
                { id: 1, name: "A", type: "author" },
                { id: 2, name: "B", type: "abstract" },
                { id: 3, name: "C", type: "author" }],
        });
        const component = mount(paperSpec);

        let wrapper = component.find(".keyword-more-button").hostNodes();
        expect(wrapper.length).toBe(0);
        wrapper = component.find("#author-keywords-content");
        expect(wrapper.text()).toEqual("# A# C");
        wrapper = component.find("#abstract-keywords-content");
        expect(wrapper.text()).toEqual("# B");
    });

    it("if many extracted keywords are given, show keyword-more-button and handle it", () => {
        paperSpec = makePaperSpec(stubInitialState, {
            keywords: [
                { id: 1, name: "A", type: "abstract" },
                { id: 2, name: "B", type: "abstract" },
                { id: 3, name: "C", type: "abstract" },
                { id: 4, name: "C", type: "abstract" },
                { id: 5, name: "C", type: "abstract" },
                { id: 6, name: "C", type: "abstract" },
                { id: 7, name: "C", type: "abstract" },
                { id: 8, name: "C", type: "abstract" },
                { id: 9, name: "C", type: "abstract" },
                { id: 10, name: "C", type: "abstract" },
                { id: 11, name: "C", type: "abstract" },
            ],
        });
        const component = mount(paperSpec);

        let wrapper = component.find(".keyword-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        let keywords = component.find(".keyword-tag").hostNodes();
        expect(keywords.length).toBe(10);

        // if keyword-more-button is clicked, show all keywords
        wrapper.simulate("click");
        keywords = component.find(".keyword-tag").hostNodes();
        expect(keywords.length).toBe(11);

        // if keyword-less-button is clicked, show keywords <= 10
        wrapper = component.find(".keyword-less-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");
        keywords = component.find(".keyword-tag").hostNodes();
        expect(keywords.length).toBe(10);
    });

    it("should handle abstract fold", () => {
        paperSpec = makePaperSpec(stubInitialState, {
            abstractfoldExists: true,
        });
        const component = mount(paperSpec);

        let wrapper = component.find(".abstract-more-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        wrapper = component.find(".abstract-less-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");
        wrapper = component.find(".abstract-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
