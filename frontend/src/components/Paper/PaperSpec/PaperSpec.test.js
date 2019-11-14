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

    beforeEach(() => {
        paperSpec = makePaperSpec(stubInitialState);
        /* spyGetCollections = jest.spyOn(collectionActions, "getCollectionsByUserId")
            .mockImplementation(() => () => mockPromise);
        spyAddPaper = jest.spyOn(collectionActions, "addCollectionPaper")
            .mockImplementation(() => () => mockPromise); */
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(paperSpec);
        const wrapper = component.find(".paperspec");
        expect(wrapper.length).toBe(1);
    });

    it("should handle Like/Unlike Button", () => {
        const component = mount(paperSpec);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        const instance = component.find(PaperSpec.WrappedComponent).instance();
        expect(instance.state.likeCount).toEqual(1);
        expect(instance.state.isLiked).toBe(true);

        wrapper.simulate("click");
        expect(instance.state.likeCount).toBe(0);
        expect(instance.state.isLiked).toBe(false);
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
