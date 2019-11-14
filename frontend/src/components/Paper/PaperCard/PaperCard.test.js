import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import PaperCard from "./PaperCard";
import { getMockStore, mockComponent } from "../../../test-utils/mocks";
import { paperActions } from "../../../store/actions";


const stubInitialState = {
    paper: {},
    auth: {},
    collection: {},
    review: {},
};

const mockHistory = { push: jest.fn() };

/* eslint-disable react/jsx-props-no-spreading */
const makePaperCard = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <PaperCard id={1} history={mockHistory} {...props} />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

jest.mock("../../Modal/AddPaperModal/AddPaperModal", () => jest.fn(() => (mockComponent("GoMyCollectionsModal")())));

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<PaperCard />", () => {
    let paperCard;
    let spyLikePaper;
    let spyUnlikePaper;

    beforeEach(() => {
        paperCard = makePaperCard(stubInitialState);
        spyLikePaper = jest.spyOn(paperActions, "likePaper")
            .mockImplementation(() => () => mockPromise);
        spyUnlikePaper = jest.spyOn(paperActions, "unlikePaper")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(paperCard);
        const wrapper = component.find(".wrapper");
        expect(wrapper.length).toBe(1);
    });

    it("should call likePaper when Like Button is clicked", () => {
        const component = mount(paperCard);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikePaper).toHaveBeenCalledTimes(1);
    });

    it("should call unlikePaper when IsLiked and Like Button is clicked", () => {
        const component = mount(paperCard);
        const instance = component.find(PaperCard.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikePaper).toHaveBeenCalledTimes(1);
    });

    it("if headerExists is false, then header should not exist", () => {
        paperCard = makePaperCard(stubInitialState, { headerExists: false });
        const component = mount(paperCard);
        const wrapper = component.find(".header");
        expect(wrapper.length).toBe(0);
    });

    it("if addButtonExists is true, then addButton should exist", () => {
        paperCard = makePaperCard(stubInitialState, { addButtonExists: true });
        const component = mount(paperCard);
        const wrapper = component.find(".add-button");
        expect(wrapper.length).toBe(1);
    });

    it("if authors are given, join them and set authorNames appropriately", () => {
        paperCard = makePaperCard(stubInitialState, {
            authors: [{ first_name: "A", last_name: "B" }, { first_name: "C", last_name: "D" }],
        });
        const component = mount(paperCard);
        const paperCardInstance = component.find(PaperCard.WrappedComponent).instance();
        expect(paperCardInstance.state.authorNames).toBe("A B, C D");
    });

    it("if keywords are given, join them and set keywords appropriately", () => {
        paperCard = makePaperCard(stubInitialState, {
            keywords: [
                { name: "A", type: "author" },
                { name: "B", type: "abstract" },
                { name: "C", type: "author" }],
        });
        const component = mount(paperCard);
        const paperCardInstance = component.find(PaperCard.WrappedComponent).instance();
        expect(paperCardInstance.state.keywords).toBe("A, C");
    });
});
