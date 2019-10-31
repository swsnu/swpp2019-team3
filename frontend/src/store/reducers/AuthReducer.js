import * as actionTypes from '../actions/ActionTypes';

const initialState = {
    status: "",
    isLoggedIn: false,
    currentUserID: -1,
}

// Details should be implemented
const AuthReducer = (state = initialState, action) => {
    switch (action.type){
        default:
            break;
    };
    return state;
};

export default AuthReducer;