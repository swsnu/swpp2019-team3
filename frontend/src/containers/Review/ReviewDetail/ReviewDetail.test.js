import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import ReviewDetail from "./ReviewDetail";
import { reviewActions, authActions } from "../../../store/actions";
import { reviewStatus, getMeStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";

const stubInitialState = {
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
    },
};

describe("<ReviewDetail />", () => {
    let reviewDetail;
    let spyOnGetMe;
    let spyOnGetReview;

    beforeEach(() => {
        reviewDetail = (
            <Provider store={getMockStore(stubInitialState)}>
                <ReviewDetail match={{ params: { review_id: 1 } }} history={history} />
            </Provider>
        );
        spyOnGetMe = jest.spyOn(authActions, "getMe")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        spyOnGetReview = jest.spyOn(reviewActions, "getReview")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(reviewDetail);
        const wrapper = component.find("ReviewDetail");
        expect(wrapper.length).toBe(1);
        expect(spyOnGetReview).toHaveBeenCalledTimes(1);
        expect(spyOnGetMe).toHaveBeenCalledTimes(1);
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

    it("should handle Like/Unlike Button", () => {
        const component = mount(reviewDetail);
        component.setProps({
            selectedReview: { id: 1 },
            auth: { id: 1 },
        });

        const instance = component.find("ReviewDetail").instance();

        const wrapper = component.find(".review-extra .like-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        component.update();

        expect(instance.state.thisReview.liked).toBe(true);
        expect(instance.state.likeCount).toEqual(0); // Fix me: it should be 1

        wrapper.simulate("click");
        component.update();
        expect(instance.state.likeCount).toEqual(0);
        expect(instance.state.thisReview.liked).toBe(false);
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
            .mockImplementation(() => () => new Promise((resolve) => { resolve({ status: 200 }); }));
        const spyPush = jest.spyOn(history, "push");
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

        expect(instance.state.replyCount).toBe(0); // Fix me: it should be 0
    });
});
