import UserReducer from "./UserReducer";
import { userStatus } from "../../../constants/constants";
import { userConstants } from "../../actions/actionTypes";

const stubInitialState = {
    userSearchResult: [],
    selectedUser: null,
    selectedFollowers: [],
    selectedFollowings: [],
    status: userStatus.NONE,
    error: null,
};

const stubUser = {
    id: 1,
    creation_data: "2019-11-05",
    modification_data: "2019-11-06",
    username: "Girin",
    description: "Goyang",
    email: "ggg@naver.com",
    password: "010",
};

const stubError = {
    error: "this is a stub error",
};

const stubFollowers = [];
const stubFollowings = [];

describe("UserReducer Test", () => {
    it("should return default state", () => {
        const newState = UserReducer(stubInitialState, {
            type: "noTypeLikeThis",
            target: "Meooooowwwwww",
        });
        expect(newState).toEqual(stubInitialState);
    });

    it("should handle GET_USER", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.GET_USER,
            target: stubUser,
        });
        expect(newState.status).toBe(userStatus.SUCCESS);
        expect(newState.selectedUser).toBe(stubUser);
    });

    it("should handle 'GET_USER_FAILURE_USER_NOT_EXIST'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.GET_USER_FAILURE_USER_NOT_EXIST,
            target: stubError,
        });
        expect(newState.status).toBe(userStatus.USER_NOT_EXIST);
        expect(newState.error).toBe(stubError);
    });

    it("should handle 'GET_FOLLOWERS'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.GET_FOLLOWERS,
            target: stubFollowers,
        });
        expect(newState.selectedFollowers).toBe(stubFollowers);
        expect(newState.status).toBe(userStatus.SUCCESS);
    });

    it("should handle 'GET_FOLLOWERS_FAILURE_USER_NOT_EXIST'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.GET_FOLLOWERS_FAILURE_USER_NOT_EXIST,
            target: stubError,
        });
        expect(newState.status).toBe(userStatus.USER_NOT_EXIST);
        expect(newState.error).toBe(stubError);
    });

    it("should handle 'GET_FOLLOWINGS'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.GET_FOLLOWINGS,
            target: stubFollowings,
        });
        expect(newState.selectedFollowings).toBe(stubFollowings);
        expect(newState.status).toBe(userStatus.SUCCESS);
    });

    it("should handle 'GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.GET_FOLLOWINGS_FAILURE_USER_NOT_EXIST,
            target: stubError,
        });
        expect(newState.status).toBe(userStatus.USER_NOT_EXIST);
        expect(newState.error).toBe(stubError);
    });

    // NOTE : This test may need to be modified
    it("should handle 'ADD_FOLLOWING'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.ADD_FOLLOWING,
            // target: ,
        });
        expect(newState.status).toBe(userStatus.SUCCESS);
    });

    it("should handle 'ADD_FOLLOWING_FAILURE_SELF_FOLLOWING'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.ADD_FOLLOWING_FAILURE_SELF_FOLLOWING,
            target: stubError,
        });
        expect(newState.status).toBe(userStatus.SELF_FOLLOWING);
        expect(newState.error).toBe(stubError);
    });

    // NOTE : This test may need to be modified
    it("should handle 'DEL_FOLLOWING'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.DEL_FOLLOWING,
            // target: ,
        });
        expect(newState.status).toBe(userStatus.SUCCESS);
    });

    it("should handle 'EDIT_USER'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.EDIT_USER,
            target: stubUser,
        });
        expect(newState.status).toBe(userStatus.SUCCESS);
        expect(newState.selectedUser).toBe(stubUser);
    });

    it("should handle 'EDIT_USER_FAILURE_USER_NOT_EXIST'", () => {
        const newState = UserReducer(stubInitialState, {
            type: userConstants.EDIT_USER_FAILURE_USER_NOT_EXIST,
            target: stubError,
        });
        expect(newState.status).toBe(userStatus.USER_NOT_EXIST);
        expect(newState.error).toBe(stubError);
    });
});
