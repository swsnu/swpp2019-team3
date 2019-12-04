import reducer from "./auth";
import { authConstants } from "../../actions/actionTypes";
import {
    signupStatus,
    signinStatus,
    signoutStatus,
    getMeStatus,
    notiStatus,
    getSubscriptionsStatus,
    getRecommendationsStatus,
    getKeywordsInitStatus,
    makeTasteInitStatus,
} from "../../../constants/constants";

const stubInitialState = {
    signupStatus: signupStatus.NONE,
    signinStatus: signinStatus.NONE,
    signoutStatus: signoutStatus.NONE,
    getMeStatus: getMeStatus.NONE,
    getNotiStatus: notiStatus.NONE,
    readNotiStatus: notiStatus.NONE,
    subscriptions: {
        status: getSubscriptionsStatus.NONE,
        pageNum: 0,
        finished: true,
        list: [],
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
    notifications: [],
    me: null,
};

const stubSigningUpUser = {
    email: "my_email@papersfeed.com",
    username: "papersfeed",
    password: "swpp",
};

const stubSigningInUser = {
    email: "my_email@papersfeed.com",
    password: "swpp",
};

const stubError = {
    response: {
        status: 440,
        data: {},
    },
};

const stubSubscription = {
    subscriptions: ["stubSubscription"],
    page_number: 1,
    is_finished: true,
};

const stubRecommendation = {
    recommendations: ["stubRecommendation"],
    page_number: 1,
    is_finished: true,
};

const stubKeyword = {
    keywords: ["stubSubscription"],
    page_number: 1,
    is_finished: true,
};

describe("Auth reducer", () => {
    it("should return default state", () => {
        const newState = reducer(stubInitialState, {
            type: "NO SUCH TYPE",
            target: "HAHAHAHAHAHAHAHAHAHAHAHA",
        });
        expect(newState).toEqual(stubInitialState);
    });

    it("should handle signup success", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNUP_SUCCESS,
            target: stubSigningUpUser,
        });
        expect(newState.signupStatus).toBe(signupStatus.SUCCESS);
    });

    it("should handle signup duplicate email", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL,
            target: stubSigningUpUser,
        });
        expect(newState.signupStatus).toBe(signupStatus.DUPLICATE_EMAIL);
    });

    it("should handle signup duplicate username", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME,
            target: stubSigningUpUser,
        });
        expect(newState.signupStatus).toBe(signupStatus.DUPLICATE_USERNAME);
    });

    it("should handle signin success", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNIN_SUCCESS,
            target: stubSigningInUser,
        });
        expect(newState.signinStatus).toBe(signinStatus.SUCCESS);
        expect(newState.me).toBe(stubSigningInUser);
    });

    it("should handle signin user not exist", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNIN_FAILURE_USER_NOT_EXIST,
            target: stubSigningInUser,
        });
        expect(newState.signinStatus).toBe(signinStatus.USER_NOT_EXIST);
    });

    it("should handle signin wrong password", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNIN_FAILURE_WRONG_PW,
            target: stubSigningInUser,
        });
        expect(newState.signinStatus).toBe(signinStatus.WRONG_PW);
    });

    it("should process signout", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNOUT_SUCCESS,
            target: null,
        });
        expect(newState.signoutStatus).toBe(signoutStatus.SUCCESS);
    });

    it("should handle signout failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.SIGNOUT_FAILURE,
            target: null,
        });
        expect(newState.signoutStatus).toBe(signoutStatus.FAILURE);
    });

    it("should process getMe", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GETME_SUCCESS,
            target: stubSigningInUser,
        });
        expect(newState.getMeStatus).toBe(getMeStatus.SUCCESS);
        expect(newState.me).toBe(stubSigningInUser);
    });

    it("should handle getMe failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GETME_FAILURE,
            target: stubSigningInUser,
        });
        expect(newState.getMeStatus).toBe(getMeStatus.FAILURE);
    });


    it("should process getNotifications", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_NOTI_SUCCESS,
            target: [{
                id: 1, actor: { id: 1 }, action_object: { id: 1 }, verb: "liked",
            }],
        });
        expect(newState.getNotiStatus).toEqual(notiStatus.SUCCESS);
        expect(newState.notifications).toEqual([{
            id: 1, actor: { id: 1 }, action_object: { id: 1 }, verb: "liked",
        }]);
    });

    it("should handle getMe failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_NOTI_FAILURE,
            target: stubError,
        });
        expect(newState.getNotiStatus).toEqual(notiStatus.FAILURE);
    });


    it("should process readNotification", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.READ_NOTI_SUCCESS,
            target: null,
        });
        expect(newState.readNotiStatus).toEqual(notiStatus.SUCCESS);
    });

    it("should handle readNotification failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.READ_NOTI_FAILURE,
            target: stubError,
        });
        expect(newState.readNotiStatus).toEqual(notiStatus.FAILURE);
    });

    it("should handle getSubscription", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_SUBSCRIPTION_SUCCESS,
            target: stubSubscription,
        });
        expect(newState.subscriptions.status).toBe(getSubscriptionsStatus.SUCCESS);
        expect(newState.subscriptions.list).toBe(stubSubscription.subscriptions);
        expect(newState.subscriptions.pageNum).toBe(stubSubscription.page_number);
        expect(newState.subscriptions.finished).toBe(stubSubscription.is_finished);
    });

    it("should handle getSubscription failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_SUBSCRIPTION_FAILURE,
            target: stubError,
        });
        expect(newState.subscriptions.status).toBe(getSubscriptionsStatus.FAILURE);
    });

    it("should handle getRecommendation success", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_RECOMMENDATION_SUCCESS,
            target: stubRecommendation,
        });
        expect(newState.recommendations.status).toBe(getRecommendationsStatus.SUCCESS);
        expect(newState.recommendations.list).toBe(stubRecommendation.recommendations);
        expect(newState.recommendations.pageNum).toBe(stubRecommendation.page_number);
        expect(newState.recommendations.finished).toBe(stubRecommendation.is_finished);
    });

    it("should handle getRecommendation failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_RECOMMENDATION_FAILURE,
            target: stubError,
        });
        expect(newState.recommendations.status).toBe(getRecommendationsStatus.FAILURE);
    });

    it("should handle getKeywordsInit success", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_KEYWORD_INIT_SUCCESS,
            target: stubKeyword,
        });
        expect(newState.keywords.status).toBe(getKeywordsInitStatus.SUCCESS);
        expect(newState.keywords.list).toBe(stubKeyword.keywords);
        expect(newState.keywords.pageNum).toBe(stubKeyword.page_number);
        expect(newState.keywords.finished).toBe(stubKeyword.is_finished);
    });

    it("should handle getRecommendation failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_KEYWORD_INIT_FAILURE,
            target: stubError,
        });
        expect(newState.keywords.status).toBe(getKeywordsInitStatus.FAILURE);
    });

    it("should handle makeTasteInit success", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.MAKE_TASTE_INIT_SUCCESS,
            target: null,
        });
        expect(newState.makeTasteInitStatus).toBe(makeTasteInitStatus.SUCCESS);
    });

    it("should handle makeTasteInit failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.MAKE_TASTE_INIT_FAILURE,
            target: stubError,
        });
        expect(newState.makeTasteInitStatus).toBe(makeTasteInitStatus.FAILURE);
    });
});
