import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { collectionActions } from "../../../store/actions";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import CollectionDetail from "./CollectionDetail";


/* eslint-disable react/jsx-props-no-spreading */
const makeCollectionDetail = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <ConnectedRouter history={createBrowserHistory()}>
            <Switch>
                <Route
                  path="/"
                  exact
                  render={() => (
                      <div>
                          <CollectionDetail location={{ pathname: "/paper_id=1" }} {...props} />
                      </div>
                  )}
                />
            </Switch>
        </ConnectedRouter>
    </Provider>
);
/* eslint-enable react/jsx-props-no-spreading */

const mockPromise = new Promise((resolve) => { resolve(); });

describe("CollectionDetail Test", () => {
    let stubInitialState;
    let collectionDetail;
    let spyGetCollection;
    let spyGetCollectionPapers;
    let spyLikeCollection;
    let spyUnlikeCollection;

    beforeEach(() => {
        stubInitialState = {
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
            review: {},
            user: {},
        };
        collectionDetail = makeCollectionDetail(stubInitialState);
        spyGetCollection = jest.spyOn(collectionActions, "getCollection")
            .mockImplementation(() => () => mockPromise);
        spyGetCollectionPapers = jest.spyOn(collectionActions, "getCollectionPapers")
            .mockImplementation(() => () => mockPromise);
        spyLikeCollection = jest.spyOn(collectionActions, "likeCollection")
            .mockImplementation(() => () => mockPromise);
        spyUnlikeCollection = jest.spyOn(collectionActions, "unlikeCollection")
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

    it("should call likeReview when Like Button is clicked", () => {
        const component = mount(collectionDetail);
        const wrapper = component.find(".like-button").hostNodes();
        expect(wrapper.length).toBe(1);

        wrapper.simulate("click");

        expect(spyLikeCollection).toHaveBeenCalledTimes(1);
    });

    it("should call unlikeReview when IsLiked and Like Button is clicked", () => {
        const component = mount(collectionDetail);
        const instance = component.find(CollectionDetail.WrappedComponent).instance();
        instance.setState({ isLiked: true });
        component.update();

        const wrapper = component.find(".like-button").hostNodes();
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

    it("should show replies well", () => {
        const component = mount(collectionDetail);
        const instance = component.find("CollectionDetail").instance();
        instance.setState(
            {
                replies: [
                    {
                        content: "reply1",
                    },
                    {
                        content: "reply2",
                    },
                ],
            },
        );
        component.update();

        const wrapper = component.find("Reply");
        expect(wrapper.length).toBe(2);
    });
});
