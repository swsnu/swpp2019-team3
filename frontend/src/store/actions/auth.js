import axios from "axios";
import authConstants from "./actionTypes";

const signupSuccess = (user) => ({
    type: authConstants.SIGNUP_SUCCESS,
    target: user,
});

const signupFailure = (error) => ({
    type: authConstants.SIGNUP_FAILURE,
    target: error,
});

const signup = (user) => (dispatch) => axios.post("/api/user", user)
    .then((res) => dispatch(signupSuccess(res.data)))
    .catch((err) => dispatch(signupFailure(err)));
export default signup;
