import { signup, signin } from "./auth";
import { getPaper } from "./paper";

export const authActions = {
    signup,
    signin,
};
export const paperActions = {
    getPaper,
};
