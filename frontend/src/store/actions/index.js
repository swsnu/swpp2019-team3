import { signup, signin } from "./auth/auth";
import getPaper from "./paper/paper";

export const authActions = {
    signup,
    signin,
};
export const paperActions = {
    getPaper,
};
