import ReviewReducer from "./review";
import { reviewStatus } from "../../../constants/constants";
import { reviewConstants } from "../../actions/actionTypes";

const stubInitialState = {
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
        review: {},
        error: null,
        replies: [],
    },
};

const stubReview = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    title: "SWPP",
    text: "SWPP2019fall",
};

describe("Colelction ReviewReducer", () => {
    it("should return defualt state", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: "Abc",
            target: "fddf",
        });
        expect(newState).toEqual(stubInitialState);
    });

    it("should return add_review state", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.ADD_REVIEW,
            target: stubReview,
        });
        expect(newState.make.status).toBe(reviewStatus.SUCCESS);
        expect(newState.make.review).toBe(stubReview);
    });

    it("should return add_review_failure_missing_param", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.ADD_REVIEW_FAILURE_MISSING_PARAM,
            target: stubReview,
        });
        expect(newState.make.status).toBe(reviewStatus.MISSING_PARAM);
        expect(newState.make.error).toBe(stubReview);
    });

    it("should return add_review_failure_paper_not_exist", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.ADD_REVIEW_FAILURE_PAPER_NOT_EXIST,
            target: stubReview,
        });
        expect(newState.make.status).toBe(reviewStatus.PAPER_NOT_EXIST);
        expect(newState.make.error).toBe(stubReview);
    })

    it("should return get_reviews_by_paper", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.GET_REVIEWS_BY_PAPER,
            target: stubReview,
        });
        expect(newState.list.status).toBe(reviewStatus.SUCCESS);
        expect(newState.list.list).toBe(stubReview);
    });

    it("should return get_reviews_by_user", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.GET_REVIEWS_BY_USER,
            target: stubReview,
        });
        expect(newState.list.status).toBe(reviewStatus.SUCCESS);
        expect(newState.list.list).toBe(stubReview);
    });

    it("should return get_review", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.GET_REVIEW,
            target: stubReview,
        });
        expect(newState.selected.status).toBe(reviewStatus.SUCCESS);
        expect(newState.selected.review).toBe(stubReview);
    });

    it("should return get_review_failure_review_not_exist", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.GET_REVIEW_FAILURE_REVIEW_NOT_EXIST,
            target: stubReview,
        });
        expect(newState.selected.status).toBe(reviewStatus.REVIEW_NOT_EXIST);
        expect(newState.selected.error).toBe(stubReview);
    });

    it("should return edit_review", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.EDIT_REVIEW,
            target: stubReview,
        });
        expect(newState.edit.status).toBe(reviewStatus.SUCCESS);
        expect(newState.edit.review).toBe(stubReview);
    });

    it("should return edit_review_papers_failure_review_not_exist", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.EDIT_REVIEW_FAILURE_REVIEW_NOT_EXIST,
            target: stubReview,
        });
        expect(newState.edit.status).toBe(reviewStatus.REVIEW_NOT_EXIST);
        expect(newState.edit.error).toBe(stubReview);
    });


    it("should return edit_review_failure_review_auth_error", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.EDIT_REVIEW_FAILURE_AUTH_ERROR,
            target: stubReview,
        });
        expect(newState.edit.status).toBe(reviewStatus.AUTH_ERROR);
        expect(newState.edit.error).toBe(stubReview);
    });

    it("should return delete_reviewr", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.DEL_REVIEW,
            target: stubReview,
        });
        expect(newState.delete.status).toBe(reviewStatus.SUCCESS);
        expect(newState.delete.review).toBe(stubReview);
    });

    it("should return delete_review_failure_auth_error", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.DEL_REVIEW_FAILURE_AUTH_ERROR,
            target: stubReview,
        });
        expect(newState.delete.status).toBe(reviewStatus.AUTH_ERROR);
        expect(newState.delete.error).toBe(stubReview);
    });


    it("should return delete_review_failure_not_exist", () => {
        const newState = ReviewReducer(stubInitialState, {
            type: reviewConstants.DEL_REVIEW_FAILURE_REVIEW_NOT_EXIST,
            target: stubReview,
        });
        expect(newState.delete.status).toBe(reviewStatus.REVIEW_NOT_EXIST);
        expect(newState.delete.error).toBe(stubReview);
    });
});
