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
            search: {
                status: paperStatus.NONE,
                papers: [],
                pageNum: 0,
                finished: true,
            },
            likeCount: 0,
            unlikePaperStatus: paperStatus.NONE,
            unlikeCount: 0,
            selectedPaper: {},
            getLikedPapers: {
                status: paperStatus.NONE,
                list: [],
                pageNum: 0,
                finished: true,
            },
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


    it("should handle searchPaper success", () => {
        const newState = reducer(undefined, {
            type: paperConstants.SEARCH_PAPER_SUCCESS,
            target: [],
        });
        expect(newState.search.status).toEqual(paperStatus.SUCCESS);
    });

    it("should handle searchPaper failure", () => {
        const newState = reducer(undefined, {
            type: paperConstants.SEARCH_PAPER_FAILURE,
            target: stubError,
        });
        expect(newState.search.status).toEqual(paperStatus.FAILURE);
    });

    it("should handle getPaperLike success", () => {
        const newState = reducer(undefined, {
            type: paperConstants.GET_PAPER_LIKE_SUCCESS,
            target: [],
        });
        expect(newState.getLikedPapers.status).toEqual(paperStatus.SUCCESS);
    });

    it("should handle getPaperLike failure", () => {
        const newState = reducer(undefined, {
            type: paperConstants.GET_PAPER_LIKE_FAILURE,
            target: stubError,
        });
        expect(newState.getLikedPapers.status).toEqual(paperStatus.FAILURE);
    });
});
