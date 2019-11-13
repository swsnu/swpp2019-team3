import axios from "axios";

import { paperActions } from "..";
import { getPaperStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";

const stubInitialState = {
    paper: {
        getPaperStatus: getPaperStatus.NONE,
        selectedPaper: {},
    },
    auth: {},
    collection: {},
    user: {},
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
});
