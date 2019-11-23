import axios from "axios";

import * as collectionActions from "./collection";

import { collectionStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    auth: {},
    paper: {},
    collection: {
        make: {
            status: collectionStatus.NONE,
            collection: {},
            error: -1,
        },
        list: {
            status: collectionStatus.NONE,
            list: [],
            error: -1,
        },
        edit: {
            status: collectionStatus.NONE,
            collection: {},
            error: -1,
        },
        delete: {
            status: collectionStatus.NONE,
            list: {},
            error: -1,
        },
        selected: {
            status: collectionStatus.NONE,
            collection: {},
            papers: [],
            members: [],
            replies: [],
            error: -1,
        },
        like: {
            status: collectionStatus.NONE,
            error: -1,
        },
        unlike: {
            status: collectionStatus.NONE,
            error: -1,
        },
    },
    user: {},
    review: {},
    reply: {},
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

        mockStore.dispatch(collectionActions.makeNewCollection({ title: "abc", text: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { text: "def", title: "abc" });
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

        mockStore.dispatch(collectionActions.makeNewCollection({ title: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { text: undefined, title: "def" });
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

        mockStore.dispatch(collectionActions.makeNewCollection({ title: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { text: undefined, title: "def" });
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

        mockStore.dispatch(collectionActions.getCollectionsByUserId({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection/user", { params: { id: stubUser.id } });
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

        mockStore.dispatch(collectionActions.getCollectionsByUserId({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection/user", { params: { id: 1 } });
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

        mockStore.dispatch(collectionActions.getCollectionsByUserId({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection/user", { params: { id: 1 } });
                done();
            });
    });


    it("get collection should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: [],
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.getCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { params: { id: 1 } });
                done();
            });
    });

    it("getCollection should handle collectionnotexist", (done) => {
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

        mockStore.dispatch(collectionActions.getCollection({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { params: { id: 1 } });
                done();
            });
    });

    it("getCollection should handle session expired", (done) => {
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

        mockStore.dispatch(collectionActions.getCollection({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { params: { id: 1 } });
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

        mockStore.dispatch(collectionActions.getCollectionPapers({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper/collection", { params: { id: stubCollection.id } });
                done();
            });
    });

    it("getCollectionPapers should handle error", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 404,
                        data: [],
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(collectionActions.getCollectionPapers({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper/collection", { params: { id: stubCollection.id } });
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

        mockStore.dispatch(collectionActions.setTitleAndDescription({ id: stubCollection.id, title: "dfd", text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { id: 1, text: "dfder", title: "dfd" });
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

        mockStore.dispatch(collectionActions.setTitleAndDescription({ id: stubCollection.id, title: "dfd", text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { id: 1, text: "dfder", title: "dfd" });
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

        mockStore.dispatch(collectionActions.setTitleAndDescription({ id: stubCollection.id, title: "dfd", text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { id: 1, text: "dfder", title: "dfd" });
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

        mockStore.dispatch(collectionActions.addCollectionPaper(
            { collection_ids: [stubCollection.id], id: 1 },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper/collection", { collection_ids: [1], id: 1 });
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

        mockStore.dispatch(collectionActions.addCollectionPaper(
            { collection_ids: [stubCollection.id], id: 1 },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper/collection", { collection_ids: [1], id: 1 });
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

        mockStore.dispatch(collectionActions.removeCollectionPaper(
            { collection_ids: [stubCollection.id], id: 1 },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper/collection", { collection_ids: [1], id: 1 });
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

        mockStore.dispatch(collectionActions.removeCollectionPaper(
            { collection_ids: [stubCollection.id], id: 1 },
        ))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper/collection", { collection_ids: [1], id: 1 });
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

        mockStore.dispatch(collectionActions.deleteCollection({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { params: { id: 1 } });
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

        mockStore.dispatch(collectionActions.deleteCollection({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { params: { id: 1 } });
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

        mockStore.dispatch(collectionActions.deleteCollection({ id: stubCollection.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection", { params: { id: 1 } });
                done();
            });
    });


    it("'likeCollection' should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.likeCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/collection", { id: 1 });
                done();
            });
    });

    it("'likeCollection' should handle failure", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(collectionActions.likeCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/collection", { id: 1 });
                done();
            });
    });


    it("'unlikeCollection' should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.unlikeCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/collection", { params: { id: 1 } });
                done();
            });
    });

    it("'unlikeCollection' should handle failure", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((_, reject) => {
                const error = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(error);
            }));

        mockStore.dispatch(collectionActions.unlikeCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/collection", { params: { id: 1 } });
                done();
            });
    });


    it("'searchCollection' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(collectionActions.searchCollection({ text: "a" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection/search", { params: { text: "a" } });
                done();
            });
    });

    it("'searchCollection' should handle failure", (done) => {
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

        mockStore.dispatch(collectionActions.searchCollection({ text: "a" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/collection/search", { params: { text: "a" } });
                done();
            });
    });
});
