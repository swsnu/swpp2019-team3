import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import ReviewCard from "./ReviewCard";
import { getMockStore } from "../../../test-utils/mocks";
import { reviewActions } from "../../../store/actions";
import { reviewStatus } from "../../../constants/constants";

const mockHistory = { push: jest.fn() };

/* eslint-disable react/jsx-props-no-spreading */
const makeReviewCard = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <ReviewCard id={1} history={mockHistory} {...props} />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<ReviewCard />", () => {
    let stubInitialState;
    let reviewCard;
    let spyLikeReview;
    let spyUnlikeReview;

    beforeEach(() => {
        stubInitialState = {
            paper: {},
            auth: {},
            collection: {},
            review: {
                like: {
                    status: reviewStatus.NONE,
                    count: 0,
                    error: null,
                },
                unlike: {
                    status: reviewStatus.NONE,
                    count: 0,
                    error: null,
                },
            },
            user: {},
            reply: {},
        };
        reviewCard = makeReviewCard(stubInitialState);
        spyLikeReview = jest.spyOn(reviewActions, "likeReview")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeReview = jest.spyOn(reviewActions, "unlikeReview")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(reviewCard);
        const wrapper = component.find(".wrapper");
        expect(wrapper.length).toBe(1);
    });

    it("should call likeReview when Like Button is clicked", () => {
        const component = mount(reviewCard);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeReview).toHaveBeenCalledTimes(1);
    });

    it("should call unlikeReview when IsLiked and Like Button is clicked", () => {
        const component = mount(reviewCard);
        const instance = component.find(ReviewCard.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikeReview).toHaveBeenCalledTimes(1);
    });

    it("if headerExists is false, then header should not exist", () => {
        reviewCard = makeReviewCard(stubInitialState, { headerExists: false });
        const component = mount(reviewCard);
        const wrapper = component.find("#header");
        expect(wrapper.length).toBe(0);
    });

    it("if headerExists && paperSource, then header should exist", () => {
        reviewCard = makeReviewCard(stubInitialState, { headerExists: true, subscription: false, source: "source" });
        const component = mount(reviewCard);
        const wrapper = component.find("#header").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("if headerExists && subscription, then subscription header should exist", () => {
        reviewCard = makeReviewCard(stubInitialState, {
            headerExists: true, subscription: true, target: {},
        });
        const component = mount(reviewCard);
        const wrapper = component.find("#headerSubscription").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("if headerExists && subscription && target, then subscription header with target should exist", () => {
        reviewCard = makeReviewCard(stubInitialState, {
            headerExists: true, subscription: true, target: { content: { id: 1 } },
        });
        const component = mount(reviewCard);
        const wrapper = component.find("#headerSubscriptionTarget").hostNodes();
        expect(wrapper.length).toBe(1);
    });
});
