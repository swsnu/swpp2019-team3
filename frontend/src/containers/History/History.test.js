/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import History from "./History";
import { paperActions, collectionActions, reviewActions } from "../../store/actions";
import {
    paperStatus, collectionStatus, reviewStatus,
} from "../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../test-utils/mocks";
import { history } from "../../store/store";
// 

const makeHistory = (initialState, props = {}) => (
    <Router location={{ state: "paperTab" }} history={history}>
        <Provider store={getMockStore(initialState)}>
            <History history={history} {...props} />
        </Provider>
    </Router>
);

describe("<History />", () => {
    let stubInitialState;
    let spyGetCollectionLike;
    let spyGetReviewLike;
    let spyGetPaperLike;
    let thisHistory;

    beforeEach(() => {
        stubInitialState = {
            paper: {
                getLikedPapers: {
                    status: paperStatus.NONE,
                    list: [],
                    pageNum: 0,
                    finished: true,
                },
            },
            auth: {},
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
                    pageNum: 0,
                    finished: true,
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
            user: {},
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
                    pageNum: 0,
                    finished: true,
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
            reply: {},
        };
        thisHistory = makeHistory(stubInitialState);
        spyGetPaperLike = jest.spyOn(paperActions, "getPaperLike")
            .mockImplementation(() => () => mockPromise);
        spyGetCollectionLike = jest.spyOn(collectionActions, "getCollectionLike")
            .mockImplementation(() => () => mockPromise);
        spyGetReviewLike = jest.spyOn(reviewActions, "getReviewLike")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors and call Paper,Collection,Review", () => {
        const component = mount(thisHistory);
        const wrapper = component.find(".history");
        expect(wrapper.length).toBe(1);
        expect(spyGetCollectionLike).toBeCalledTimes(1);
        expect(spyGetReviewLike).toBeCalledTimes(1);
        expect(spyGetPaperLike).toBeCalledTimes(1);
    });

    it("should make cards", () => {
        const component = mount(makeHistory(stubInitialState));
        const instance = component.find(History.WrappedComponent).instance();
        instance.setState(
            {
                papers: [{
                    id: 1,
                    title: "dfad",
                    user: "Dfafdaf",
                    liked: true,
                    count: { likes: 1 },
                }, {
                    id: 2,
                    title: "dfad",
                    user: "Dfafdaf",
                    liked: true,
                    count: { likes: 1 },
                },
                ],
                collections: [{
                    id: 1,
                    title: "dfad",
                    user: "Dfafdaf",
                    count: {
                        users: 0,
                        papers: 0,
                    },
                }, {
                    id: 2,
                    title: "dfad",
                    user: "Dfafdaf",
                    count: {
                        users: 0,
                        papers: 0,
                    },
                },
                ],
                reviews: [{
                    id: 1,
                    title: "dfad",
                    user: {
                        usernae: "Dfafdaf",
                    },
                    count: {
                        users: 0,
                        papers: 0,
                    },
                }, {
                    id: 2,
                    title: "dfad",
                    user: {
                        usernae: "Dfafdaf",
                    },
                    count: {
                        users: 0,
                        papers: 0,
                    },
                },
                ],
            },
        );
        component.update();
        let wrapperLeft = component.find(".paper-cards-left");
        let wrapperRight = component.find(".paper-cards-right");
        expect(component.find("PaperCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);

        wrapperLeft = component.find(".collection-cards-left");
        wrapperRight = component.find(".collection-cards-right");
        expect(component.find("CollectionCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);

        wrapperLeft = component.find(".review-cards-left");
        wrapperRight = component.find(".review-cards-right");
        expect(component.find("ReviewCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);
    });

    it("should show more if more-buttons clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getLikedPapers: {
                    status: paperStatus.NONE,
                    list: [],
                    pageNum: 1,
                    finished: false,
                },
            },
            collection: {
                list: {
                    status: collectionStatus.NONE,
                    list: [],
                    error: null,
                    pageNum: 1,
                    finished: false,
                },
            },
            review: {
                list: {
                    status: reviewStatus.NONE,
                    list: [],
                    error: null,
                    pageNum: 1,
                    finished: false,
                },
            },
        };
        const component = mount(makeHistory(stubInitialState));

        await flushPromises();
        component.update();

        let wrapper = component.find(".paper-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();

        wrapper = component.find(".review-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();

        wrapper = component.find(".collection-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();
    });
});
