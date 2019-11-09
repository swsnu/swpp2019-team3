import axios from "axios";

import { authActions } from "..";
import {
    signupStatus, signinStatus, signoutStatus, getMeStatus,
} from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    auth: {
        signupStatus: signupStatus.NONE,
        signinStatus: signinStatus.NONE,
        signoutStatus: signoutStatus.NONE,
        getMeStatus: getMeStatus.NONE,
    },
    collection: {},
    paper: {},
};
const mockStore = getMockStore(stubInitialState);

const stubSigningUpUser = {
    email: "my_email@papersfeed.com",
    username: "papersfeed",
    password: "swpp",
};

const stubSigningInUser = {
    email: "my_email@papersfeed.com",
    password: "swpp",
};

describe("authActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("'signup' should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200, // TODO: actually, it should be 201(POST)
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.signup(stubSigningUpUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", stubSigningUpUser);
                done();
            });
    });

    it("'signup' should handle duplicate username", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 419,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signup(stubSigningUpUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", stubSigningUpUser);
                done();
            });
    });

    it("'signup' should handle duplicate email", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 420,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signup(stubSigningUpUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", stubSigningUpUser);
                done();
            });
    });

    it("'signup' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signup(stubSigningUpUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", stubSigningUpUser);
                done();
            });
    });


    it("'signin' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.signin(stubSigningInUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/session", { params: stubSigningInUser });
                done();
            });
    });

    it("'signin' should handle user not exist", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signin(stubSigningInUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/session", { params: stubSigningInUser });
                done();
            });
    });

    it("'signin' should handle wrong password", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 403,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signin(stubSigningInUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/session", { params: stubSigningInUser });
                done();
            });
    });

    it("'signin' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signin(stubSigningInUser))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/session", { params: stubSigningInUser });
                done();
            });
    });
});
