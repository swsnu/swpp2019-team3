import axios from "axios";

import { authActions } from "..";
import {
    signupStatus, signinStatus, signoutStatus, getMeStatus, notiStatus, getSubscriptionsStatus,
} from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";


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
    let mockStore = null;

    beforeEach(() => {
        const stubInitialState = {
            auth: {
                signupStatus: signupStatus.NONE,
                signinStatus: signinStatus.NONE,
                signoutStatus: signoutStatus.NONE,
                getMeStatus: getMeStatus.NONE,
                getNotiStatus: notiStatus.NONE,
                readNotiStatus: notiStatus.NONE,
                getSubscriptionsStatus: getSubscriptionsStatus.NONE,
                notifications: [],
                subscriptions: [],
                me: null,
            },
            collection: {},
            paper: {},
            user: {},
            review: {},
            reply: {},
        };
        mockStore = getMockStore(stubInitialState);
    });

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
                    data: { id: 1, username: "swpp" },
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


    it("'signout' should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.signout())
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/session");
                done();
            });
    });

    it("'signout' should handle failure", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 403,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.signout())
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/session");
                done();
            });
    });


    it("'getMe' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: { id: 1, username: "swpp" },
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.getMe())
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/me");
                done();
            });
    });

    it("'getMe' should handle unauthorized person", (done) => {
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

        mockStore.dispatch(authActions.getMe())
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/me");
                done();
            });
    });


    it("'getNoti' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {
                        notifications: [{
                            id: 1, actor: { id: 1 }, action_object: { id: 1 }, verb: "liked",
                        }],
                    },
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.getNoti())
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/notification");
                done();
            });
    });

    it("'getNoti' should handle session expired", (done) => {
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

        mockStore.dispatch(authActions.getNoti())
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/notification");
                done();
            });
    });


    it("'readNoti' should call axios.put", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.readNoti({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/notification", { id: 1 });
                done();
            });
    });

    it("'readNoti' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(authActions.readNoti({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/notification", { id: 1 });
                done();
            });
    });

    it("getSubscription should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.getSubscriptions({ page_number: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/subscription", { params: { page_number: 1 } });
                done();
            });
    });

    it("getSubscription should handle error", (done) => {
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

        mockStore.dispatch(authActions.getSubscriptions({ page_number: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/subscription", { params: { page_number: 1 } });
                done();
            });
    });

    it("getRecommendations should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.getRecommendations({ page_number: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/recommendation", { params: { page_number: 1 } });
                done();
            });
    });

    it("getRecommendations should handle error", (done) => {
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

        mockStore.dispatch(authActions.getRecommendations({ page_number: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/recommendation", { params: { page_number: 1 } });
                done();
            });
    });

    it("getKeywordsInit should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.getKeywordsInit({ page_number: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/keyword/init", { params: { page_number: 1 } });
                done();
            });
    });

    it("getKeywordsInit should handle error", (done) => {
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

        mockStore.dispatch(authActions.getKeywordsInit({ page_number: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/keyword/init", { params: { page_number: 1 } });
                done();
            });
    });


    it("makeTasteInit should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.makeTasteInit({ keywords: [1] }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/recommendation/init", { keywords: [1] });
                done();
            });
    });

    it("makeTasteInit should handle error", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 403,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(authActions.makeTasteInit({ keywords: [1] }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/recommendation/init", { keywords: [1] });
                done();
            });
    });
});
