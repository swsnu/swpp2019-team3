import { signup, signin, signout } from "./auth/auth";
import getPaper from "./paper/paper";

export const authActions = {
    signup,
    signin,
    signout,
};
export const paperActions = {
    getPaper,
};
