import { authConstants } from "../actions/actionTypes";

export const signupStatus = {
    NONE: "NONE",
    WRONG_EMAIL_FORMAT: "WRONG_EMAIL_FORMAT",
    WAITING: "WAITING",
    SUCCESS: "SUCCESS",
    DUPLICATE_USERNAME: "DUPLICATE_USERNAME",
    DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
};

export const signinStatus = {
    NONE: "NONE",
    WAITING: "WAITING",
    SUCCESS: "SUCCESS",
    USER_NOT_EXIST: "USER_NOT_EXIST",
    WRONG_PW: "WRONG_PW",
};

const initialState = {
    signupStatus: signupStatus.NONE,
    signinStatus: signinStatus.NONE,
    me: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case authConstants.SIGNUP_SUCCESS:
        return { ...state, signupStatus: signupStatus.SUCCESS };
    case authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME:
        return { ...state, signupStatus: signupStatus.DUPLICATE_USERNAME };
    case authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL:
        return { ...state, signupStatus: signupStatus.DUPLICATE_EMAIL };
    case authConstants.SIGNIN_SUCCESS:
        return { ...state, signinStatus: signinStatus.SUCCESS, me: action.target };
    case authConstants.SIGNIN_FAILURE_USER_NOT_EXIST:
        return { ...state, signinStatus: signinStatus.USER_NOT_EXIST };
    case authConstants.SIGNIN_FAILURE_WRONG_PW:
        return { ...state, signinStatus: signinStatus.WRONG_PW };
    default:
        return { ...state };
    }
};
export default reducer;
