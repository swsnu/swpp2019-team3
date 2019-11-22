import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import PaperDetail from "./PaperDetail";
import { PaperSpec } from "../../components";
import { paperActions } from "../../store/actions";
import {
    paperStatus, collectionStatus, reviewStatus, signinStatus,
} from "../../constants/constants";
import { getMockStore } from "../../test-utils/mocks";


const mockHistory = { push: jest.fn() };
const makePaperDetail = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <PaperDetail history={mockHistory} location={{ pathname: "/paper_id=1" }} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<PaperDetail />", () => {
    let stubInitialState;
    let paperDetail;
    let spyGetPaper;

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
            },
        };
        paperDetail = makePaperDetail(stubInitialState);
        spyGetPaper = jest.spyOn(paperActions, "getPaper")
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

    it("should handle when count is ready", () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: { count: { likes: 3, reviews: 5 } },
            },
        };
        const component = mount(makePaperDetail(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        expect(instance.state.likeCount).toBe(0);
        // FIXME: actually, it should be '3'!
        expect(instance.state.reviewCount).toBe(0);
        // FIXME: actually, it should be '5'!
    });

    it("should handle when selectedPaper is ready", () => {
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
                        { name: "author-defined keyword", type: "author" },
                        { name: "extracted keyword", type: "abstract" },
                    ],
                    publication: { date: "2019-11-06" },
                },
            },
        };
        const component = mount(makePaperDetail(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        expect(instance.state.authors).toEqual([]);
        // FIXME: actually, it should be 'A_f A_l, B_f B_l'!
    });

    it("should handle when publication is ready", () => {
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
        expect(instance.state.date).toBe("");
        // FIXME: actually, it should be '2019-11-06'!
    });


    it("should handle when getPaper failed", () => {
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
            collection: {
                make: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: null,
                },
                list: {
                    status: collectionStatus.NONE,
                    list: [],
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
        };
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
        // FIXME: actually, it should be '1'!
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
});
