import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import SubscriptionFeed from "./SubscriptionFeed";
import {
    signinStatus, signoutStatus, signupStatus, getMeStatus,
    getSubscriptionsStatus, notiStatus, reviewStatus, collectionStatus,
    getRecommendationsStatus, getKeywordsInitStatus, makeTasteInitStatus,
} from "../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../test-utils/mocks";
import { history } from "../../store/store";
import { authActions } from "../../store/actions";

const makeFeed = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <SubscriptionFeed
          history={history}
          props={props}
        />
    </Provider>
);

describe("SubscriptionFeed test", () => {
    let feed;
    let stubSubscriptions;
    let stubRecommendations;
    let stubInitialState;
    let spyGetRecommendation;
    let spyGetSubscription;

    beforeEach(() => {
        stubSubscriptions = [
            {
                type: "subscription",
                action_object: {
                    type: "review",
                    content: {
                        count: {
                            likes: 1,
                            replies: 0,
                        },
                        id: 2,
                        liked: false,
                        paper: {
                            abstract: "We explain why semistability of a one-ended proper CAT(0) space can be↵determined by the geodesic rays. This is applied to boundaries of CAT(0)↵groups.",
                            authors: [{
                                first_name: "Ross",
                                id: 53,
                                last_name: "Geoghegan",
                                rank: 1,
                            }],
                            count: { reviews: 2, likes: 1 },
                            id: 31,
                            keywords: [],
                            liked: false,
                            title: "Semistability and CAT(0) Geometry",
                        },
                        text: "zxcbvzxcb",
                        title: "asfdas",
                        user: {
                            id: 1,
                            username: "asdf",
                            email: "asdf@snu.ac.kr",
                            description: "",
                            count: {
                                follower: 1,
                                following: 1,
                            },
                        },
                    },
                },
                actor: {
                    id: 2,
                    username: "girin",
                },
                id: 11,
                target: {},
                verb: "liked",
            },
            {
                type: "subscription",
                action_object: {
                    type: "collection",
                    content: {
                        count: {
                            users: 1,
                            papers: 0,
                            likes: 0,
                            replies: 0,
                        },
                        id: 2,
                        liked: false,
                        text: "meowwww",
                        title: "girin",
                    },
                },
                actor: { id: 2, username: "girin" },
                id: 10,
                target: {},
                verb: "created",
            },
            {
                type: "subscription",
                action_object: {
                    type: "paper",
                    content: {
                        abstract: "This paper ... ",
                        authors: [
                            {
                                address: "",
                                email: "",
                                first_name: "Michael",
                                id: 54,
                                last_name: "Farber",
                                rank: 1,
                            },
                            {
                                address: "",
                                email: "",
                                first_name: "Dirk",
                                id: 55,
                                last_name: "Schuetz",
                                rank: 2,
                            },
                        ],
                        count: {
                            reviews: 0,
                            likes: 1,
                        },
                        id: 32,
                        keywords: [],
                        liked: false,
                        title: "Cohomological estimates",
                    },
                },
                actor: {
                    id: 2,
                    username: "girin",
                },
                id: 9,
                target: {},
                verb: "liked",
            },
            {
                type: "subscription",
                action_object: {
                    type: "type that cannot exist",
                    content: {},
                },
                id: 9,
                target: {},
                verb: "liked",
            },
        ];

        stubRecommendations = [
            {
                type: "recommendation_paper",
                action_object: {
                    type: "paper",
                    content: {
                        abstract: "This paper ... ",
                        authors: [
                            {
                                first_name: "Michael",
                                id: 54,
                                last_name: "Farber",
                                rank: 1,
                            },
                            {
                                first_name: "Dirk",
                                id: 55,
                                last_name: "Schuetz",
                                rank: 2,
                            },
                        ],
                        count: {
                            reviews: 0,
                            likes: 1,
                        },
                        id: 32,
                        keywords: [],
                        liked: false,
                        title: "Cohomological estimates",
                    },
                },
                actor: {
                    id: 0,
                    username: "papersfeed",
                },
                id: 9,
                target: {},
                verb: "liked",
            },
        ];
        stubInitialState = {
            paper: {},
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.NONE,
                signoutStatus: signoutStatus.NONE,
                getMeStatus: getMeStatus.NONE,
                getNotiStatus: notiStatus.NONE,
                readNotiStatus: notiStatus.NONE,
                subscriptions: {
                    status: getSubscriptionsStatus.SUCCESS,
                    list: stubSubscriptions,
                    pageNum: 1,
                    finished: true,
                },
                recommendations: {
                    status: getRecommendationsStatus.SUCCESS,
                    list: stubRecommendations,
                    pageNum: 1,
                    finished: true,
                },
                keywords: {
                    status: getKeywordsInitStatus.NONE,
                    list: [],
                    pageNum: 0,
                    finished: true,
                },
                makeTasteInitStatus: makeTasteInitStatus.NONE,
                notifications: [],
                me: null,
            },
            collection: {
                make: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: -1,
                },
                list: {
                    status: collectionStatus.NONE,
                    list: [],
                    error: -1,
                },
                edit: {
                    status: collectionStatus.NONE,
                    collection: {},
                    error: -1,
                },
                delete: {
                    status: collectionStatus.NONE,
                    list: {},
                    error: -1,
                },
                selected: {
                    status: collectionStatus.NONE,
                    collection: {},
                    papers: [],
                    replies: [],
                    error: -1,
                },
                like: {
                    status: collectionStatus.NONE,
                    error: -1,
                },
                unlike: {
                    status: collectionStatus.NONE,
                    error: -1,
                },
                getMembers: {},
            },
            user: {
                getFollowings: {},
                getFollowers: {},
                search: {},
            },
            review: {
                make: {
                    status: reviewStatus.NONE,
                    review: {},
                    error: null,
                },
                list: {
                    status: reviewStatus.NONE,
                    list: [],
                    error: null,
                },
                edit: {
                    status: reviewStatus.NONE,
                    review: {},
                    error: null,
                },
                delete: {
                    status: reviewStatus.NONE,
                    review: {},
                    error: null,
                },
                selected: {
                    status: reviewStatus.NONE,
                    review: { id: 1 },
                    error: null,
                    replies: [],
                },
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
            reply: {},
        };
        feed = makeFeed(stubInitialState);
        spyGetSubscription = jest.spyOn(authActions, "getSubscriptions")
            .mockImplementation(() => () => mockPromise);
        spyGetRecommendation = jest.spyOn(authActions, "getRecommendations")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render well", async () => {
        const component = mount(feed);
        const wrapper = component.find(".SubscriptionFeed");
        expect(wrapper.length).toBe(1);
        expect(spyGetSubscription).toBeCalledTimes(1);

        await flushPromises();

        expect(spyGetRecommendation).toBeCalledTimes(1);
    });

    it("should handle cards well", async () => {
        const component = mount(feed);

        await flushPromises();
        component.update();

        const wrapperLeft = component.find("#subscriptionCardsLeft");
        const wrapperRight = component.find("#subscriptionCardsRight");

        expect(component.find("PaperCard").length).toBe(2);
        expect(component.find("CollectionCard").length).toBe(1);
        expect(component.find("ReviewCard").length).toBe(1);
        expect(wrapperLeft.children().length).toBe(2);
        expect(wrapperRight.children().length).toBe(2);
    });

    it("should not render click view more button", () => {
        const component = mount(feed);
        component.find("SubscriptionFeed").instance().setState({
            finished: true,
        });
        component.update();

        expect(component.find(".more-button").hostNodes().length).toBe(0);
    });

    it("should handle click view more button without finish", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                subscriptions: {
                    ...stubInitialState.auth.subscriptions,
                    finished: false,
                    list: [],
                },
                recommendations: {
                    ...stubInitialState.auth.recommendations,
                    finished: false,
                    list: [],
                },
            },
        };
        const component = mount(makeFeed(stubInitialState));

        const instance = component.find(SubscriptionFeed.WrappedComponent).instance();
        const spyAdd = jest.spyOn(instance, "addRecoToSub");
        expect(spyGetSubscription).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(spyGetRecommendation).toBeCalledTimes(1);
        await flushPromises();
        component.update();

        expect(instance.state.recommendations.length).toBe(0);
        expect(spyAdd).toBeCalledTimes(1);

        expect(instance.state.finished).toBe(false);
        const spyClickNext = jest.spyOn(instance, "clickMoreButtonNext");

        const button = component.find(".more-button").hostNodes();
        button.simulate("click");

        expect(spyGetSubscription).toBeCalledTimes(2);
        await flushPromises();
        expect(spyClickNext).toBeCalledTimes(1);

        await flushPromises();

        expect(spyGetRecommendation).toBeCalledTimes(2);
        expect(spyAdd).toBeCalledTimes(2);
        expect(instance.state.recommendations.length).toBe(0);
    });

    it("should handle click view more button with reco_finish", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                subscriptions: {
                    ...stubInitialState.auth.subscriptions,
                    finished: false,
                    list: [],
                },
                recommendations: {
                    ...stubInitialState.auth.recommendations,
                    finished: true,
                    list: stubRecommendations,
                },
            },
        };
        const component = mount(makeFeed(stubInitialState));
        const instance = component.find(SubscriptionFeed.WrappedComponent).instance();
        const spyAdd = jest.spyOn(instance, "addRecoToSub");
        expect(spyGetSubscription).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(spyGetRecommendation).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(instance.state.recommendations.length).toBe(0);
        expect(spyAdd).toBeCalledTimes(1);

        expect(instance.state.finished).toBe(false);
        const spyClickNext = jest.spyOn(instance, "clickMoreButtonNext");

        const button = component.find(".more-button").hostNodes();
        button.simulate("click");

        expect(spyGetSubscription).toBeCalledTimes(2);
        await flushPromises();
        expect(spyClickNext).toBeCalledTimes(1);

        await flushPromises();
        expect(spyGetRecommendation).toBeCalledTimes(1);
        expect(spyAdd).toBeCalledTimes(2);
        expect(instance.state.recommendations.length).toBe(0);
    });

    it("should handle click view more button with sub_finish", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                subscriptions: {
                    ...stubInitialState.auth.subscriptions,
                    finished: true,
                },
                recommendations: {
                    ...stubInitialState.auth.recommendations,
                    list: [],
                    finished: false,
                },
            },
        };
        const component = mount(makeFeed(stubInitialState));
        component.update();
        const instance = component.find("SubscriptionFeed").instance();


        const spyAdd = jest.spyOn(instance, "addRecoToSub");
        expect(spyGetSubscription).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(spyGetRecommendation).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(instance.state.recommendations.length).toBe(0);
        expect(spyAdd).toBeCalledTimes(1);
        expect(instance.state.finished).toBe(false);
        const spyClickNext = jest.spyOn(instance, "clickMoreButtonNext");
        const button = component.find(".more-button").hostNodes();
        button.simulate("click");
        expect(spyGetSubscription).toBeCalledTimes(1);
        expect(instance.state.subscriptions).toStrictEqual(stubSubscriptions);
        expect(spyClickNext).toBeCalledTimes(1);

        expect(spyGetRecommendation).toBeCalledTimes(2);
        await flushPromises();
        expect(spyAdd).toBeCalledTimes(2);
        expect(instance.state.finished).toBe(false);
        expect(instance.state.recommendations.length).toBe(0);
    });

    it("should handle click view more button with both finish", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                subscriptions: {
                    ...stubInitialState.auth.subscriptions,
                    finished: true,
                },
                recommendations: {
                    ...stubInitialState.auth.recommendations,
                    finished: true,
                },
            },
        };
        const component = mount(makeFeed(stubInitialState));
        component.update();
        const instance = component.find(SubscriptionFeed.WrappedComponent).instance();
        const spyAdd = jest.spyOn(instance, "addRecoToSub");
        expect(spyGetSubscription).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(spyGetRecommendation).toBeCalledTimes(1);
        await flushPromises();
        component.update();
        expect(instance.state.recommendations.length).toBe(0);
        expect(spyAdd).toBeCalledTimes(1);
        expect(instance.state.finished).toBe(true);
        const button = component.find(".more-button").hostNodes();
        expect(button.length).toBe(0);
    });
});
