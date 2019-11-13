import axios from "axios";

import * as reviewActions from "./review";
import { reviewStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    auth: {},
    paper: {},
    collection: {},
    review: {
        make: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
        },
        list: {
            status: reviewStatus.NONE,
            list: [],
            error: null,
        },
        edit: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
        },
        delete: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
        },
        selected: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
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

const stubReview = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    title: "SWPP",
    text: "SWPP2019fall",
};

describe("reviewActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("'makeNeReview should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(reviewActions.makeNewReview({ title: "abc", text: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { text: "def", title: "abc" });
                done();
            });
    });

    it("'makeNewReview should handle missing-parameter error", (done) => {
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

        mockStore.dispatch(reviewActions.makeNewReview({ title: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { text: undefined, title: "def" });
                done();
            });
    });

    it("'makeNewReview should handle not-existing-paper", (done) => {
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

        mockStore.dispatch(reviewActions.makeNewReview({ title: "def", text: "dfa" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { text: "dfa", title: "def" });
                done();
            });
    });

    it("'makeNewReview should handle unknown error", (done) => {
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

        mockStore.dispatch(reviewActions.makeNewReview({ title: "def" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { text: undefined, title: "def" });
                done();
            });
    });

    it("getReviewsByUserId should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubReview,
                };
                resolve(result);
            }));

        mockStore.dispatch(reviewActions.getReviewsByUserId({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review/user", { params: { id: stubUser.id } });
                done();
            });
    });

    it("getReviewsByUserId should handle error", (done) => {
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

        mockStore.dispatch(reviewActions.getReviewsByUserId({ id: stubUser.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review/user", { params: { id: 1 } });
                done();
            });
    });

    it("getReviewsByPaperId should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubReview,
                };
                resolve(result);
            }));

        mockStore.dispatch(reviewActions.getReviewsByPaperId({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review/paper", { params: { id: 1 } });
                done();
            });
    });

    it("getReviewsByPaperId should handle error", (done) => {
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

        mockStore.dispatch(reviewActions.getReviewsByPaperId({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review/paper", { params: { id: 1 } });
                done();
            });
    });

    it("get review should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubReview,
                };
                resolve(result);
            }));

        mockStore.dispatch(reviewActions.getReview({id:1}))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { params:  {id:1}  });
                done();
            });
    });

    it("getReview should handle reviewnotexist", (done) => {
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

        mockStore.dispatch(reviewActions.getReview({ id: stubReview.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { params: { id: 1 } });
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

        mockStore.dispatch(reviewActions.setReviewContent({ id: stubReview.id, title: "dfd", text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { id: 1, text: "dfder", title: "dfd" });
                done();
            });
    });

    it("setTitleandDescription should handle reviewnotexist", (done) => {
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

        mockStore.dispatch(reviewActions.setReviewContent({ id: stubReview.id, title: "dfd", text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { id: 1, text: "dfder", title: "dfd" });
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

        mockStore.dispatch(reviewActions.setReviewContent({ id: stubReview.id, title: "dfd", text: "dfder" }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { id: 1, text: "dfder", title: "dfd" });
                done();
            });
    });

    it("deleteReview should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(reviewActions.deleteReview({ id: stubReview.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { params: { id: 1 } });
                done();
            });
    });

    it("deleteReview should handle reviewnotexist", (done) => {
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

        mockStore.dispatch(reviewActions.deleteReview({ id: stubReview.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { params: { id: 1 } });
                done();
            });
    });

    it("deleteReview should handle autherror", (done) => {
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

        mockStore.dispatch(reviewActions.deleteReview({ id: stubReview.id }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/review", { params: { id: 1 } });
                done();
            });
    });
});
