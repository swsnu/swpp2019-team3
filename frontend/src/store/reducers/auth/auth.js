import { authConstants } from "../../actions/actionTypes";
import {
    signupStatus, signinStatus, signoutStatus, getMeStatus,
} from "../../../constants/constants";

const initialState = {
    signupStatus: signupStatus.NONE,
    signinStatus: signinStatus.NONE,
    signoutStatus: signoutStatus.NONE,
    getMeStatus: getMeStatus.NONE,
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

    case authConstants.SIGNOUT_SUCCESS:
        return { ...state, signoutStatus: signoutStatus.SUCCESS };
    case authConstants.SIGNOUT_FAILURE:
        return { ...state, signoutStatus: signoutStatus.FAILURE };

    case authConstants.GETME_SUCCESS:
        return { ...state, getMeStatus: getMeStatus.SUCCESS, me: action.target };
    case authConstants.GETME_FAILURE:
        return { ...state, getMeStatus: getMeStatus.FAILURE };

    default:
        return { ...state };
    }
};
export default reducer;
