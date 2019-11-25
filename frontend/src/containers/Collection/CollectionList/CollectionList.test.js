import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import CollectionList from "./CollectionList";
// import { collectionActions, authActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";

const stubInitialState = {
    paper: {
    },
    auth: {
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

const mockStore = getMockStore(stubInitialState);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("CollectionList test", () => {
    let collectionList;

    beforeEach(() => {
        collectionList = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <CollectionList />
                </ConnectedRouter>
            </Provider>
        );
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
    });

    // it("componentDidMount test", () => {
    //     const spyGetCollections = jest.spyOn(collectionActions, "getCollectionsByUserId")
    //         .mockImplementation(() => () => mockPromise);
    //     const spyGetMe = jest.spyOn(authActions, "getMe")
    //         .mockImplementation(() => () => mockPromise);

    //     const component = mount(collectionList);
    //     const wrapper = component.find("CollectionList");
    //     expect(wrapper.length).toBe(1);
    //     expect(spyGetMe).toHaveBeenCalledTimes(1);
    //     expect(spyGetMe.then(() => spyGetCollections)).toHaveBeenCalledTimes(1);
    // });
});
