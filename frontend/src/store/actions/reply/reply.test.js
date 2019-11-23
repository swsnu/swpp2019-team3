import axios from "axios";

import * as replyActions from "./reply";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    auth: {},
    paper: {},
    collection: {},
    review: {},
    user: {},
    reply: {},
};

const mockStore = getMockStore(stubInitialState);

const stubReply = {
    id: 1,
    text: "SWPP2019fall",
};

describe("replyActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("'makeNewreplyreview should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(replyActions.makeNewReplyReview({ id: 1, text: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { text: "def", id: 1 });
                done();
            });

        mockStore.dispatch(replyActions.makeNewReplyCollection({ id: 1, text: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { text: "def", id: 1 });
                done();
            });
    });

    it("'makeNewReply should handle missing-parameter error", (done) => {
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

        mockStore.dispatch(replyActions.makeNewReplyReview({ text: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: undefined, text: "def" });
                done();
            });

        mockStore.dispatch(replyActions.makeNewReplyCollection({ text: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: undefined, text: "def" });
                done();
            });
    });

    it("'makeNewReply should handle not-existing-review/collection", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 404,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(replyActions.makeNewReplyReview({ id: 1, text: "dfa" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: 1, text: "dfa" });
                done();
            });

        mockStore.dispatch(replyActions.makeNewReplyCollection({ id: 1, text: "dfa" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: 1, text: "dfa" });
                done();
            });
    });

    it("'makeNewReply should handle unknown error", (done) => {
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

        mockStore.dispatch(replyActions.makeNewReplyReview({ title: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: undefined, text: undefined, title: "def" });
                done();
            });

        mockStore.dispatch(replyActions.makeNewReplyCollection({ title: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: undefined, text: undefined, title: "def" });
                done();
            });
    });

    it("getReplies should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubReply,
                };
                resolve(result);
            }));

        mockStore.dispatch(replyActions.getRepliesByReview({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { params: { id: 1 } });
                done();
            });

        mockStore.dispatch(replyActions.getRepliesByCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { params: { id: 1 } });
                done();
            });
    });

    it("getReplies should handle error", (done) => {
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

        mockStore.dispatch(replyActions.getRepliesByReview({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { params: { id: 1 } });
                done();
            });

        mockStore.dispatch(replyActions.getRepliesByCollection({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { params: { id: 1 } });
                done();
            });
    });

    it("editReply should call axios.put", (done) => {
        const spy = jest.spyOn(axios, "put")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(replyActions.editReplyReview({ id: 1, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: 1, text: "dfder" });
                done();
            });

        mockStore.dispatch(replyActions.editReplyCollection({ id: 1, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: 1, text: "dfder" });
                done();
            });
    });

    it("editReply should handle replynotexist", (done) => {
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

        mockStore.dispatch(replyActions.editReplyReview({ id: 1, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: 1, text: "dfder" });
                done();
            });

        mockStore.dispatch(replyActions.editReplyCollection({ id: 1, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: 1, text: "dfder" });
                done();
            });
    });

    it("editReply should handle autherror", (done) => {
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

        mockStore.dispatch(replyActions.editReplyReview({ id: 2, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: 2, text: "dfder" });
                done();
            });


        mockStore.dispatch(replyActions.editReplyCollection({ id: 2, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: 2, text: "dfder" });
                done();
            });
    });

    it("editReply should handle session expired", (done) => {
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

        mockStore.dispatch(replyActions.editReplyReview({ id: 1, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { id: 1, text: "dfder" });
                done();
            });

        mockStore.dispatch(replyActions.editReplyCollection({ id: 1, text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { id: 1, text: "dfder" });
                done();
            });
    });


    it("deleteReply should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(replyActions.deleteReplyReview({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { params: { id: 1 } });
                done();
            });

        mockStore.dispatch(replyActions.deleteReplyCollection({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { params: { id: 1 } });
                done();
            });
    });

    it("deletereply should handle replynotexist", (done) => {
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

        mockStore.dispatch(replyActions.deleteReplyReview({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { params: { id: 1 } });
                done();
            });

        mockStore.dispatch(replyActions.deleteReplyCollection({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { params: { id: 1 } });
                done();
            });
    });

    it("deletereply should handle autherror", (done) => {
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

        mockStore.dispatch(replyActions.deleteReplyReview({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { params: { id: 1 } });
                done();
            });

        mockStore.dispatch(replyActions.deleteReplyCollection({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { params: { id: 1 } });
                done();
            });
    });

    it("deletereply should handle session expired", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((_, reject) => {
                const result = {
                    response: {
                        status: 440,
                        data: {},
                    },
                };
                reject(result);
            }));

        mockStore.dispatch(replyActions.deleteReplyReview({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/review", { params: { id: 1 } });
                done();
            });

        mockStore.dispatch(replyActions.deleteReplyCollection({ id: stubReply.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/reply/collection", { params: { id: 1 } });
                done();
            });
    });


    it("'likereply' should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(replyActions.likeReply({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/reply", { id: 1 });
                done();
            });
    });

    it("'likereply' should handle failure", (done) => {
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

        mockStore.dispatch(replyActions.likeReply({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/reply", { id: 1 });
                done();
            });
    });


    it("'unlikereply' should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(replyActions.unlikeReply({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/reply", { params: { id: 1 } });
                done();
            });
    });

    it("'unlikereply' should handle failure", (done) => {
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

        mockStore.dispatch(replyActions.unlikeReply({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/reply", { params: { id: 1 } });
                done();
            });
    });
});
