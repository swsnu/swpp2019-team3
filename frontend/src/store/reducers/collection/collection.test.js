import reducer from "./collection";
import { collectionStatus } from "../../../constants/constants";
import { collectionConstants } from "../../actions/actionTypes";

const stubInitialState = {
    make: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
    },
    list: {
        status: collectionStatus.NONE,
        list: [],
        error: null,
        pageNum: 0,
        finished: true,
    },
    sharedList: {
        status: collectionStatus.NONE,
        list: [],
        error: null,
        pageNum: 0,
        finished: true,
    },
    edit: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
    },
    delete: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
    },
    selected: {
        status: collectionStatus.NONE,
        collection: {},
        error: null,
        papers: {},
        memberCount: 0,
        replies: [],
    },
    like: {
        status: collectionStatus.NONE,
        count: 0,
        error: null,
    },
    unlike: {
        status: collectionStatus.NONE,
        count: 0,
        error: null,
    },
    getMembers: {
        status: collectionStatus.NONE,
        members: [],
        pageNum: 0,
        finished: true,
        error: null,
    },
};

const stubCollection = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    title: "SWPP",
    text: "SWPP2019fall",
};

const stubMembers = [
    "stub", "members", "test",
];

const stubError = {
    response: {
        status: 440,
        data: {},
    },
};

