import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

import { collectionActions } from "../../../store/actions";

class CreateNewCollectionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            newCollectionName: "",
            newCollectionDesc: "",
            type: "public",
        };
        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCreateHandler = this.clickCreateHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.handleCheckPrivate = this.handleCheckPrivate.bind(this);
    }

    clickOpenHandler = () => {
        this.setState({ isModalOpen: true });
    }

    clickCreateHandler = () => {
        const newCollectionDesc = this.state.newCollectionDesc.length > 0
            ? this.state.newCollectionDesc : `This is ${this.state.newCollectionName} collection.`;

        this.props.onCreateNewCollection({
            title: this.state.newCollectionName,
            text: newCollectionDesc,
            type: this.state.type,
        })
            .then(() => {
                this.props.whatActionWillFollow();
                this.setState({
                    isModalOpen: false,
                    newCollectionName: "",
                    newCollectionDesc: "",
                });
            });
    }

    clickCancelHandler = () => {
        this.setState({
            isModalOpen: false,
            newCollectionName: "",
            newCollectionDesc: "",
        });
    }

    handleCheckPrivate() {
        if (this.state.type === "public") {
            this.setState({ type: "private" });
        } else {
            this.setState({ type: "public" });
        }
    }

    render() {
        return (
            <div className="CreateNewCollectionModal">
                <div id="openButtonDiv">
                    <Button
                      variant="outline-success"
                      id="createModalOpenButton"
                      onClick={this.clickOpenHandler}
                    >
                        New Collection
                    </Button>
                </div>
                <Modal id="createModal" show={this.state.isModalOpen} onHide={this.clickCancelHandler} centered>
                    <Modal.Header>
                        <h5 id="createHeaderText">Create New Collection</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="nameDiv">
                            <h5 id="newCollectionNameText">Title: </h5>
                            <textarea
                              id="newCollectionNameInput"
                              rows="1"
                              cols="50"
                              type="text"
                              placeholder="enter new collection name"
                              value={this.state.newCollectionName}
                              onChange={(event) => this.setState({
                                  newCollectionName: event.target.value,
                              })}
                            />
                        </div>
                        <div id="descDiv">
                            <h5 id="newCollectionDescText">Description: </h5>
                            <textarea
                              id="newCollectionDescInput"
                              rows="3"
                              cols="55"
                              type="text"
                              placeholder="enter new collection description (optional)"
                              value={this.state.newCollectionDesc}
                              onChange={(event) => this.setState({
                                  newCollectionDesc: event.target.value,
                              })}
                            />
                        </div>
                        <label
                          id="private-check-label"
                          htmlFor="create-collection-private-check"
                        >
                            <input
                              type="checkbox"
                              className="private-check"
                              id="create-collection-private-check"
                              checked={this.state.private}
                              onChange={() => this.handleCheckPrivate()}
                            />
                             Make Invisible to everyone other than Members
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                          id="createButton"
                          onClick={this.clickCreateHandler}
                          disabled={this.state.newCollectionName === ""}
                        >
                            Create
                        </Button>
                        <Button variant="outline-dark" id="cancelButton" onClick={this.clickCancelHandler}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
});

const mapDispatchToProps = (dispatch) => ({
    onCreateNewCollection: (collection) => dispatch(
        collectionActions.makeNewCollection(collection),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCollectionModal);

CreateNewCollectionModal.propTypes = {
    onCreateNewCollection: PropTypes.func,
    whatActionWillFollow: PropTypes.func,
};

CreateNewCollectionModal.defaultProps = {
    onCreateNewCollection: () => {},
    whatActionWillFollow: () => {},
};
