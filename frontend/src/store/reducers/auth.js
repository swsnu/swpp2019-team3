import authConstants from "../actions/actionTypes";

export const signupStatus = {
    NONE: "NONE",
    WAITING: "WAITING",
    SUCCESS: "SUCCESS",
    DUPLICATE_USERNAME: "DUPLICATE_USERNAME",
    DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
};

const initialState = {
    status: signupStatus.WAITING,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case authConstants.SIGNUP_SUCCESS:
        return { status: signupStatus.SUCCESS };
    case authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME:
        return { status: signupStatus.DUPLICATE_USERNAME };
    case authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL:
        return { status: signupStatus.DUPLICATE_EMAIL };
    default:
        return { status: signupStatus.WAITING };
    }
};
export default reducer;
