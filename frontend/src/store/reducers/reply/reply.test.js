import ReplyReducer from "./reply";
import { replyStatus } from "../../../constants/constants";
import { replyConstants } from "../../actions/actionTypes";

const stubInitialState = {
    make: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    list: {
        status: replyStatus.NONE,
        list: [],
        error: null,
    },
    edit: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    delete: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    selected: {
        status: replyStatus.NONE,
        reply: {},
        error: null,
    },
    like: {
        status: replyStatus.NONE,
        count: 0,
        error: null,
    },
    unlike: {
        status: replyStatus.NONE,
        count: 0,
        error: null,
    },
};

const stubReply = {
    id: 1,
    text: "SWPP2019fall",
};

const stubError = {
    response: {
        status: 440,
        data: {},
    },
};

describe("Reply reducer", () => {
    it("should return defualt state", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: "Abc",
            target: "fddf",
        });
        expect(newState).toEqual(stubInitialState);
    });

    it("should return add_reply state", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.ADD_REPLY_SUCCESS,
            target: stubReply,
        });
        expect(newState.make.status).toBe(replyStatus.SUCCESS);
        expect(newState.make.reply).toBe(stubReply);
    });

    it("should return add_reply_failure_missing_param", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.ADD_REPLY_FAILURE_MISSING_PARAM,
            target: stubReply,
        });
        expect(newState.make.status).toBe(replyStatus.MISSING_PARAM);
        expect(newState.make.error).toBe(stubReply);
    });

    it("should return add_reply_failure_review_not_exist", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.ADD_REPLY_FAILURE_REVIEW_NOT_EXIST,
            target: stubReply,
        });
        expect(newState.make.status).toBe(replyStatus.REVIEW_NOT_EXIST);
        expect(newState.make.error).toBe(stubReply);
    });

    it("should return add_reply_failure_collection_not_exist", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.ADD_REPLY_FAILURE_COLLECTION_NOT_EXIST,
            target: stubReply,
        });
        expect(newState.make.error).toBe(stubReply);
        expect(newState.make.status).toBe(replyStatus.COLLECTION_NOT_EXIST);
    });

    it("should return get_replies_by_collection", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.GET_REPLIES_BY_COLLECTION_SUCCESS,
            target: { replies: [stubReply] },
        });
        expect(newState.list.status).toBe(replyStatus.SUCCESS);
        expect(newState.list.list[0]).toBe(stubReply);
    });

    it("should return get_replys_by_review", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.GET_REPLIES_BY_REVIEW_SUCCESS,
            target: { replies: stubReply },
        });
        expect(newState.list.status).toBe(replyStatus.SUCCESS);
        expect(newState.list.list).toBe(stubReply);
    });

    it("should return get_replies_by_collection", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.GET_REPLIES_BY_COLLECTION_SUCCESS,
            target: { replies: stubReply },
        });
        expect(newState.list.status).toBe(replyStatus.SUCCESS);
        expect(newState.list.list).toBe(stubReply);
    });

    it("should return edit_reply", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.EDIT_REPLY_SUCCESS,
            target: stubReply,
        });
        expect(newState.edit.status).toBe(replyStatus.SUCCESS);
        expect(newState.edit.reply).toBe(stubReply);
    });

    it("should return edit_reply_failure_reply_not_exist", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.EDIT_REPLY_FAILURE_REPLY_NOT_EXIST,
            target: stubReply,
        });
        expect(newState.edit.status).toBe(replyStatus.REPLY_NOT_EXIST);
        expect(newState.edit.error).toBe(stubReply);
    });


    it("should return edit_reply_failure_auth_error", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.EDIT_REPLY_FAILURE_AUTH_ERROR,
            target: stubReply,
        });
        expect(newState.edit.status).toBe(replyStatus.AUTH_ERROR);
        expect(newState.edit.error).toBe(stubReply);
    });

    it("should return delete_reply", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.DEL_REPLY_SUCCESS,
            target: stubReply,
        });
        expect(newState.delete.status).toBe(replyStatus.SUCCESS);
        expect(newState.delete.reply).toBe(stubReply);
    });

    it("should return delete_reply_failure_auth_error", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.DEL_REPLY_FAILURE_AUTH_ERROR,
            target: stubReply,
        });
        expect(newState.delete.status).toBe(replyStatus.AUTH_ERROR);
        expect(newState.delete.error).toBe(stubReply);
    });


    it("should return delete_reply_failure_reply_not_exist", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.DEL_REPLY_FAILURE_REPLY_NOT_EXIST,
            target: stubReply,
        });
        expect(newState.delete.status).toBe(replyStatus.REPLY_NOT_EXIST);
        expect(newState.delete.error).toBe(stubReply);
    });


    it("should return like_reply_success state", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.LIKE_REPLY_SUCCESS,
            target: { likes: 1 },
        });
        expect(newState.like.status).toBe(replyStatus.SUCCESS);
    });

    it("should return like_reply_failure state", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.LIKE_REPLY_FAILURE,
            target: stubError,
        });
        expect(newState.like.status).toBe(replyStatus.FAILURE);
    });


    it("should return unlike_reply_success state", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.UNLIKE_REPLY_SUCCESS,
            target: { likes: 1 },
        });
        expect(newState.unlike.status).toBe(replyStatus.SUCCESS);
    });

    it("should return unlike_reply_failure state", () => {
        const newState = ReplyReducer(stubInitialState, {
            type: replyConstants.UNLIKE_REPLY_FAILURE,
            target: stubError,
        });
        expect(newState.unlike.status).toBe(replyStatus.FAILURE);
    });
});
