/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";

import "./CollectionManage.css";


class CollectionManage extends Component {
    constructor(props) {
        super(props);
        const collectionId = this.props.location.pathname.split("=")[1].split("/")[0];
        this.props.onGetCollection({ id: collectionId })
            .then(() => {
                if (this.props.collectionStatus !== collectionStatus.SUCCESS) {
                    this.props.history.push("/main");
                }
                return null;
            });
        this.state = {
            collectionName: this.props.selectedCollection.title,
            collectionDescription: this.props.selectedCollection.text,
        };
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (prevState.selectedCollection !== nextProps.selectedCollection) {
    //         return {
    //             collectionName: nextProps.selectedCollection.title,
    //             collectionDescription: nextProps.selectedCollection.text,
    //         };
    //     }
    //     return null;
    // }

    render() {
        return (
            <div className="CollectionManage">
                <div className="EditCollectionInfo">
                    <div className="EditCollectionName">
                        <h3 id="editNameTag">Collection Name</h3>
                        <textarea
                          id="editName"
                          rows="1"
                          type="text"
                          value={this.state.collectionName}
                          onChange={(event) => this.setState({
                              collectionName: event.target.value,
                          })}
                        />
                    </div>
                    <div className="EditCollectionDesc">
                        <h3 id="editDescTag">Collection Description</h3>
                        <textarea
                          id="editDescription"
                          rows="3"
                          type="text"
                          value={this.state.collectionDescription}
                          onChange={(event) => this.setState({
                              collectionDescrption: event.target.value,
                          })}
                        />
                    </div>
                    <div className="EditButtons">
                        <Button
                          id="UpdateCollectionButton"
                          onClick={() => this.onUpdateCollectionInfo({
                              title: this.state.newCollectionName,
                              text: this.state.newCollectionDescrption,
                          })}
                        >Update Collection
                        </Button>
                        <Link to={`/collection_id=${this.props.selectedCollection.id}`}>
                            <Button id="cancelButton">Cancel</Button>
                        </Link>
                    </div>
                </div>
                <div className="CollectionManageButtons" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    collectionStatus: state.collection.selected.status,
    selectedCollection: state.collection.selected.collection,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollection: (collectionId) => dispatch(collectionActions.getCollection(collectionId)),
    onUpdateCollectionInfo: (newCollectionInfo) => dispatch(
        collectionActions.setTitleAndDescription(newCollectionInfo),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionManage);

CollectionManage.propTypes = {
    selectedCollection: PropTypes.objectOf(PropTypes.any),
    collectionStatus: PropTypes.string,
    onGetCollection: PropTypes.func,
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
};

CollectionManage.defaultProps = {
    selectedCollection: {},
    collectionStatus: collectionStatus.NONE,
    onGetCollection: null,
    history: null,
    location: null,
};
