import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import CollectionList from "./CollectionList";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";

const stubInitialState = {
    paper: {
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
    },
};

const mockStore = getMockStore(stubInitialState);

describe("<CollectionList />", () => {
    let collectionList; let
        spyGetCollections;

    beforeEach(() => {
        collectionList = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                          path="/"
                          exact
                          render={() => (
                              <div>
                                  <CollectionList />
                              </div>
                          )}
                        />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyGetCollections = jest.spyOn(collectionActions, "getCollectionsByUserId")
            .mockImplementation(() => () => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render well", () => {
        const component = mount(collectionList);
        const wrapper = component.find("CollectionList");
        expect(wrapper.length).toBe(1);
        expect(spyGetCollections).toHaveBeenCalledTimes(1);
        const left = wrapper.find("#collectionCardsLeft");
        expect(left.length).toBe(1);
        const right = wrapper.find("#collectionCardsRight");
        expect(right.length).toBe(1);
    });

    it("should make cards well", () => {
        const wrapper = mount(collectionList);
        const component = wrapper.find("CollectionList");

        component.instance().setState(
            {
                collections: [
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
            },
        );

        wrapper.update();
        const wrapperLeft = wrapper.find("#collectionCardsLeft");
        const wrapperRight = wrapper.find("#collectionCardsRight");
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);
    });
});
