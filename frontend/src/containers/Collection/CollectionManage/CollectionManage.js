import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import { TransferOwnershipModal, WarningModal, ManageCollectionMemberModal } from "../../../components";

import "./CollectionManage.css";

class CollectionManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionName: "",
            collectionDescription: "",
        };

        this.updateCollectionHandler = this.updateCollectionHandler.bind(this);
    }

    componentDidMount() {
        const collectionId = this.props.location.pathname.split("=")[1].split("/")[0];
        this.props.onGetCollection({ id: collectionId })
            .then(() => {
                if (this.props.collectionStatus !== collectionStatus.SUCCESS) {
                    this.props.history.push("/main");
                } else {
                    if (!this.props.selectedCollection.owned) {
                        this.props.history.goBack();
                    }
                    this.setState({
                        collectionName: this.props.selectedCollection.title,
                        collectionDescription: this.props.selectedCollection.text,
                    });
                }
            })
            .catch(() => {});
    }

    updateCollectionHandler = () => {
        this.props.onUpdateCollectionInfo({
            id: this.props.selectedCollection.id,
            title: this.state.collectionName,
            text: this.state.collectionDescription,
        })
            .then(() => {
                this.props.onGetCollection({ id: this.props.selectedCollection.id });
                // message or popup that says "collection is updated" may need to be implemented
            })
            .catch(() => {});
    }

    render() {
        let beforeName = null;
        let beforeDescription = null;
        if (this.props.selectedCollection) {
            beforeName = this.props.selectedCollection.title;
            beforeDescription = this.props.selectedCollection.text;
        }

        return (
            <div className="CollectionManage">
                <h2 id="collectionManageTitle">
                        Manage Collection: {this.props.selectedCollection.title}
                </h2>
                <div className="EditCollectionInfo">
                    <div className="EditCollectionItem">
                        <h3 id="editNameTag">Collection Name</h3>
                        <input
                          id="editName"
                          type="text"
                          value={this.state.collectionName}
                          onChange={(event) => this.setState({
                              collectionName: event.target.value,
                          })}
                        />
                    </div>
                    <div className="EditCollectionItem">
                        <h3 id="editDescTag">Collection Description</h3>
                        <textarea
                          id="editDescription"
                          rows="3"
                          type="text"
                          value={this.state.collectionDescription}
                          onChange={(event) => this.setState({
                              collectionDescription: event.target.value,
                          })}
                        />
                    </div>
                    <div className="EditButtons">
                        <Button
                          id="updateCollectionButton"
                          onClick={this.updateCollectionHandler}
                          disabled={this.state.collectionName === ""
                            || (beforeName === this.state.collectionName
                                && beforeDescription === this.state.collectionDescription)}
                        >Update Collection
                        </Button>
                        <Button id="cancelButton" href={`/collection_id=${this.props.selectedCollection.id}`}>
                            Cancel
                        </Button>
                        {this.state.collectionName === ""
                            ? <h5 id="updateButtonDisableMessage">The name of collection should not be null</h5>
                            : <div />}
                    </div>
                </div>
                <div className="CollectionManageButtons">
                    <div className="ManageButtonItems">
                        <h5 className="ManageButtonText" id="manageMemberText">
                            Looks for current members of this collections,
                            invite new members, or kick off some.
                        </h5>
                        <ManageCollectionMemberModal />
                    </div>
                    <div className="ManageButtonItems">
                        <div className="ManageButtonText" id="transferOwnershipText">
                            <h5>
                                Transfer the ownership of this collection
                                to the other member of this collection.
                            </h5>
                            <h5>WARNING: This action cannot be undone.</h5>
                        </div>
                        <TransferOwnershipModal history={this.props.history} />
                    </div>
                    <div className="ManageButtonItems">
                        <div className="ManageButtonText" id="deleteCollectionText">
                            <h5>Delete this collection.</h5>
                            <h5>WARNING: This action cannot be undone.</h5>
                        </div>
                        <WarningModal
                          openButtonText="Delete this collection"
                          whatToWarnText={`Delete colelction: ${this.props.selectedCollection.title}`}
                          whatActionWillBeDone={() => this.props.onDeleteCollection(
                              this.props.selectedCollection.id,
                          )}
                          whatActionWillFollow={() => this.props.history.replace("/collections")}
                          history={this.props.history}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
    collectionStatus: state.collection.selected.status,
    selectedCollection: state.collection.selected.collection,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollection: (collectionId) => dispatch(collectionActions.getCollection(collectionId)),
    onUpdateCollectionInfo: (newCollectionInfo) => dispatch(
        collectionActions.setTitleAndDescription(newCollectionInfo),
    ),
    onDeleteCollection: (collectionId) => dispatch(
        collectionActions.deleteCollection(collectionId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionManage);

CollectionManage.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),

    selectedCollection: PropTypes.objectOf(PropTypes.any),
    collectionStatus: PropTypes.string,

    onGetCollection: PropTypes.func,
    onUpdateCollectionInfo: PropTypes.func,
    onDeleteCollection: PropTypes.func,
};

CollectionManage.defaultProps = {
    history: null,
    location: null,

    selectedCollection: {},
    collectionStatus: collectionStatus.NONE,

    onGetCollection: () => {},
    onUpdateCollectionInfo: () => {},
    onDeleteCollection: () => {},
};
