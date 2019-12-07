import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { createBrowserHistory } from "history";
import { collectionActions, replyActions } from "../../../store/actions";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";
import CollectionDetail from "./CollectionDetail";


/* eslint-disable react/jsx-props-no-spreading */
const makeCollectionDetail = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <ConnectedRouter history={createBrowserHistory()}>
            <CollectionDetail location={{ pathname: "/paper_id=1" }} {...props} />
        </ConnectedRouter>
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

describe("CollectionDetail Test", () => {
    let stubInitialState;
    let collectionDetail;
    let spyGetCollection;
    let spyGetCollectionPapers;
    let spyLikeCollection;
    let spyUnlikeCollection;
    let spyGetCollectionMembers;
    let spyGetRepliesByCollection;

    beforeEach(() => {
        stubInitialState = {
            paper: {
            },
            auth: {
                singinStatus: signinStatus.SUCCESS,
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
                getMembers: {
                    status: collectionStatus.NONE,
                    members: [],
                    pageNum: 0,
                    finished: true,
                    error: null,
                },
            },
            review: {},
            user: {
                getFollowings: {},
                search: {},
            },
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
        collectionDetail = makeCollectionDetail(stubInitialState);
        spyGetCollection = jest.spyOn(collectionActions, "getCollection")
            .mockImplementation(() => () => mockPromise);
        spyGetCollectionMembers = jest.spyOn(collectionActions, "getCollectionMembers")
            .mockImplementation(() => () => mockPromise);
        spyGetCollectionPapers = jest.spyOn(collectionActions, "getCollectionPapers")
            .mockImplementation(() => () => mockPromise);
        spyLikeCollection = jest.spyOn(collectionActions, "likeCollection")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeCollection = jest.spyOn(collectionActions, "unlikeCollection")
            .mockImplementation(() => () => mockPromise);
        spyGetRepliesByCollection = jest.spyOn(replyActions, "getRepliesByCollection")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                me: {
                    id: 1,
                    username: "test1",
                    description: "asdf",
                },
            },
            collection: {
                selected: {
                    status: collectionStatus.SUCCESS,
                    collection: {
                        title: "test collection",
                        text: "test description",
                        creation_date: "2019-11-26T11:59:41.126",
                        modification_date: "2019-11-26T11:59:41.126",
                        count: {},
                    },
                },
                like: {},
                unlike: {},
                getMembers: {
                    status: collectionStatus.SUCCESS,
                    members: [
                        {
                            id: 1,
                            username: "test1",
                            description: "asdf",
                            collection_user_type: "owner",
                        },
                        {
                            id: 2,
                            username: "test2",
                            description: "qwer",
                            ollection_user_type: "member",
                        },
                    ],
                    pageNum: 1,
                    finished: true,
                    error: null,
                },
            },
        };

        const component = mount(makeCollectionDetail(stubInitialState));
        const wrapper = component.find(".CollectionDetail");
        expect(wrapper.length).toBe(1);
        expect(spyGetCollection).toHaveBeenCalledTimes(1);

        await flushPromises(); // flush onGetCollection
        await flushPromises(); // flush onGetMembers
        await flushPromises(); // flush onGetCollectionPapers
        await flushPromises(); // flush onGetReplies

        expect(spyGetCollection).toHaveBeenCalledTimes(1);
        expect(spyGetCollectionMembers).toHaveBeenCalledTimes(1);
        expect(spyGetCollectionPapers).toHaveBeenCalledTimes(1);
        expect(spyGetRepliesByCollection).toHaveBeenCalledTimes(1);
    });

    it("should call likeReview when Like Button is clicked", () => {
        const component = mount(collectionDetail);
        const wrapper = component.find("#LikeButton").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeCollection).toHaveBeenCalledTimes(1);
    });

    it("should call unlikeReview when IsLiked and Like Button is clicked", () => {
        const component = mount(collectionDetail);
        const instance = component.find(CollectionDetail.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find("#LikeButton").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyUnlikeCollection).toHaveBeenCalledTimes(1);
    });

    it("reply textbox test", () => {
        const component = mount(collectionDetail);
        const wrapper = component.find("#newReplyContentInput");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "Hello" } });
        const instance = component.find("CollectionDetail").instance();
        expect(instance.state.newReplyContent).toBe("Hello");
    });

    it("should not render paper cards if no papers in the collection", () => {
        const component = mount(collectionDetail);
        let wrapper = component.find("#paperCardsLeft");
        expect(wrapper.length).toBe(0);
        wrapper = component.find("#paperCardsRight");
        expect(wrapper.length).toBe(0);
        wrapper = component.find("#noPapersText");
        expect(wrapper.length).toBe(1);
    });

    it("should show paper cards well", () => {
        const component = mount(collectionDetail);
        const instance = component.find("CollectionDetail").instance();
        instance.setState(
            {
                papers: [
                    {
                        type: "Paper",
                        source: "liked",
                        id: 1,
                        title: "dfad",
                        user: "Dfafdaf",
                        liked: true,
                        count: { likes: 1 },
                    }, {
                        type: "Paper",
                        source: "liked",
                        id: 2,
                        title: "dfad",
                        user: "Dfafdaf",
                        liked: true,
                        count: { likes: 1 },
                    },
                    {
                        type: "Paper",
                        source: "liked",
                        id: 3,
                        title: "dfad",
                        user: "Dfafdaf",
                        liked: true,
                        count: { likes: 1 },
                    }, {
                        type: "Paper",
                        source: "liked",
                        id: 4,
                        title: "dfad",
                        user: "Dfafdaf",
                        liked: true,
                        count: { likes: 1 },
                    }],
            },
        );
        component.update();

        const wrapperLeft = component.find("#paperCardsLeft");
        const wrapperRight = component.find("#paperCardsRight");
        expect(wrapperLeft.length).toBe(1);
        expect(wrapperRight.length).toBe(1);
    });

    it("should show replies well", () => {
        const component = mount(collectionDetail);
        const instance = component.find("CollectionDetail").instance();
        instance.setState(
            {
                replies: [
                    {
                        id: 1,
                        content: "reply1",
                        user: {
                            username: "affd",
                        },
                        count: {
                            likes: 0,
                        },
                    },
                    {
                        id: 2,
                        content: "reply2",
                        user: {
                            username: "affd",
                        },
                        count: {
                            likes: 0,
                        },
                    },
                ],
            },
        );
        component.update();

        const wrapper = component.find("Reply");
        expect(wrapper.length).toBe(2);
    });

    it("should handle replies well repeatedly", async () => {
        stubInitialState = {
            ...stubInitialState,
            reply: {
                ...stubInitialState.reply,
                list: {
                    ...stubInitialState.reply.list,
                    pageNum: 1,
                    list: [{
                        id: 1,
                        user: {
                            username: "afdaf",
                        },
                        count: {
                            likes: 0,
                        },
                    },
                    {
                        id: 2,
                        user: {
                            username: "afdaf",
                        },
                        count: {
                            likes: 0,
                        },
                    },
                    {
                        id: 3,
                        user: {
                            username: "afdaf",
                        },
                        count: {
                            likes: 0,
                        },
                    }],
                    finished: false,
                },
            },
        };
        const component = mount(makeCollectionDetail(stubInitialState));
        const instance = component.find("CollectionDetail").instance();
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
        expect(spyGetRepliesByCollection).toBeCalledTimes(3);
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
                    list: [{
                        id: 3,
                        user: {
                            username: "afdaf",
                        },
                        count: {
                            likes: 0,
                        },
                    }],
                    finished: true,
                },
            },
        };
        const component = mount(makeCollectionDetail(stubInitialState));
        const instance = component.find("CollectionDetail").instance();
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
        expect(spyGetRepliesByCollection).toBeCalledTimes(2);
        expect(instance.state.replyPageCount).toBe(2);
        expect(instance.state.replyFinished).toBe(true);
    });
});
