import reducer from "./auth";
import { authConstants } from "../../actions/actionTypes";
import {
    signupStatus, signinStatus, signoutStatus, getMeStatus, notiStatus,
} from "../../../constants/constants";

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

describe("Auth reducer", () => {
    it("should return default state", () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });

    it("should handle signup success", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNUP_SUCCESS,
            target: stubSigningUpUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.SUCCESS,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });

    it("should handle signup duplicate email", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL,
            target: stubSigningUpUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.DUPLICATE_EMAIL,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });

    it("should handle signup duplicate username", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME,
            target: stubSigningUpUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.DUPLICATE_USERNAME,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });


    it("should handle signin success", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNIN_SUCCESS,
            target: stubSigningInUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.SUCCESS,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: {
                email: "my_email@papersfeed.com",
                password: "swpp",
            },
        });
    });

    it("should handle signin user not exist", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNIN_FAILURE_USER_NOT_EXIST,
            target: stubSigningInUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.USER_NOT_EXIST,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });

    it("should handle signin wrong password", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNIN_FAILURE_WRONG_PW,
            target: stubSigningInUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.WRONG_PW,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });


    it("should process signout", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNOUT_SUCCESS,
            target: null,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.SUCCESS,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });

    it("should handle signout failure", () => {
        const newState = reducer(undefined, {
            type: authConstants.SIGNOUT_FAILURE,
            target: null,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.FAILURE,
            getMeStatus: getMeStatus.NONE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });


    it("should process getMe", () => {
        const newState = reducer(undefined, {
            type: authConstants.GETME_SUCCESS,
            target: stubSigningInUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.SUCCESS,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: stubSigningInUser,
        });
    });

    it("should handle getMe failure", () => {
        const newState = reducer(undefined, {
            type: authConstants.GETME_FAILURE,
            target: stubSigningInUser,
        });
        expect(newState).toEqual({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            signoutStatus: signoutStatus.NONE,
            getMeStatus: getMeStatus.FAILURE,
            getNotiStatus: notiStatus.NONE,
            readNotiStatus: notiStatus.NONE,
            notifications: [],
            me: null,
        });
    });


    it("should process getNotifications", () => {
        const newState = reducer(undefined, {
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
        const newState = reducer(undefined, {
            type: authConstants.GET_NOTI_FAILURE,
            target: stubError,
        });
        expect(newState.getNotiStatus).toEqual(notiStatus.FAILURE);
    });


    it("should process readNotification", () => {
        const newState = reducer(undefined, {
            type: authConstants.READ_NOTI_SUCCESS,
            target: null,
        });
        expect(newState.readNotiStatus).toEqual(notiStatus.SUCCESS);
    });

    it("should handle readNotification failure", () => {
        const newState = reducer(undefined, {
            type: authConstants.READ_NOTI_FAILURE,
            target: stubError,
        });
        expect(newState.readNotiStatus).toEqual(notiStatus.FAILURE);
    });
});
