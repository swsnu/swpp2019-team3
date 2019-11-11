import React from "react";
import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { getMockStore } from "../../test-utils/mocks";
import Main from "./Main";
import { collectionStatus, signinStatus } from "../../constants/constants";
import { history } from "../../store/store";


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
    user: {},
};

const mockStore = getMockStore(stubInitialState);

describe("<Main />", () => {
    let main;

    beforeEach(() => {
        main = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                          path="/"
                          exact
                          render={() => (
                              <div>
                                  <Main location={{ pathname: "/paper_id=1" }} />
                              </div>
                          )}
                        />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = shallow(<Main />);
        const wrapper = component.find(".main");
        expect(wrapper.length).toBe(1);
    });

    it("should make feedsLeft and feedsRight well", () => {
        const wrapper = mount(main);
        const component = wrapper.find("Main");
        component.instance().setState(
            {
                feeds: [{
                    type: "Collection",
                    source: "liked",
                    id: 1,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Collection",
                    source: "liked",
                    id: 1,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Paper",
                    source: "liked",
                    id: 2,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Paper",
                    source: "liked",
                    id: 2,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Review",
                    source: "liked",
                    id: 3,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Review",
                    source: "liked",
                    id: 3,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                },
                ],
            },
        );

        wrapper.update();
        const wrapperLeft = wrapper.find(".left");
        const wrapperRight = wrapper.find(".right");
        expect(wrapperLeft.children().length).toBe(3);
        expect(wrapperRight.children().length).toBe(3);
    });

    it("should not make feedsLeft and feedsRight if wrong type", () => {
        const wrapper = mount(main);
        const component = wrapper.find("Main");

        component.instance().setState(
            {
                feeds: [
                    {
                        type: "wrong type",
                        source: "liked",
                        id: 3,
                        title: "dfad",
                        user: "Dfafdaf",
                        numPapers: 14,
                        numReplies: 15,
                    },
                    {
                        type: "wrong type",
                        source: "liked",
                        id: 4,
                        title: "dfad",
                        user: "Dfafdaf",
                        numPapers: 14,
                        numReplies: 15,
                    },
                ],
            },
        );

        wrapper.update();
        const wrapperLeft = wrapper.find(".left");
        const wrapperRight = wrapper.find(".right");
        expect(wrapperLeft.children().length).toBe(0);
        expect(wrapperRight.children().length).toBe(0);
    });
});
