import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import SearchResult from "./SearchResult";
import { paperActions, collectionActions, userActions } from "../../store/actions";
import {
    paperStatus, collectionStatus,
} from "../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../test-utils/mocks";


const mockHistory = { push: jest.fn() };
const makeSearchResult = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <SearchResult history={mockHistory} location={{ pathname: "/search=abc" }} />
    </Provider>
);

describe("<SearchResult />", () => {
    let stubInitialState;
    let searchResult;
    let spySearchPaper;
    let spySearchCollection;
    let spySearchUser;

    beforeEach(() => {
        stubInitialState = {
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {},
                search: {
                    status: paperStatus.NONE,
                    papers: [],
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
        searchResult = makeSearchResult(stubInitialState);
        spySearchPaper = jest.spyOn(paperActions, "searchPaper")
            .mockImplementation(() => () => mockPromise);
        spySearchCollection = jest.spyOn(collectionActions, "searchCollection")
            .mockImplementation(() => () => mockPromise);
        spySearchUser = jest.spyOn(userActions, "searchUser")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors and call searchPaper,Collection,User", () => {
        const component = mount(searchResult);
        const wrapper = component.find(".search-result");
        expect(wrapper.length).toBe(1);
        expect(spySearchPaper).toBeCalledTimes(1);
        expect(spySearchCollection).toBeCalledTimes(1);
        expect(spySearchUser).toBeCalledTimes(1);
    });

    it("should make paperCards well", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: [],
                search: {
                    status: paperStatus.NONE,
                    papers: [{
                        id: 1, title: "a", abstract: "b", count: {}, source: "arxiv",
                    },
                    {
                        id: 2, title: "a", abstract: "b", count: {}, source: "arxiv",
                    },
                    {
                        id: 3, title: "a", abstract: "b", count: {}, source: "crossref",
                    }],
                    pageNum: 0,
                    finished: true,
                },
            },
        };
        const component = mount(makeSearchResult(stubInitialState));
        await flushPromises();
        component.update();

        const wrapperLeft = component.find("#paper-cards-left");
        const wrapperRight = component.find("#paper-cards-right");
        expect(component.find("PaperCard").length).toBe(3);
        expect(wrapperLeft.children().length).toBe(2);
        expect(wrapperRight.children().length).toBe(1);
    });

    it("should make collectionCards and reviewCards well", () => {
        const component = mount(makeSearchResult(stubInitialState));
        const instance = component.find(SearchResult.WrappedComponent).instance();
        instance.setState(
            {
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
                users: [{
                    id: 1,
                    username: "girin",
                    email: "swpp@snu.ac.kr",
                    description: "",
                    doIFollow: true,
                    count: {
                        follower: 100,
                        following: 50,
                    },
                }, {
                    id: 2,
                    username: "ggirin",
                    email: "sswpp@snu.ac.kr",
                    description: "",
                    doIFollow: false,
                    count: {
                        follower: 100,
                        following: 50,
                    },
                },
                ],
            },
        );
        component.update();

        let wrapperLeft = component.find("#collection-cards-left");
        let wrapperRight = component.find("#collection-cards-right");
        expect(component.find("CollectionCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);

        wrapperLeft = component.find("#user-cards-left");
        wrapperRight = component.find("#user-cards-right");
        expect(component.find("UserCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);
    });

    it("should show more if paper-more-button clicked", async () => {
        stubInitialState = {
            ...stubInitialState,
            paper: {
                getPaperStatus: paperStatus.NONE,
                selectedPaper: {},
                search: {
                    status: paperStatus.NONE,
                    papers: [],
                    pageNum: 1,
                    finished: false,
                },
            },
        };
        const component = mount(makeSearchResult(stubInitialState));

        await flushPromises();
        component.update();

        const wrapper = component.find(".paper-more-button").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();
    });
});
