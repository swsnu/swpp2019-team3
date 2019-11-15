import reducer from "./paper";
import { paperConstants } from "../../actions/actionTypes";
import { paperStatus } from "../../../constants/constants";

const stubPaper = {
    title: "paper_title",
    abstract: "paper_abstract",
};

const stubError = {
    response: {
        status: 440,
        data: {},
    },
};

describe("Paper reducer", () => {
    it("should return default state", () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual({
            getPaperStatus: paperStatus.NONE,
            likePaperStatus: paperStatus.NONE,
            likeCount: 0,
            unlikePaperStatus: paperStatus.NONE,
            unlikeCount: 0,
            selectedPaper: {},
        });
    });

    it("should handle getPaper success", () => {
        const newState = reducer(undefined, {
            type: paperConstants.GET_PAPER_SUCCESS,
            target: stubPaper,
        });
        expect(newState.getPaperStatus).toEqual(paperStatus.SUCCESS);
    });

    it("should handle getPaper failure", () => {
        const newState = reducer(undefined, {
            type: paperConstants.GET_PAPER_FAILURE,
            target: stubError,
        });
        expect(newState.getPaperStatus).toEqual(paperStatus.FAILURE);
    });


    it("should handle likePaper success", () => {
        const newState = reducer(undefined, {
            type: paperConstants.LIKE_PAPER_SUCCESS,
            target: { likes: 1 },
        });
        expect(newState.likePaperStatus).toEqual(paperStatus.SUCCESS);
    });

    it("should handle likePaper failure", () => {
        const newState = reducer(undefined, {
            type: paperConstants.LIKE_PAPER_FAILURE,
            target: stubError,
        });
        expect(newState.likePaperStatus).toEqual(paperStatus.FAILURE);
    });


    it("should handle unlikePaper success", () => {
        const newState = reducer(undefined, {
            type: paperConstants.UNLIKE_PAPER_SUCCESS,
            target: { likes: 1 },
        });
        expect(newState.unlikePaperStatus).toEqual(paperStatus.SUCCESS);
    });

    it("should handle unlikePaper failure", () => {
        const newState = reducer(undefined, {
            type: paperConstants.UNLIKE_PAPER_FAILURE,
            target: stubError,
        });
        expect(newState.unlikePaperStatus).toEqual(paperStatus.FAILURE);
    });
});
