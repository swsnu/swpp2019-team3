import axios from "axios";
import authConstants from "./actionTypes";

const signupSuccess = (user) => ({
    type: authConstants.SIGNUP_SUCCESS,
    target: user,
});

const signupFailure = (error) => {
    let actionType = null;
    switch (error.response.status) {
    case 419:
        actionType = authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME;
        break;
    case 420:
        actionType = authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL;
        break;
    default:
        break;
    }
    return {
        type: actionType,
        target: error,
    };
};

const signup = (user) => (dispatch) => axios.post("/api/user", user)
    .then((res) => dispatch(signupSuccess(res.data)))
    .catch((err) => dispatch(signupFailure(err)));
export default signup;
