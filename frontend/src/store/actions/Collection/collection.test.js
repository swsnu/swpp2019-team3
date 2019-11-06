import axios from "axios";

import * as collectionActions from "./collection";

import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    auth: {},
    paper: {},
    collection: {
        make: {
            status: "NONE",
            collection: {},
            error: -1,
        },
        list: {
            status: "NONE",
            list: [],
            error: -1,
        },
        edit: {
            status: "NONE",
            collection: {},
            error: -1,
        },
        delete: {
            status: "NONE",
            list: {},
            error: -1,
        },
        selected: {
            collection: {},
            papers: [],
            members: [],
            replies: [],
        },

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

const stubCollection = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    title: "SWPP",
    text: "SWPP2019fall",
};

describe("collectionActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("'makeNewCollection should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.makeNewCollection("abc", "def"))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { text: "def", title: "abc" });
                done();
            });
    });
    it("'makeNewCollection should handle missing-parameter error", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 408,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.makeNewCollection("def"))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { text: undefined, title: "def" });
                done();
            });
    });

    it("'makeNewCollection should handle unknown error", (done) => {
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

        mockStore.dispatch(collectionActions.makeNewCollection("def"))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { text: undefined, title: "def" });
                done();
            });
    });

    it("getCollectionsByUserId should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubCollection,
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.getCollectionsByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection/user", { params: { id: 1 } });
                done();
            });
    });

    it("getCollectionsByUserId should handle error", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 654,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.getCollectionsByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection/user", { params: { id: 1 } });
                done();
            });
    });

    it("getCollectionsByUserId should handle error", (done) => {
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

        mockStore.dispatch(collectionActions.getCollectionsByUserId(stubUser.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection/user", { params: { id: 1 } });
                done();
            });
    });

    it("getcollection should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubCollection,
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.getCollection(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { params: { id: 1 } });
                done();
            });
    });

    it("getCollection should handle collectionnotexist", (done) => {
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

        mockStore.dispatch(collectionActions.getCollection(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { params: { id: 1 } });
                done();
            });
    });

    it("getCollectionPapers should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: [],
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.getCollectionPapers(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/paper/collection", { params: { id: 1 } });
                done();
            });
    });

    it("getCollectionPapers should handle error", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    status: 407,
                    data: [],
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.getCollectionPapers(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/paper/collection", { params: { id: 1 } });
                done();
            });
    });

    it("setTitleandDescription should call axios.put", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.setTitleAndDescription(stubCollection.id, "dfd", "dfder"))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { id: 1, text: "dfder", title: "dfd" });
                done();
            });
    });

    it("setTitleandDescription should handle collectionnotexist", (done) => {
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

        mockStore.dispatch(collectionActions.setTitleAndDescription(stubCollection.id, "dfd", "dfder"))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { id: 1, text: "dfder", title: "dfd" });
                done();
            });
    });

    it("setTitleandDescription should handle autherror", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 403,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.setTitleAndDescription(stubCollection.id, "dfd", "dfder"))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { id: 1, text: "dfder", title: "dfd" });
                done();
            });
    });

    it("addCollectionPaper should call axios.put", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.addCollectionPaper(stubCollection.id, 1))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/paper/collection", { collection_ids: 1, id: 1 });
                done();
            });
    });

    it("addCollectionPaper should handle error", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 400,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.addCollectionPaper(stubCollection.id, 1))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/paper/collection", { collection_ids: 1, id: 1 });
                done();
            });
    });

    it("removeCollectionPaper should call axios.put", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.removeCollectionPaper(stubCollection.id, 1))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/paper/collection", { collection_ids: 1, id: 1 });
                done();
            });
    });

    it("removeCollectionPaper should handle error", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 400,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.removeCollectionPaper(stubCollection.id, 1))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/paper/collection", { collection_ids: 1, id: 1 });
                done();
            });
    });
    it("deleteCollection should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.deleteCollection(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { params: { id: 1 } });
                done();
            });
    });

    it("deleteCollection should handle collectionnotexist", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.deleteCollection(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { params: { id: 1 } });
                done();
            });
    });

    it("deleteCollection should handle autherror", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 403,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(collectionActions.deleteCollection(stubCollection.id))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("api/collection", { params: { id: 1 } });
                done();
            });
    });
});
