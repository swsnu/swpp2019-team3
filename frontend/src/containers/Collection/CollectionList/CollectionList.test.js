import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import CollectionList from "./CollectionList";
import { collectionStatus } from "../../../constants/constants";
import { collectionActions } from "../../../store/actions";
import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";
import { history } from "../../../store/store";

const makeCollectionList = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <ConnectedRouter history={history}>
            <CollectionList />
        </ConnectedRouter>
    </Provider>
);

describe("CollectionList test", () => {
    let stubInitialState;
    let collectionList;
    let spyGetCollections;

    beforeEach(() => {
        stubInitialState = {
            paper: {
            },
            auth: {
                me: { id: 1 },
            },
            collection: {
                make: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: null,
                },
                list: {
                    status: collectionStatus.NONE,
                    list: [
                        {
                            type: "Collection",
                            source: "liked",
                            id: 1,
                            title: "dfad",
                            user: "Dfafdaf",
                            numPapers: 14,
                            numReplies: 15,
                            count: {
                                users: 0,
                                papers: 0,
                            },
                        },
                        {
                            type: "Collection",
                            source: "liked",
                            id: 2,
                            title: "dfad",
                            user: "Dfafdaf",
                            numPapers: 14,
                            numReplies: 15,
                            count: {
                                users: 0,
                                papers: 0,
                            },
                        },
                        {
                            type: "Collection",
                            source: "liked",
                            id: 3,
                            title: "dfad",
                            user: "Dfafdaf",
                            numPapers: 14,
                            numReplies: 15,
                            count: {
                                users: 0,
                                papers: 0,
                            },
                        },
                        {
                            type: "Collection",
                            source: "liked",
                            id: 4,
                            title: "dfad",
                            user: "Dfafdaf",
                            numPapers: 14,
                            numReplies: 15,
                            count: {
                                users: 0,
                                papers: 0,
                            },
                        },
                    ],
                    error: null,
                },
                sharedList: {
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
            review: {},
            reply: {},
        };

        collectionList = makeCollectionList(stubInitialState);
        spyGetCollections = jest.spyOn(collectionActions, "getCollectionsByUserId")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render well", () => {
        const component = mount(collectionList);
        const wrapper = component.find("CollectionList");
        expect(wrapper.length).toBe(1);
        const wrapperLeft = wrapper.find("#collectionCardsLeft");
        const wrapperRight = wrapper.find("#collectionCardsRight");
        expect(wrapperLeft.length).toBe(1);
        expect(wrapperRight.length).toBe(1);

        expect(spyGetCollections).toHaveBeenCalledTimes(1);
    });

    it("should show more if collection-more-button clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            collection: {
                ...stubInitialState.collection,
                list: {
                    status: collectionStatus.SUCCESS,
                    list: [],
                    pageNum: 1,
                    finished: false,
                },
            },
        };
        const component = mount(makeCollectionList(stubInitialState));

        expect(spyGetCollections).toBeCalledTimes(1);
        await flushPromises();
        component.update();

        const wrapper = component.find(".collection-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        expect(spyGetCollections).toBeCalledTimes(2);
        await flushPromises();
    });
});
