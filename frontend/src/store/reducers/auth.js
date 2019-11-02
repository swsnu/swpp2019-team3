import authConstants from "../actions/actionTypes";

const initialState = {
    signedup: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case authConstants.SIGNUP_REQUEST:
        return {};
    case authConstants.SIGNUP_SUCCESS:
        return { signedup: true };
    case authConstants.SIGNUP_FAILURE:
        return {};
    default:
        return state;
    }
};
export default reducer;
