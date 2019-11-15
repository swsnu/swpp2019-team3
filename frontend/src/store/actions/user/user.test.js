import axios from "axios";

import * as userActions from "./user";

import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    auth: {},
    paper: {},
    collection: {},
    user: {
        userSearchResult: [],
        selectedUser: null,
        selectedFollowers: [],
        selectedFollowings: [],
        status: "NONE",
        error: -1,
    },
};

const mockStore = getMockStore(stubInitialState);

const stubUser = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    username: "Girin",
    description: "Goyang",
    email: "ggg@naver.com",
    password: "010",
};

const stubUser2 = {
    id: 2,
    username: "Kamui",
};

const stubUserEdited = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    username: "Girin",
    description: "Meoooowwwwwww",
    email: "gggg@snu.ac.kr",
    password: "101",
};

describe("userActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("'getUserByUserId' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubUser,
                };
                resolve(result);
            }));

        mockStore.dispatch(userActions.getUserByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", { params: { id: 1 } });
                done();
            });
    });

    it("'getUserByUserId' should handle user-not-exist error", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.getUserByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", { params: { id: 1 } });
                done();
            });
    });

    it("'getUserByUserId' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.getUserByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user", { params: { id: 1 } });
                done();
            });
    });

    it("'getFollowersByUserId' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubUser,
                };
                resolve(result);
            }));

        mockStore.dispatch(userActions.getFollowersByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/followed", { params: { id: 1 } });
                done();
            });
    });

    it("'getFollowersByUserId' should handle user-not-exist error", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.getFollowersByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/followed", { params: { id: 1 } });
                done();
            });
    });

    it("'getFollowersByUserId' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.getFollowersByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/followed", { params: { id: 1 } });
                done();
            });
    });

    it("'getFollowingsByUserId' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubUser,
                };
                resolve(result);
            }));

        mockStore.dispatch(userActions.getFollowingsByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/following", { params: { id: 1 } });
                done();
            });
    });

    it("'getFollowingsByUserId' should handle user-not-exist error", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.getFollowingsByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/following", { params: { id: 1 } });
                done();
            });
    });

    it("'getFollowingsByUserId' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.getFollowingsByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user/following", { params: { id: 1 } });
                done();
            });
    });

    it("'addUserFollowing' should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(userActions.addUserFollowing({ id: stubUser2.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/follow", { params: { id: 2 } });
                done();
            });
    });

    it("'addUserFollowing' should handle self-following error", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 400,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.addUserFollowing({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/follow", { params: { id: 1 } });
                done();
            });
    });

    it("'addUserFollowing' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.addUserFollowing({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/follow", { params: { id: 1 } });
                done();
            });
    });

    it("'removeUserFollowing' should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(userActions.removeUserFollowing({ id: stubUser2.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/follow", { params: { id: 2 } });
                done();
            });
    });

    it("'removeUserFollowing' should handle error", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 400, // status code may need to be changed
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.removeUserFollowing({ id: stubUser2.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/follow", { params: { id: 2 } });
                done();
            });
    });

    it("'editUserInfo' should call axios.put", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(userActions.editUserInfo(
            {
                description: stubUserEdited.description,
                email: stubUserEdited.email,
                id: stubUserEdited.id,
            },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user",
                    {
                        description: "Meoooowwwwwww",
                        email: "gggg@snu.ac.kr",
                        id: 1,
                    });
                done();
            });
    });

    it("'editUserInfo' should handle user-not-exist error", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.editUserInfo(
            {
                description: stubUserEdited.description,
                email: stubUserEdited.email,
                id: stubUserEdited.id,
            },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user",
                    {
                        description: "Meoooowwwwwww",
                        email: "gggg@snu.ac.kr",
                        id: 1,
                    });
                done();
            });
    });

    it("'editUserInfo' should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(userActions.editUserInfo(
            {
                description: stubUserEdited.description,
                email: stubUserEdited.email,
                id: stubUserEdited.id,
            },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/user",
                    {
                        description: "Meoooowwwwwww",
                        email: "gggg@snu.ac.kr",
                        id: 1,
                    });
                done();
            });
    });
});
