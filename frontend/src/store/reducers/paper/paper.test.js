import reducer, { getPaperStatus } from "./paper";
import { paperConstants } from "../../actions/actionTypes";

const stubPaper = {
    title: "paper_title",
    abstract: "paper_abstract",
};

const stubError = {
    response: {
        status: 404,
        data: {},
    },
};

describe("Paper reducer", () => {
    it("should return default state", () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual({
            getPaperStatus: getPaperStatus.NONE,
            selectedPaper: {},
        });
    });

    it("should handle getPaper success", () => {
        const newState = reducer(undefined, {
            type: paperConstants.GET_PAPER_SUCCESS,
            target: stubPaper,
        });
        expect(newState).toEqual({
            getPaperStatus: getPaperStatus.SUCCESS,
            selectedPaper: stubPaper,
        });
    });

    it("should handle getPaper failure", () => {
        const newState = reducer(undefined, {
            type: paperConstants.GET_PAPER_FAILURE,
            target: stubError,
        });
        expect(newState).toEqual({
            getPaperStatus: getPaperStatus.FAILURE,
            selectedPaper: {},
        });
    });
});
