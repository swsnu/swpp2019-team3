import {
    signup, signin, signout, getMe,
} from "./auth/auth";
import getPaper from "./paper/paper";

export const authActions = {
    signup,
    signin,
    signout,
    getMe,
};
export const paperActions = {
    getPaper,
};
