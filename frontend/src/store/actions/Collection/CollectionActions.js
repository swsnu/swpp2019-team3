//will implement actions for collection here
import * as actionTypes from '../ActionTypes';
import axios from 'axios';

// makeNewCollection(user_id: number, title: string, description: string) -> Promise<{status: number, data: Collection}>: Call backend api to make a new collection.
export const makeNewCollection = (userID, title, description) => {
    return dispatch => {
        let newCollection = {};
        return axios.post('/collection', newCollection)
            .then(res => dispatch({
                type: actionTypes.ADD_COLLECTION, newCollection: newCollection,
        }));
    };
};

// getCollectionsByUserId(user_id: number) -> Promise<{status: number, data: Collection[]}>: Call backend api to get collections of a user.
export const getCollectionsByUserId = (userID) => {
    return dispatch => {
        return axios.get('/collection/user/'+userID)
            .then(res => dispatch({
                type: actionTypes.GET_COLLECTION, collections: res.data
        }));
    };
};

// getCollection(collection_id: number) -> Promise<{status: number, data: Collection}>: Call backend api to get collection.
export const getCollection = (collectionID) => {
    return dispatch => {
        return axios.get('/collection/'+collectionID)
            .then(res => dispatch({
                type: actionTypes.GET_COLLECTION, selectedCollection: res.data
        }));
    };
};

// getCollectionPapers(collection_id: number) -> Promise<{status: number, data: Paper[]}>: Call backend api to get papers of the collection.
export const getCollectionPapers = (collectionID) => {
    return dispatch => {
        return axios.get('/paper/collection/'+collectionID)
            .then(res => dispatch({
                type: actionTypes.GET_COLLECTION_PAPERS, papers: res.data
        }));
    };
};

// getCollectionMembers(collection_id: number) -> Promise<{status: number, data: User[]}>: Call backend api to get members of the collection.
export const getCollectionMembers = (collectionID) => {
    return dispatch => {
        return axios.get('/user/collection/'+collectionID)
            .then(res => dispatch({
                type: actionTypes.GET_COLLECTION_MEMBERS, members: res.data
        }));
    };
};

// getCollectionReplies(collection_id: number) -> Promise<{status: number, data: Reply[]}>: Call backend api to get replies of the collection.
export const getCollectionReplies = (collectionID) => {
    return dispatch => {
        return axios.get('/reply/collection/'+collectionID)
            .then(res => dispatch({
                type: actionTypes.GET_COLLECTION_REPLIES, replies: res.data
        }));
    };
};

// setOwner(collection_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to change the owner of the collection.
export const setOwner = (collectionID, userID) => {
    return dispatch => {
        return axios.put('/collection/'+collectionID, {userID: userID})
            .then(res => dispatch({
                type: actionTypes.CHANGE_COLLECTION_OWNER, newOwnerID: userID
        }));
    };
};

// setNameAndDescription(collection_id: nubmer, title: string, description: string) -> Promise<{status: number, data: Collection}>: Call backend api to to change the name and description of the collection.
export const setNameAndDescription = (collectionID, title, description) => {
    return dispatch => {
        return axios.put('/collection/'+collectionID, {title: title, description: description})
            .then(res => dispatch({
                type: actionTypes.EDIT_COLLECTION, editedCollection: res.data
        }));
    };
};

// addCollectionPaper(collection_id: number, paper_id: number) -> Promise<{status: number, data: Collection}>: Call backend api to add the paper to the collection.
export const addCollectionPaper = (collectionID, paperID) => {
    return dispatch => {
        return axios.post('/paper/collection/'+collectionID, paperID)
            .then(res => dispatch({
                type: actionTypes.ADD_COLLECTION_PAPER, editedCollection: res.data
        }));
    };
};

// removeCollectionPaper(collection_id: number, paper_id: number) -> Promise<{status: number, data: Paper}>: Call backend api to remove the paper from the collection.
export const removeCollectionPaper = (collectionID, paperID) => {
    return dispatch => {
        return axios.delete('/paper/collection/'+collectionID, paperID)
            .then(res => dispatch({
                type: actionTypes.DEL_COLLECTION_PAPER, editedCollection: res.data
        }));
    };
};

// addCollectionMember(collection_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to add the user to members of the collection.
export const addCollectionMember = (collectionID, userID) => {
    return dispatch => {
        return axios.post('/user/collection/'+collectionID, userID)
            .then(res => dispatch({
                type: actionTypes.ADD_COLLECTION_MEMBER, members: res.data
        }));
    };
};

// removeCollectionMember(collection_id: number, user_id: number) -> Promise<{status: number, data: User}>: Call backend api to remove the user from members of the collection.
export const removeCollectionMember = (collectionID, userID) => {
    return dispatch => {
        return axios.delete('/user/collection/'+collectionID, userID)
            .then(res => dispatch({
                type: actionTypes.DEL_COLLECTION_MEMBER, members: res.data
        }));
    };
};

// deleteCollection(collection_id: number) -> Promise<{status: number, data: Collection}>: Call backend api to delete the collection.
export const deleteCollection = (collectionID) => {
    return dispatch => {
        return axios.delete('/collection/'+collectionID)
            .then(res => dispatch({
                type: actionTypes.DEL_COLLECTION, members: res.data
        }));
    };
};

// // getCollectionLikesCount(collection_id: number) -> Promise<{status: number, data: number}>: Call backend api to get the number of users who like the collection.
// export const getCollectionLikesCount = (collectionID) => {
//     return dispatch => {
//         return axios.get()
//             .then(res => dispatch({
//                 type: GET_COLLECION_MEMBERS, members: res.data
//         }));
//     };
// };

// // getCollectionIsLiked(collection_id: number, user_id: number) -> Promise<{status: number, data: boolean}>: Call backend api to check if the user likes the collection.
// export const getCollectionIsLiked = (collectionID) => {
//     return dispatch => {
//         return axios.get()
//             .then(res => dispatch({
//                 type: GET_COLLECION_MEMBERS, members: res.data
//         }));
//     };
// };

// // addCollectionLike(collection_id: number, user_id: number) -> Promise<{status: number, data: Collection}>: Call backend api to add the user to the list of the users who like the collection.
// export const addCollectionLike = (collectionID) => {
//     return dispatch => {
//         return axios.get()
//             .then(res => dispatch({
//                 type: GET_COLLECION_MEMBERS, members: res.data
//         }));
//     };
// };

// // removeCollectionLike(collection_id: number, user_id: number) -> Promise<{status: number, data: Collection}>: Call backend api to remove the user from the list of the users who like the collection.
// export const removeCollectionLike = (collectionID) => {
//     return dispatch => {
//         return axios.get()
//             .then(res => dispatch({
//                 type: GET_COLLECION_MEMBERS, members: res.data
//         }));
//     };
// };