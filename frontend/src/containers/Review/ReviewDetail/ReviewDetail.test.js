import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import ReviewDetail from "./ReviewDetail";
import { reviewActions } from "../../../store/actions";
import { reviewStatus, getMeStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<ReviewDetail />", () => {
    let stubInitialState;
    let reviewDetail;
    let spyOnGetReview;
    let spyLikeReview;
    let spyUnlikeReview;

    beforeEach(() => {
        stubInitialState = {
            paper: {
            },
            auth: {
                getMeStatus: getMeStatus.NONE,
                me: { id: 1 },
            },
            collection: {

            },
            review: {
                make: {
                    status: reviewStatus.NONE,
                    review: {},
                    error: null,
                },
                list: {
                    status: reviewStatus.NONE,
                    list: [],
                    error: null,
                },
                edit: {
                    status: reviewStatus.NONE,
                    review: {},
                    error: null,
                },
                delete: {
                    status: reviewStatus.NONE,
                    review: {},
                    error: null,
                },
                selected: {
                    status: reviewStatus.NONE,
                    review: { id: 1 },
                    error: null,
                    replies: [],
                },
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
        };

        reviewDetail = (
            <Provider store={getMockStore(stubInitialState)}>
                <ReviewDetail match={{ params: { review_id: 1 } }} history={history} />
            </Provider>
        );
        spyOnGetReview = jest.spyOn(reviewActions, "getReview")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        spyLikeReview = jest.spyOn(reviewActions, "likeReview")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeReview = jest.spyOn(reviewActions, "unlikeReview")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(reviewDetail);
        const wrapper = component.find("ReviewDetail");
        expect(wrapper.length).toBe(1);
        expect(spyOnGetReview).toHaveBeenCalledTimes(1);
    });

    it("should handle change on new reply", () => {
        const event = {
            target: {
                value: "ABC",
            },
        };
        const wrapper = mount(reviewDetail);
        const instance = wrapper.find("ReviewDetail").instance();
        wrapper.find(".reply-input").hostNodes().simulate("change", event);
        wrapper.update();
        expect(instance.state.newReply).toBe("ABC");
    });

    it("should call likeReview when Like Button is clicked", () => {
        const component = mount(reviewDetail);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeReview).toHaveBeenCalledTimes(1);
    });

    it("should call unlikeReview when IsLiked and Like Button is clicked", () => {
        const component = mount(reviewDetail);
        const instance = component.find(ReviewDetail.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikeReview).toHaveBeenCalledTimes(1);
    });

    it("should handle edit button", () => {
        const spyPush = jest.spyOn(history, "push");
        const component = mount(reviewDetail);
        component.find("ReviewDetail").instance().setState({ user: { id: 0 }, author: { id: 0 } });
        component.update();
        const button = component.find(".review-extra .edit-button").hostNodes();
        button.simulate("click");
        component.update();
        expect(spyPush).toHaveBeenCalledTimes(1);
    });

    it("should not render edit button when user is not author", () => {
        const component = mount(reviewDetail);
        component.find("ReviewDetail").instance().setState({ user: { id: 1 }, author: { id: 0 } });
        component.update();
        const button = component.find(".review-extra .edit-button").hostNodes();
        expect(button.length).toBe(0);
    });


    it("should handle delete button", () => {
        const spyOnDeleteReview = jest.spyOn(reviewActions, "deleteReview")
            .mockImplementation(() => () => new Promise(
                (resolve) => {
                    resolve({ status: 200 });
                },
            ));
        const component = mount(reviewDetail);

        const button = component.find(".review-extra .delete-button").hostNodes();
        button.simulate("click");
        expect(spyOnDeleteReview).toHaveBeenCalledTimes(1);
    });

    it("should handle add button", () => {
        const component = mount(reviewDetail);
        const instance = component.find("ReviewDetail").instance();
        instance.setState({
            replyCount: 0,
        });
        component.update();
        const button = component.find(".new-reply .new-reply-button").hostNodes();
        button.simulate("click");

        expect(instance.state.replyCount).toBe(1);
    });

    it("should handle replies well", () => {
        const component = mount(reviewDetail);
        const instance = component.find("ReviewDetail").instance();
        instance.setState(
            {
                replies: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
        );
        component.update();
        const replies = component.find(".replies");
        expect(replies.length).toBe(1);
    });
});
