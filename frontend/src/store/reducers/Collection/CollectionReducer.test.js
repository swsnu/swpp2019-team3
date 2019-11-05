import CollectionReducer from "./CollectionReducer";
import { collectionStatus } from "../../../constants/constants";
import { collectionConstants } from "../../actions/actionTypes";

const stubUser = {
    id: 1,
    username: "Girin",
};

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
        error: null,
        collection: {},
        papers: [],
        members: [],
        replies: [],
    },
};

const stubCollection = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    title: "SWPP",
    text: "SWPP2019fall",
};

describe("Colelction CollectionReducer", () => {
    it("should return defualt state", () => {
        const newState = CollectionReducer(stubInitialState, {
            type: "Abc",
            target: "fddf",
        });
        expect(newState).toEqual(stubInitialState);
    });

    it("should return add_collection state", () => {
        const newState = CollectionReducer(stubInitialState, {
            type: collectionConstants.ADD_COLLECTION,
            target: stubCollection,
        });
        expect(newState.make.status).toBe(collectionStatus.SUCCESS);
        expect(newState.make.collection).toBe(stubCollection);
    });

    it("should r")
});