describe("Collection reducer", () => {
    it("should return defualt state", () => {
        const newState = reducer(stubInitialState, {
            type: "Abc",
            target: "fddf",
        });
        expect(newState).toEqual(stubInitialState);
    });

    it("should return add_collection state", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION,
            target: stubCollection,
        });
        expect(newState.make.status).toBe(collectionStatus.SUCCESS);
        expect(newState.make.collection).toBe(stubCollection);
    });

    it("should return add_collection_failure_missing_param", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION_FAILURE_MISSING_PARAM,
            target: stubCollection,
        });
        expect(newState.make.status).toBe(collectionStatus.MISSING_PARAM);
        expect(newState.make.error).toBe(stubCollection);
    });


    it("should return get_collections", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTIONS_SUCCESS,
            target: { collections: [stubCollection], pageNum: 1, finished: true },
        });
        expect(newState.list.status).toBe(collectionStatus.SUCCESS);
        expect(newState.list.list).toEqual([stubCollection]);
    });

    it("should return get_collections_failure", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTIONS_FAILURE,
            target: stubError,
        });
        expect(newState.list.status).toBe(collectionStatus.FAILURE);
        expect(newState.list.error).toBe(stubError);
    });


    it("should return get_shared_collections", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_SHARED_COLLECTIONS_SUCCESS,
            target: { collections: [stubCollection], pageNum: 1, finished: true },
        });
        expect(newState.sharedList.status).toBe(collectionStatus.SUCCESS);
        expect(newState.sharedList.list).toEqual([stubCollection]);
    });

    it("should return get_shared_collections_failure", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_SHARED_COLLECTIONS_FAILURE,
            target: stubError,
        });
        expect(newState.sharedList.status).toBe(collectionStatus.FAILURE);
        expect(newState.sharedList.error).toBe(stubError);
    });


    it("should return get_collection", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTION,
            target: stubCollection,
        });
        expect(newState.selected.status).toBe(collectionStatus.SUCCESS);
        expect(newState.selected.collection).toBe(stubCollection);
    });

    it("should return get_collection_failure_collection_not_exist", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTION_FAILURE_COLLECTION_NOT_EXIST,
            target: stubCollection,
        });
        expect(newState.selected.status).toBe(collectionStatus.COLLECTION_NOT_EXIST);
        expect(newState.selected.error).toBe(stubCollection);
    });

    it("should return get_collection_papers", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTION_PAPERS_SUCCESS,
            target: { papers: [], page_number: 1, is_finished: true },
        });
        expect(newState.selected.status).toBe(collectionStatus.SUCCESS);
        expect(newState.selected.papers.papers).toEqual([]);
    });

    it("should handle get_collection_papers_failure", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTION_PAPERS_FAILURE,
            target: stubError,
        });
        expect(newState.selected.status).toBe(collectionStatus.FAILURE);
        expect(newState.selected.error).toBe(stubError);
    });

    it("should handle get_collection_members_success", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTION_MEMBERS_SUCCESS,
            target: { members: stubMembers, pageNum: 1, finished: true },
        });
        expect(newState.getMembers.status).toBe(collectionStatus.SUCCESS);
        expect(newState.getMembers.members).toBe(stubMembers);
    });

    it("should handle get_collection_members_failure", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.GET_COLLECTION_MEMBERS_FAILURE,
            target: stubError,
        });
        expect(newState.getMembers.status).toBe(collectionStatus.FAILURE);
        expect(newState.getMembers.error).toBe(stubError);
    });

    it("should return set_owner", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.SET_OWNER,
        });
        // it really does nothing in reducer
        expect(newState.selected.status).toBe(collectionStatus.NONE);
    });

    it("should return set_owner_failure_auth_error", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.SET_OWNER_FAILURE_AUTH_ERROR,
            target: "error",
        });
        expect(newState.selected.status).toBe(collectionStatus.AUTH_ERROR);
        expect(newState.selected.error).toBe("error");
    });

    it("should return edit_collection", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.EDIT_COLLECTION,
            target: stubCollection,
        });
        expect(newState.edit.status).toBe(collectionStatus.SUCCESS);
        expect(newState.edit.collection).toBe(stubCollection);
    });

    it("should return edit_collection_papers_failure_collection_not_exist", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.EDIT_COLLECTION_FAILURE_COLLECTION_NOT_EXIST,
            target: stubCollection,
        });
        expect(newState.edit.status).toBe(collectionStatus.COLLECTION_NOT_EXIST);
        expect(newState.edit.error).toBe(stubCollection);
    });


    it("should return edit_collection_failure_collection_auth_error", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.EDIT_COLLECTION_FAILURE_AUTH_ERROR,
            target: stubCollection,
        });
        expect(newState.edit.status).toBe(collectionStatus.AUTH_ERROR);
        expect(newState.edit.error).toBe(stubCollection);
    });

    it("should return add_collection_papers", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION_PAPER,
            target: stubCollection,
        });
        expect(newState.edit.status).toBe(collectionStatus.SUCCESS);
        expect(newState.edit.collection).toBe(stubCollection);
    });

    it("should return delete_collection_paper", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION_PAPER,
            target: stubCollection,
        });
        expect(newState.edit.status).toBe(collectionStatus.SUCCESS);
        expect(newState.edit.collection).toBe(stubCollection);
    });

    it("should return add_collection_member", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION_MEMBER,
            target: { users: 7 },
        });
        expect(newState.selected.status).toBe(collectionStatus.SUCCESS);
        expect(newState.selected.memberCount).toBe(7);
    });

    it("should return add_collection_member_failure_not_authorized", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION_MEMBER_FAILURE_NOT_AUTHORIZED,
            target: "error",
        });
        expect(newState.selected.status).toBe(collectionStatus.AUTH_ERROR);
        expect(newState.selected.error).toBe("error");
    });

    it("should return add_collection_member_failure_self_adding", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION_MEMBER_FAILURE_SELF_ADDING,
            target: "error",
        });
        expect(newState.selected.status).toBe(collectionStatus.USER_SELF_ADDING);
        expect(newState.selected.error).toBe("error");
    });

    it("should return del_collection_member", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION_MEMBER,
            target: { users: 3 },
        });
        expect(newState.selected.status).toBe(collectionStatus.SUCCESS);
        expect(newState.selected.memberCount).toBe(3);
    });

    it("should return del_collection_member_failure_not_authorized", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION_MEMBER_FAILURE_NOT_AUTHORIZED,
            target: "error",
        });
        expect(newState.selected.status).toBe(collectionStatus.AUTH_ERROR);
        expect(newState.selected.error).toBe("error");
    });

    it("should return del_collection_member_failure_more_than_usercount", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION_MEMBER_FAILURE_MORE_THAN_USERCOUNT,
            target: "error",
        });
        expect(newState.selected.status).toBe(collectionStatus.FAILURE);
        expect(newState.selected.error).toBe("error");
    });

    it("should return delete_collection", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION,
            target: stubCollection,
        });
        expect(newState.delete.status).toBe(collectionStatus.SUCCESS);
        expect(newState.delete.collection).toBe(stubCollection);
    });

    it("should return delete_collection_failure_auth_error", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION_FAILURE_AUTH_ERROR,
            target: stubCollection,
        });
        expect(newState.delete.status).toBe(collectionStatus.AUTH_ERROR);
        expect(newState.delete.error).toBe(stubCollection);
    });


    it("should return delete_collection_failure_not_exist", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.DEL_COLLECTION_FAILURE_COLLECTION_NOT_EXIST,
            target: stubCollection,
        });
        expect(newState.delete.status).toBe(collectionStatus.COLLECTION_NOT_EXIST);
        expect(newState.delete.error).toBe(stubCollection);
    });


    it("should return like_collection_success state", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.LIKE_COLLECTION_SUCCESS,
            target: { likes: 1 },
        });
        expect(newState.like.status).toBe(collectionStatus.SUCCESS);
    });

    it("should return like_collection_failure state", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.LIKE_COLLECTION_FAILURE,
            target: stubError,
        });
        expect(newState.like.status).toBe(collectionStatus.FAILURE);
    });


    it("should return unlike_collection_success state", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.UNLIKE_COLLECTION_SUCCESS,
            target: { likes: 1 },
        });
        expect(newState.unlike.status).toBe(collectionStatus.SUCCESS);
    });

    it("should return unlike_collection_failure state", () => {
        const newState = reducer(stubInitialState, {
            type: collectionConstants.UNLIKE_COLLECTION_FAILURE,
            target: stubError,
        });
        expect(newState.unlike.status).toBe(collectionStatus.FAILURE);
    });


    it("should handle searchCollection success", () => {
        const newState = reducer(undefined, {
            type: collectionConstants.SEARCH_COLLECTION_SUCCESS,
            target: [],
        });
        expect(newState.list.status).toEqual(collectionStatus.SUCCESS);
    });

    it("should handle searchCollection failure", () => {
        const newState = reducer(undefined, {
            type: collectionConstants.SEARCH_COLLECTION_FAILURE,
            target: stubError,
        });
        expect(newState.list.status).toEqual(collectionStatus.FAILURE);
    });

    it("should handle getCollectionLike success", () => {
        const newState = reducer(undefined, {
            type: collectionConstants.GET_COLLECTION_LIKE_SUCCESS,
            target: [],
        });
        expect(newState.list.status).toEqual(collectionStatus.SUCCESS);
    });

    it("should handle getCollectionLike failure", () => {
        const newState = reducer(undefined, {
            type: collectionConstants.GET_COLLECTION_LIKE_FAILURE,
            target: stubError,
        });
        expect(newState.list.status).toEqual(collectionStatus.FAILURE);
    });

    it("should handle changeCollectionType success", () => {
        const newState = reducer(undefined, {
            type: collectionConstants.CHANGE_COLLECTION_TYPE_SUCCESS,
            target: stubCollection,
        });
        expect(newState.selected.collection).toEqual(stubCollection);
    });

    it("should handle changeCollectionType failure", () => {
        const newState = reducer(undefined, {
            type: collectionConstants.CHANGE_COLLECTION_TYPE_FAILURE,
            target: stubError,
        });
        expect(newState.selected.error).toEqual(stubError);
    });
});
