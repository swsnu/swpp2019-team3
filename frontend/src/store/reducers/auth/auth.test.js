import reducer from "./auth";
import { authConstants } from "../../actions/actionTypes";
import {
    signupStatus, signinStatus, signoutStatus, getMeStatus, notiStatus, getSubscriptionsStatus,
} from "../../../constants/constants";

const stubInitialState = {
    signupStatus: signupStatus.NONE,
    signinStatus: signinStatus.NONE,
    signoutStatus: signoutStatus.NONE,
    getMeStatus: getMeStatus.NONE,
    getNotiStatus: notiStatus.NONE,
    readNotiStatus: notiStatus.NONE,
    getSubscriptionsStatus: getSubscriptionsStatus.NONE,
    notifications: [],
    subscriptions: [],
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

const stubSubscription = ["stubSubscription"];

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
        expect(newState.getSubscriptionsStatus).toBe(getSubscriptionsStatus.SUCCESS);
        expect(newState.subscriptions).toBe(stubSubscription);
    });

    it("should handle getSubscription failure", () => {
        const newState = reducer(stubInitialState, {
            type: authConstants.GET_SUBSCRIPTION_FAILURE,
            target: stubError,
        });
        expect(newState.getSubscriptionsStatus).toBe(getSubscriptionsStatus.FAILURE);
    });
});
