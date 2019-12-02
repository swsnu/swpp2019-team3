import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { getMockStore } from "../../test-utils/mocks";
import Main from "./Main";
import { collectionStatus, reviewStatus, signinStatus } from "../../constants/constants";
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
    review: {
        like: {
            status: reviewStatus.NONE,
            count: 0,
            error: null,
        },
        unlike: {
            status: reviewStatus.NONE,
            count: 0,
            error: null,
        },
    },
    user: {},
    reply: {},
};

const mockStore = getMockStore(stubInitialState);

describe("<Main />", () => {
    let main;

    beforeEach(() => {
        main = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Main />
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const component = mount(main);
        const wrapper = component.find(".main");
        expect(wrapper.length).toBe(1);
    });
});
