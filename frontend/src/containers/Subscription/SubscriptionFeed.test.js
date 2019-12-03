import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import SubscriptionFeed from "./SubscriptionFeed";
import {
    signinStatus, signoutStatus, signupStatus, getMeStatus,
    getSubscriptionsStatus, notiStatus, reviewStatus, collectionStatus,
} from "../../constants/constants";
import { getMockStore, mockPromise } from "../../test-utils/mocks";
import { history } from "../../store/store";
import { authActions } from "../../store/actions";

const stubSubscriptions = [
    {
        action_object: {
            content: {
                count: {
                    likes: 1,
                    replies: 0,
                },
                creation_date: "2019-12-02T07:31:40.975",
                id: 2,
                liked: false,
                modification_date: "2019-12-02T07:31:40.976",
                paper: {
                    DOI: "",
                    ISSN: "",
                    abstract: "We explain why semistability of a one-ended proper CAT(0) space can be↵determined by the geodesic rays. This is applied to boundaries of CAT(0)↵groups.",
                    authors: [{
                        address: "",
                        email: "",
                        first_name: "Ross",
                        id: 53,
                        last_name: "Geoghegan",
                        rank: 1,
                        researcher_id: "",
                        type: "general",
                    }],
                    count: { reviews: 2, likes: 1 },
                    download_url: "http://arxiv.org/pdf/1703.07003v1",
                    eISSN: "",
                    file_url: "http://arxiv.org/abs/1703.07003v1",
                    id: 31,
                    keywords: [],
                    language: "english",
                    liked: false,
                    publication: {},
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
            type: "review",
        },
        actor: {
            id: 2,
            username: "girin",
        },
        creation_date: "2019-12-02T07:31:58.980",
        id: 11,
        target: {},
        verb: "liked",
    },
    {
        action_object: {
            content: {
                count: {
                    users: 1,
                    papers: 0,
                    likes: 0,
                    replies: 0,
                },
                creation_date: "2019-12-02T05:56:28.856",
                id: 2,
                liked: false,
                modification_date: "2019-12-02T05:56:28.856",
                text: "meowwww",
                title: "girin",
            },
            type: "collection",
        },
        actor: { id: 2, username: "girin" },
        creation_date: "2019-12-02T05:56:28.864",
        id: 10,
        target: {},
        verb: "created",
    },
    {
        action_object: {
            type: "paper",
            content: {
                DOI: "10.2140/gt.2007.11.1255",
                ISSN: "",
                abstract: "This paper ... ",
                authors: [
                    {
                        address: "",
                        email: "",
                        first_name: "Michael",
                        id: 54,
                        last_name: "Farber",
                        rank: 1,
                        researcher_id: "",
                        type: "general",
                    },
                    {
                        address: "",
                        email: "",
                        first_name: "Dirk",
                        id: 55,
                        last_name: "Schuetz",
                        rank: 2,
                        researcher_id: "",
                        type: "general",
                    },
                ],
                count: {
                    reviews: 0,
                    likes: 1,
                },
                download_url: "http://arxiv.org/pdf/math/0609005v1",
                eISSN: "",
                file_url: "http://arxiv.org/abs/math/0609005v1",
                id: 32,
                keywords: [],
                language: "english",
                liked: false,
                publication: {},
                title: "Cohomological estimates",
            },
        },
        actor: {
            id: 2,
            username: "girin",
        },
        creation_date: "2019-12-02T03:41:13.561",
        id: 9,
        target: {},
        verb: "liked",
    },
    {
        action_object: {
            type: "type that cannot exist",
            content: {},
        },
        creation_date: "2019-12-02T03:41:13.561",
        id: 9,
        target: {},
        verb: "liked",
    },
];

describe("SubscriptionFeed test", () => {
    let feed;

    beforeEach(() => {
        const stubInitialState = {
            paper: {},
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.NONE,
                signoutStatus: signoutStatus.NONE,
                getMeStatus: getMeStatus.NONE,
                getNotiStatus: notiStatus.NONE,
                readNotiStatus: notiStatus.NONE,
                getSubscriptionsStatus: getSubscriptionsStatus.SUCCESS,
                notifications: [],
                subscriptions: stubSubscriptions,
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
        const mockStore = getMockStore(stubInitialState);
        feed = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <SubscriptionFeed />
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render well", () => {
        const spyGetSubscription = jest.spyOn(authActions, "getSubscriptions")
            .mockImplementation(() => () => mockPromise);

        const component = mount(feed);
        const wrapper = component.find(".SubscriptionFeed");
        expect(wrapper.length).toBe(1);
        expect(spyGetSubscription).toBeCalledTimes(1);

        const wrapperLeft = component.find("#subscriptionCardsLeft");
        const wrapperRight = component.find("#subscriptionCardsRight");
        expect(component.find("PaperCard").length).toBe(1);
        expect(component.find("CollectionCard").length).toBe(1);
        expect(component.find("ReviewCard").length).toBe(1);
        expect(wrapperLeft.children().length).toBe(2);
        expect(wrapperRight.children().length).toBe(1);
    });
});
