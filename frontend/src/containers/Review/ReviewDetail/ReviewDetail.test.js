import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import ReviewDetail from "./ReviewDetail";
import { reviewActions, replyActions } from "../../../store/actions";
import { reviewStatus, getMeStatus } from "../../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";


const history = createBrowserHistory();

/* eslint-disable react/jsx-props-no-spreading */
const makeReviewDetail = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <ReviewDetail
          match={{ params: { review_id: 1 } }}
          history={history}
          {...props}
        />
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

describe("<ReviewDetail />", () => {
    let stubInitialState;
    let reviewDetail;
    let spyOnGetReview;
    let spyLikeReview;
    let spyUnlikeReview;
    let spyGetReplies;

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
            user: {},
            reply: {
                list: {
                    list: [],
                },
                like: {
                    count: 0,
                },
                unlike: {
                    count: 0,
                },
            },
        };

        reviewDetail = makeReviewDetail(stubInitialState);
        spyOnGetReview = jest.spyOn(reviewActions, "getReview")
            .mockImplementation(() => () => mockPromise);
        spyLikeReview = jest.spyOn(reviewActions, "likeReview")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeReview = jest.spyOn(reviewActions, "unlikeReview")
            .mockImplementation(() => () => mockPromise);
        spyGetReplies = jest.spyOn(replyActions, "getRepliesByReview")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", async () => {
        const component = mount(reviewDetail);
        await flushPromises();
        const wrapper = component.find("ReviewDetail");
        expect(wrapper.length).toBe(1);
        expect(spyOnGetReview).toHaveBeenCalledTimes(1);
        expect(spyGetReplies).toHaveBeenCalledTimes(1);
    });

    it("should handle review_not_exist", async () => {
        stubInitialState = {
            ...stubInitialState,
            review: {
                ...stubInitialState.review,
                selected: {
                    status: reviewStatus.REVIEW_NOT_EXIST,
                    review: { id: 1 },
                    error: null,
                    replies: [],
                },
            },
        };
        const component = mount(makeReviewDetail(stubInitialState));
        const spyPush = jest.spyOn(history, "push")
            .mockImplementation(() => {});
        await flushPromises();
        const wrapper = component.find("ReviewDetail");
        expect(wrapper.length).toBe(1);
        expect(spyPush).toHaveBeenCalledTimes(1);
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
        const wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeReview).toHaveBeenCalledTimes(1);
    });

    it("should call unlikeReview when IsLiked and Like Button is clicked", () => {
        const component = mount(reviewDetail);
        const instance = component.find(ReviewDetail.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find("#likeButton");
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikeReview).toHaveBeenCalledTimes(1);
    });

    it("should handle edit button", () => {
        const spyPush = jest.spyOn(history, "push");

        reviewDetail = makeReviewDetail(stubInitialState, { me: { id: 1 } });
        const component = mount(reviewDetail);
        component.find("ReviewDetail").instance().setState({ author: { id: 1 } });
        component.update();
        const button = component.find(".review-extra .edit-button").hostNodes();
        button.simulate("click");
        component.update();
        expect(spyPush).toHaveBeenCalledTimes(1);
    });

    it("should not render edit button when user is not author", () => {
        reviewDetail = makeReviewDetail(stubInitialState, { me: { id: 1 } });
        const component = mount(reviewDetail);
        component.find("ReviewDetail").instance().setState({ author: { id: 2 } });
        component.update();
        const button = component.find(".review-extra .edit-button").hostNodes();
        expect(button.length).toBe(0);
    });


    it("should handle delete button", () => {
        const spyOnDeleteReview = jest.spyOn(reviewActions, "deleteReview")
            .mockImplementation(() => () => mockPromise);

        reviewDetail = makeReviewDetail(stubInitialState, { me: { id: 1 } });
        const component = mount(reviewDetail);
        component.find("ReviewDetail").instance().setState({ author: { id: 1 } });
        component.update();
        const button = component.find(".review-extra .delete-button").hostNodes();
        button.simulate("click");
        expect(spyOnDeleteReview).toHaveBeenCalledTimes(1);
    });

    it("should handle add button", () => {
        reviewDetail = makeReviewDetail(stubInitialState);
        const component = mount(reviewDetail);
        const spyClickAdd = jest.spyOn(replyActions, "makeNewReplyReview")
            .mockImplementation(() => () => mockPromise);
        component.find("ReviewDetail").instance().setState({ newReply: "afdaf" });
        component.update();
        const button = component.find(".new-reply .new-reply-button").hostNodes();
        button.simulate("click");

        expect(spyClickAdd).toHaveBeenCalledTimes(1);
    });

    it("should handle replies well repeatedly", async () => {
        stubInitialState = {
            ...stubInitialState,
            reply: {
                ...stubInitialState.reply,
                list: {
                    ...stubInitialState.reply.list,
                    pageNum: 1,
                    list: [], // actually, we don't have to really give some replies for this test
                    finished: false,
                },
            },
        };
        const component = mount(makeReviewDetail(stubInitialState));
        const instance = component.find("ReviewDetail").instance();
        instance.setState(
            {
                replyFinished: false,
                replyPageCount: 2,
                replies: [{
                    id: 4,
                    user: {
                        username: "afdaf",
                    },
                    count: {
                        likes: 0,
                    },
                }],
            },
        );
        component.update();
        const spyHandleReplies = jest.spyOn(instance, "handleReplies");
        const spyForEach = jest.spyOn(instance, "forEachHandleReply");

        expect(instance.state.replyPageCount).toBe(2);

        instance.handleReplies();
        await flushPromises();
        component.update();
        expect(spyGetReplies).toBeCalledTimes(3);
        expect(spyHandleReplies).toBeCalledTimes(1);
        expect(spyForEach).toBeCalledTimes(2);
    });

    it("should handle click more button", async () => {
        stubInitialState = {
            ...stubInitialState,
            reply: {
                ...stubInitialState.reply,
                list: {
                    ...stubInitialState.reply.list,
                    pageNum: 2,
                    list: [], // actually, we don't have to really give some replies for this test
                    finished: true,
                },
            },
        };
        const component = mount(makeReviewDetail(stubInitialState));
        const instance = component.find("ReviewDetail").instance();
        instance.setState(
            {
                replyFinished: false,
                replyPageCount: 1,
                replies: [],
            },
        );
        component.update();
        const button = component.find(".reply-more-button").hostNodes();
        expect(button.length).toBe(1);
        button.simulate("click");

        await flushPromises();
        expect(spyGetReplies).toBeCalledTimes(2);
        expect(instance.state.replyPageCount).toBe(2);
        expect(instance.state.replyFinished).toBe(true);
    });

    it("should handle anonymous", () => {
        stubInitialState = {
            ...stubInitialState,
            review: {
                ...stubInitialState.review,
                selected: {
                    status: reviewStatus.REVIEW_NOT_EXIST,
                    review: { id: 1, is_anonymous: true },
                    error: null,
                    replies: [],
                },
            },
        };
        const component = mount(makeReviewDetail(stubInitialState));
        const author = component.find(".author");
        expect(author.text()).toBe("Anonymous User");
    });
});
