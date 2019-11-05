import React, { Component } from "react";

import {
    Button
} from "react-bootstrap";
import { connect } from "react-redux";

class Test extends Component {

    test() {
        this.props.makeNewCollection()

    }
    render() {
        return (
            <div className = "test">
            <Button onClick={this.test()}>Test</Button>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        collectionStatus: state.collection,
        authStatus: state.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        makeNewCollection: (user, title, description) => {
            return dispatch(makeNewCollection(user, title, description));
        },
        getCollectionsByUserId: (userId) => {
            return dispatch(getCollectionsByUserId(userId));
        },
        getCollection: (collectionId) => {
            return dispatch(getCollection(collectionId));
        },
        getCollectionPapers: (collectionId) => {
            return dispatch(getCollectionPapers(collectionId));
        },
        setTitleAndDescription: (collectionId, title, description) => {
            return dispatch(setTitleAndDescription(collectionId, title, description));
        },
        addCollectionPaper: (collectionIds, paperId) => {
            return dispatch(addCollectionPaper(collectionIds, paperId));
        },
        removeCollectionPaper: (collectionIds, paperId) => {
            return dispatch(removeCollectionPaper(collectionIds, paperId));
        },
        deleteCollection: (collectionId) => {
            return dispatch(deleteCollection(collectionId));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Test));
