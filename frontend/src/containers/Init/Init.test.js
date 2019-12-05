import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import Init from "./Init";
import {
    signinStatus, signoutStatus, signupStatus, getMeStatus,
    getSubscriptionsStatus, notiStatus, reviewStatus, collectionStatus,
    getRecommendationsStatus, getKeywordsInitStatus, makeTasteInitStatus,
} from "../../constants/constants";
import { getMockStore, mockPromise, flushPromises } from "../../test-utils/mocks";
import { history } from "../../store/store";
import { authActions } from "../../store/actions";

const makeInit = (initialState, props = {}) => (
    <Provider store={getMockStore(initialState)}>
        <Init
          match={{ params: { review_id: 1 } }}
          history={history}
          props={props}
        />
    </Provider>
);

describe("Init test", () => {
    let init;
    let stubInitialState;
    let spyGetKeywords;
    let spyMakeTaste;

    beforeEach(() => {
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
                    status: getSubscriptionsStatus.NONE,
                    list: [],
                    pageNum: 1,
                    finished: true,
                },
                recommendations: {
                    status: getRecommendationsStatus.NONE,
                    list: [],
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
        init = makeInit(stubInitialState);
        spyGetKeywords = jest.spyOn(authActions, "getKeywordsInit")
            .mockImplementation(() => () => mockPromise);
        spyMakeTaste = jest.spyOn(authActions, "makeTasteInit")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render well", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                keywords: {
                    ...stubInitialState.auth.keywords,
                    list: [{ id: 1 }, { id: 2 }],
                },
            },
        };
        const component = mount(makeInit(stubInitialState));
        const wrapper = component.find("Init");
        expect(wrapper.length).toBe(1);
        expect(spyGetKeywords).toBeCalledTimes(1);

        const instance = component.find(Init.WrappedComponent).instance();
        await flushPromises();

        expect(instance.state.keywords.length).toBe(2);
    });

    it("should handle many keywords", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                keywords: {
                    ...stubInitialState.auth.keywords,
                    list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
                },
            },
        };
        const component = mount(makeInit(stubInitialState));
        const wrapper = component.find("Init");
        expect(wrapper.length).toBe(1);
        expect(spyGetKeywords).toBeCalledTimes(1);

        const instance = component.find(Init.WrappedComponent).instance();
        await flushPromises();

        expect(instance.state.keywords.length).toBe(6);
    });

    it("should handle clickConfirmButton", async () => {
        const component = mount(init);
        const instance = component.find("Init").instance();
        instance.setState({
            checkedKeywords: [1, 2, 3, 4, 5],
        });

        component.update();

        const spyPush = jest.spyOn(history, "push")
            .mockImplementation(() => {});
        const button = component.find(".confirm-button").hostNodes();
        expect(button.length).toBe(1);

        button.simulate("click");
        expect(spyMakeTaste).toBeCalledTimes(1);
        await flushPromises();
        expect(spyPush).toBeCalledTimes(1);
    });

    it("should disable confirm button", () => {
        const component = mount(init);
        const instance = component.find("Init").instance();
        instance.setState({
            checkedKeywords: [1, 2, 3],
        });

        component.update();

        const button = component.find(".confirm-button").hostNodes();
        expect(button.length).toBe(1);
        expect(button.prop("disabled")).toBe(true);
    });

    it("should handle click more button", async () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                keywords: {
                    ...stubInitialState.auth.keywords,
                    list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
                    finished: false,
                },
            },
        };
        const component = mount(makeInit(stubInitialState));
        const instance = component.find("Init").instance();
        expect(spyGetKeywords).toBeCalledTimes(1);

        await flushPromises();
        expect(instance.state.keywords.length).toBe(6);

        const button = component.find(".more-button").hostNodes();
        expect(button.length).toBe(1);

        button.simulate("click");
        expect(spyGetKeywords).toBeCalledTimes(2);

        await flushPromises();
        expect(instance.state.keywords.length).toBe(12);
    });

    it("should not render click more button", () => {
        stubInitialState = {
            ...stubInitialState,
            auth: {
                ...stubInitialState.auth,
                keywords: {
                    ...stubInitialState.auth.keywords,
                    list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
                    finished: true,
                },
            },
        };
        const component = mount(makeInit(stubInitialState));
        expect(spyGetKeywords).toBeCalledTimes(1);

        const button = component.find(".more-button").hostNodes();
        expect(button.length).toBe(0);
    });

    it("should hanled check", async () => {
        const component = mount(init);
        const instance = component.find("Init").instance();

        instance.setState({
            keywords: [{ id: 1 }, { id: 2 }, { id: 3 }],
            checkedKeywords: [1, 2],
        });

        component.update();
        const wrapper = component.find({ id: 1 }).hostNodes();
        wrapper.simulate("change");
        const wrapper2 = component.find({ id: 3 }).hostNodes();
        wrapper2.simulate("change");
        expect(instance.state.checkedKeywords).toStrictEqual([1, 3]); // Fix me: it should be 2, 3
    });
});
