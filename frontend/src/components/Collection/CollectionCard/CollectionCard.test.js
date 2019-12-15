import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { Router } from "react-router-dom";
import CollectionCard from "./CollectionCard";
import { getMockStore } from "../../../test-utils/mocks";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import { history } from "../../../store/store";

/* eslint-disable react/jsx-props-no-spreading */
const makeCollectionCard = (initialState, props = {}) => (
    <Router location={{ state: "paperTab" }} history={history}>
        <Provider store={getMockStore(initialState)}>
            <CollectionCard id={1} history={history} {...props} />
        </Provider>
    </Router>
);
/* eslint-enable react/jsx-props-no-spreading */

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<CollectionCard />", () => {
    let stubInitialState;
    let collectionCard;
    let spyLikeCollection;
    let spyUnlikeCollection;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            auth: {},
            collection: {
                like: {
                    status: collectionStatus.NONE,
                    count: 0,
                    error: null,
                },
                unlike: {
                    status: collectionStatus.NONE,
                    count: 0,
                    error: null,
                },
            },
            review: {},
            user: {},
            reply: {},
        };
        collectionCard = makeCollectionCard(stubInitialState);
        spyLikeCollection = jest.spyOn(collectionActions, "likeCollection")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeCollection = jest.spyOn(collectionActions, "unlikeCollection")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(collectionCard);
        const wrapper = component.find(".wrapper");
        expect(wrapper.length).toBe(1);
    });

    it("should call likeReview when Like Button is clicked", () => {
        const component = mount(collectionCard);
        const wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeCollection).toHaveBeenCalledTimes(1);
    });

    it("should call unlikeReview when IsLiked and Like Button is clicked", () => {
        const component = mount(collectionCard);
        const instance = component.find(CollectionCard.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikeCollection).toHaveBeenCalledTimes(1);
    });

    it("if headerExists is false, then header should not exist", () => {
        collectionCard = makeCollectionCard(stubInitialState, { headerExists: false });
        const component = mount(collectionCard);
        const wrapper = component.find("#headerCollectionSubscription").hostNodes();
        expect(wrapper.length).toBe(0);
    });

    it("if headerExists and subscription, then subscription header should exist", () => {
        collectionCard = makeCollectionCard(stubInitialState, {
            headerExists: true, subscription: true,
        });
        const component = mount(collectionCard);
        const wrapper = component.find("#headerCollectionSubscription").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("if headerExists and subscription, then subscription header should exist", () => {
        collectionCard = makeCollectionCard(stubInitialState, {
            headerExists: true, subscription: true,
        });
        const component = mount(collectionCard);
        const wrapper = component.find("#headerCollectionSubscription").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
