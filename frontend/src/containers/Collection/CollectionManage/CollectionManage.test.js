import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { createBrowserHistory } from "history";
import CollectionManage from "./CollectionManage";
import { collectionStatus } from "../../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../../test-utils/mocks";
import { collectionActions } from "../../../store/actions";

const makeCollectionManage = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <ConnectedRouter history={createBrowserHistory()}>
            <CollectionManage location={{ pathname: "/collection_id=1/manage/" }} />
        </ConnectedRouter>
    </Provider>
);

describe("CollectionManage test", () => {
    let collectionManage;
    let stubInitialState;
    let spyGetCollection;
    let spySetTitleAndDescription;
    let spyDeleteCollection;

    beforeEach(() => {
        stubInitialState = {
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
                    collection: {
                        id: 1,
                        title: "test collection",
                        user: "test user",
                        numPapers: 14,
                        numReplies: 15,
                        count: {
                            users: 0,
                            papers: 0,
                        },
                        owned: true,
                    },
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
            user: {
                getFollowers: {},
                getFollowings: {},
                search: {},
            },
            review: {},
            reply: {},
        };
        collectionManage = makeCollectionManage(stubInitialState);
        spyGetCollection = jest.spyOn(collectionActions, "getCollection")
            .mockImplementation(() => () => mockPromise);
        spySetTitleAndDescription = jest.spyOn(collectionActions, "setTitleAndDescription")
            .mockImplementation(() => () => mockPromise);
        spyDeleteCollection = jest.spyOn(collectionActions, "deleteCollection")
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
                        owned: true,
                    },
                },
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

        const component = mount(makeCollectionManage(stubInitialState));
        const wrapper = component.find(".CollectionManage");
        expect(wrapper.length).toBe(1);
        expect(spyGetCollection).toHaveBeenCalledTimes(1);

        await flushPromises(); // flush onGetCollection
        component.update();

        const instance = component.find(CollectionManage.WrappedComponent).instance();
        expect(instance.state.collectionName).toBe("test collection");
        expect(instance.state.collectionDescription).toBe("test description");
    });

    it("should handle edit collection title and description", () => {
        const component = mount(collectionManage);

        // change title
        let wrapper = component.find("#editName").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "asdf" } });
        // change description
        wrapper = component.find("#editDescription").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "qwer" } });
        // they should be changed well
        const instance = component.find(CollectionManage.WrappedComponent).instance();
        expect(instance.state.collectionName).toBe("asdf");
        expect(instance.state.collectionDescription).toBe("qwer");

        wrapper = component.find("#UpdateCollectionButton").hostNodes();
        wrapper.simulate("click");
        expect(spySetTitleAndDescription).toHaveBeenCalledTimes(1);
    });

    // more tests should be implemented
    it("should call deleteCollection when deleting", async () => {
        const component = mount(collectionManage);
        let wrapper = component.find(".WarningModal #modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find(".WarningModal #confirmButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        await flushPromises();

        expect(spyDeleteCollection).toHaveBeenCalledTimes(1);
    });
});
