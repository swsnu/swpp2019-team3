import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { collectionActions } from "../../../store/actions";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";
import CollectionDetail from "./CollectionDetail";

const stubInitialState = {
    paper: {
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
    review: {},
};

const mockStore = getMockStore(stubInitialState);
const mockPromise = new Promise((resolve) => { resolve(); });

describe("CollectionDetail Test", () => {
    let collectionDetail; let spyGetCollection; let
        spyGetCollectionPapers;

    beforeEach(() => {
        collectionDetail = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                          path="/"
                          exact
                          render={() => (
                              <div>
                                  <CollectionDetail location={{ pathname: "/paper_id=1" }} />
                              </div>
                          )}
                        />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyGetCollection = jest.spyOn(collectionActions, "getCollection")
            .mockImplementation(() => () => mockPromise);
        spyGetCollectionPapers = jest.spyOn(collectionActions, "getCollectionPapers")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        // eslint-disable-next-line no-unused-vars
        const component = mount(collectionDetail);
        expect(spyGetCollection).toHaveBeenCalledTimes(1);
        expect(spyGetCollectionPapers).toHaveBeenCalledTimes(1);
    });

    it("Button should be changed", () => {
        const component = mount(collectionDetail);
        let wrapper = component.find("#likeButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find("#unlikeButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        wrapper = component.find("#likeButton").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("reply textbox test", () => {
        const component = mount(collectionDetail);
        const wrapper = component.find("#newReplyContentInput");
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "Hello" } });
        const instance = component.find("CollectionDetail").instance();
        expect(instance.state.newReplyContent).toBe("Hello");
    });

    it("shows edit button only if I am the member", () => {
        const component = mount(collectionDetail);
        component.find("CollectionDetail").instance().setState({
            thisCollection: {
                papers: [], members: [], replies: [], amIMember: true,
            },
        });
        component.update();
        let wrapper = component.find("#editButtonLink").hostNodes();
        expect(wrapper.length).toBe(1);

        component.find("CollectionDetail").instance().setState({
            thisCollection: {
                papers: [], replies: [], members: [], amIMember: false,
            },
        });
        component.update();
        wrapper = component.find("#editButtonLink").hostNodes();
        expect(wrapper.length).toBe(0);
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

        const wrapperLeft = component.find("#paperCardsLeft");
        const wrapperRight = component.find("#paperCardsRight");
        expect(wrapperLeft.length).toBe(1);
        expect(wrapperRight.length).toBe(1);
    });
});
