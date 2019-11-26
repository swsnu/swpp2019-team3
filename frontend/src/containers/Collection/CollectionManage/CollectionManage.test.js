import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { createBrowserHistory } from "history";
import CollectionManage from "./CollectionManage";
import { collectionStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
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
                    },
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
        collectionManage = makeCollectionManage(stubInitialState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", async () => {
        const spyGetCollection = jest.spyOn(collectionActions, "getCollection")
            // eslint-disable-next-line no-unused-vars
            .mockImplementation(() => () => new Promise((resolve, reject) => { resolve(); }));

        stubInitialState = {
            ...stubInitialState,
            collection: {
                selected: {
                    status: collectionStatus.SUCCESS,
                    title: "test collection",
                    text: "test description",
                },
            },
        };

        const component = mount(collectionManage);
        const wrapper = component.find(".CollectionManage");
        expect(wrapper.length).toBe(1);

        const flushPromises = () => new Promise(setImmediate);
        await flushPromises();

        expect(spyGetCollection).toHaveBeenCalledTimes(1);
    });

    it("should handle edit collection title and description", () => {
        const component = mount(collectionManage);
        const spySetTitleAndDescription = jest.spyOn(collectionActions, "setTitleAndDescription")
            // eslint-disable-next-line no-unused-vars
            .mockImplementation(() => () => new Promise((resolve, reject) => { resolve(); }));

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
});
