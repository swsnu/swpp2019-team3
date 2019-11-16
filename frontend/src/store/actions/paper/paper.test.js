import axios from "axios";

import { paperActions } from "..";
import { paperStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    paper: {
        getPaperStatus: paperStatus.NONE,
        likePaperStatus: paperStatus.NONE,
        unlikePaperStatus: paperStatus.NONE,
        selectedPaper: {},
    },
    auth: {},
    collection: {},
    user: {},
    review: {},
};
const mockStore = getMockStore(stubInitialState);

describe("paperActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    it("'getPaper' should call axios.get", (done) => {
        const spy = jest.spyOn(axios, "get")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(paperActions.getPaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper", { params: { id: 1 } });
                done();
            });
    });

    it("'getPaper' should handle failure", (done) => {
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

        mockStore.dispatch(paperActions.getPaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper", { params: { id: 1 } });
                done();
            });
    });

    it("'getPaper' should handle session expired", (done) => {
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

        mockStore.dispatch(paperActions.getPaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/paper", { params: { id: 1 } });
                done();
            });
    });


    it("'likePaper' should call axios.post", (done) => {
        const spy = jest.spyOn(axios, "post")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 201,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(paperActions.likePaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/paper", { id: 1 });
                done();
            });
    });

    it("'likePaper' should handle failure", (done) => {
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

        mockStore.dispatch(paperActions.likePaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/paper", { id: 1 });
                done();
            });
    });


    it("'unlikePaper' should call axios.delete", (done) => {
        const spy = jest.spyOn(axios, "delete")
            .mockImplementation(() => new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {},
                };
                resolve(result);
            }));

        mockStore.dispatch(paperActions.unlikePaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/paper", { params: { id: 1 } });
                done();
            });
    });

    it("'unlikePaper' should handle failure", (done) => {
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

        mockStore.dispatch(paperActions.unlikePaper({ id: 1 }))
            .then(() => {
                expect(spy).toHaveBeenCalledWith("/api/like/paper", { params: { id: 1 } });
                done();
            });
    });
});
