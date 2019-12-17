import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { getMockStore } from "../../test-utils/mocks";
import Main from "./Main";
import {
    collectionStatus, reviewStatus, signinStatus,
    getSubscriptionsStatus, getRecommendationsStatus, getKeywordsInitStatus,
    makeTasteInitStatus,
}
    from "../../constants/constants";
import { history } from "../../store/store";

describe("<Main />", () => {
    let main;

    beforeEach(() => {
        const stubInitialState = {
            paper: {
            },
            auth: {
                singinStatus: signinStatus.SUCCESS,
                me: null,
                subscriptions: {
                    status: getSubscriptionsStatus.SUCCESS,
                    list: [],
                    pageNum: 1,
                    finished: true,
                },
                recommendations: {
                    status: getRecommendationsStatus.NONE,
                    list: [],
                    pageNum: 0,
                    finished: true,
                },
                keywords: {
                    status: getKeywordsInitStatus.NONE,
                    list: [],
                    pageNum: 0,
                    finished: true,
                },
                makeTasteInitStatus: makeTasteInitStatus.NONE,
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
                getMembers: {},
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
            user: {
                getFollowings: {},
                getFollowers: {},
                search: {},
            },
            reply: {},
        };
        main = (
            <Provider store={getMockStore(stubInitialState)}>
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
