import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import PaperDetail from "./PaperDetail";
import { PaperSpec } from "../../components";
import { paperActions, reviewActions } from "../../store/actions";
import {
    paperStatus, collectionStatus, reviewStatus, signinStatus,
} from "../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../test-utils/mocks";


const mockHistory = { push: jest.fn() };
const makePaperDetail = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <PaperDetail history={mockHistory} location={{ pathname: "/paper_id=1" }} />
    </Provider>
);

describe("<PaperDetail />", () => {
    let stubInitialState;
    let paperDetail;
    let spyGetPaper;
    let spyGetReviews;

    beforeEach(() => {
        stubInitialState = {
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {},
            },
            auth: {
                singinStatus: signinStatus.SUCCESS,
                me: null,
            },
            collection: {
                make: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: null,
                },
                list: {
                    status: collectionStatus.NONE,
                    list: [],
                    pageNum: 0,
                    finished: true,
                    error: null,
                },
                edit: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: null,
                },
                delete: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: null,
                },
                selected: {
                    status: collectionStatus.NONE,
                    error: null,
                    collection: {},
                    papers: [],
                    members: [],
                    replies: [],
                },
            },
            user: {},
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
                list: {
                    status: reviewStatus.NONE,
                    list: [],
                    pageNum: 0,
                    finished: true,
                    error: null,
                },
            },
            reply: {},
        };
        paperDetail = makePaperDetail(stubInitialState);
        spyGetPaper = jest.spyOn(paperActions, "getPaper")
            .mockImplementation(() => () => mockPromise);
        spyGetReviews = jest.spyOn(reviewActions, "getReviewsByPaperId")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors and call spyGetPaper", () => {
        const component = mount(paperDetail);
        const wrapper = component.find(".paperdetail-page");
        expect(wrapper.length).toBe(1);
        expect(spyGetPaper).toBeCalledTimes(1);
    });

    it("should handle when count is ready", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: { count: { likes: 3, reviews: 5 } },
            },
        };
        const component = mount(makePaperDetail(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        await flushPromises();
        expect(instance.state.likeCount).toBe(3);
        expect(instance.state.reviewCount).toBe(5);
    });

    it("should handle when selectedPaper is ready", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {
                    authors: [
                        { first_name: "A_f", last_name: "A_l" },
                        { first_name: "B_f", last_name: "B_l" },
                    ],
                    keywords: [
                        { id: 1, name: "author-defined keyword", type: "author" },
                        { id: 2, name: "extracted keyword", type: "abstract" },
                    ],
                    publication: { date: "2019-11-06" },
                },
            },
        };
        const component = mount(makePaperDetail(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        await flushPromises();
        expect(instance.state.authors).toEqual([
            { first_name: "A_f", last_name: "A_l" },
            { first_name: "B_f", last_name: "B_l" },
        ]);
    });

    it("should handle when publication is ready", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {
                    publication: { date: "2019-11-06" },
                },
            },
            user: {},
        };
        const component = mount(makePaperDetail(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        await flushPromises();
        expect(instance.state.date).toBe("2019-11-06");
    });


    it("should handle when getPaper failed", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.FAILURE,
                selectedPaper: {},
            },
            auth: {
                singinStatus: signinStatus.SUCCESS,
                me: null,
            },
            review: {
                list: {
                    status: reviewStatus.SUCCESS,
                },
            },
        };
        mount(makePaperDetail(stubInitialState));
        await flushPromises();
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
    });

    it("should make reviewCardsLeft and reviewCardsRight well", () => {
        const component = mount(makePaperDetail(stubInitialState));
        const paperDetailInstance = component.find(PaperDetail.WrappedComponent).instance();
        paperDetailInstance.setState(
            {
                reviews: [{
                    id: 1,
                    paper: {
                        id: 1,
                    },
                    user: {
                        username: "review_author_1",
                    },
                    title: "review_title_1",
                    date: "2019-11-09",
                    count: {
                        likes: 0,
                        replies: 0,
                    },
                }, {
                    id: 2,
                    paper: {
                        id: 2,
                    },
                    user: {
                        username: "review_author_2",
                    },
                    title: "review_title_2",
                    date: "2019-11-08",
                    count: {
                        likes: 0,
                        replies: 0,
                    },
                }],
            },
        );
        component.update();
        const wrapperLeft = component.find(".reviewcards-left");
        const wrapperRight = component.find(".reviewcards-right");
        expect(component.find("ReviewCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);
    });

    it("should give proper link to PaperSpec", () => {
        // if both urls exist, reflect download_url
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {
                    id: 1,
                    author: [{ id: 1 }],
                    file_url: "http://file_url",
                    download_url: "http://download_url",
                },
            },
        };
        paperDetail = makePaperDetail(stubInitialState);
        let component = mount(paperDetail);

        let instance = component.find(PaperSpec.WrappedComponent).instance();
        expect(instance.props.link).toEqual("http://download_url");

        // if only file_url exist, reflect it
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {
                    id: 1,
                    author: [{ id: 1 }],
                    file_url: "http://file_url",
                    download_url: "",
                },
            },
        };
        paperDetail = makePaperDetail(stubInitialState);
        component = mount(paperDetail);

        instance = component.find(PaperSpec.WrappedComponent).instance();
        expect(instance.props.link).toEqual("http://file_url");
    });

    it("should show more if review-more-button clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            review: {
                ...stubInitialState.review,
                list: {
                    status: reviewStatus.SUCCESS,
                    list: [],
                    pageNum: 1,
                    finished: false,
                },
            },
        };
        const component = mount(makePaperDetail(stubInitialState));

        expect(spyGetReviews).toBeCalledTimes(1);
        await flushPromises();
        component.update();

        const wrapper = component.find(".review-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyGetReviews).toBeCalledTimes(2);
        await flushPromises();
    });
});
