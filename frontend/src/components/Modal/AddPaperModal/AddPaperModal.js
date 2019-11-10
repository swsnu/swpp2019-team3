import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Modal, FormControl, Button, Form,
} from "react-bootstrap";

import { collectionStatus } from "../../../constants/constants";
import GoMyCollectionsModal from "../GoMyCollectionsModal/GoMyCollectionsModal";
import CollectionEntry from "../../Collection/CollectionEntry/CollectionEntry";
import "./AddPaperModal.css";

class AddPaperModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addPaperCollectionStatus: collectionStatus.NONE,
            makeNewCollectionStatus: collectionStatus.NONE,
            isAddPaperOpen: false,
            checkedCollections: [],
            collections: [],
            collectionName: "",
        };
        this.openAddPaperHandler = this.openAddPaperHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
    }

    componentDidMount() {

    }

    openAddPaperHandler() {
        this.setState({ isAddPaperOpen: true });
    }

    checkHandler(collection) {
        const beforeCheckedCollections = this.state.checkedCollections;
        if (beforeCheckedCollections.includes(collection.id)) {
            this.setState({
                checkedCollections: beforeCheckedCollections.filter((id) => id !== collection.id),
            });
        } else {
            this.setState({
                checkedCollections: beforeCheckedCollections.concat(collection.id),
            });
        }
    }

    clickCancelButtonHandler() {
        this.setState({
            addPaperCollectionStatus: collectionStatus.NONE,
            makeNewCollectionStatus: collectionStatus.NONE,
            isAddPaperOpen: false,
            checkedCollections: [],
            collectionName: "",
        });
    }

    render() {
        let gotoModal = null;
        if (this.state.addPaperCollectionStatus === collectionStatus.SUCCESS
            || this.state.makeNewCollectionStatus === collectionStatus.SUCCESS) {
            gotoModal = <GoMyCollectionsModal openTrigger history={this.props.history} />;
        }

        let collectionEntries = null;
        if (this.state.collections.length > 1) {
            collectionEntries = this.state.collections.map((collection) => (
                <CollectionEntry
                  key={collection.id}
                  id={collection.id}
                  title={collection.title}
                  ischecked={this.state.checkedCollections.includes(collection.id)}
                  checkhandler={() => this.checkHandler(collection)}
                />
            ));
        }

        return (
            <div className="addpapermodal">
                <div className="buttons">
                    <Button className="addpaper-open-button" onClick={this.openAddPaperHandler}>Add to...</Button>
                </div>
                <Modal
                  show={this.state.isAddPaperOpen}
                  className="addpaper-modal"
                  centered
                >
                    <Modal.Header className="modal-header">
                        <div id="add-paper-to-my-collections">Add Paper to My Collections</div>
                        <div id="header-buttons">
                            <Button
                              className="add-button"
                              onClick={this.clickAddButtonHandler}
                              disabled={false}
                            >Add
                            </Button>
                            <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl
                          className="collection-name-input"
                          type="text"
                          placeholder="New Collection"
                          value={this.state.collectionName}
                          onChange={(e) => this.setState({ collectionName: e.target.value })}
                        />
                        <Form><Form.Group controlId="A" className="entry-board">{collectionEntries}</Form.Group></Form>
                    </Modal.Body>
                    {/* <Modal.Footer>
                    </Modal.Footer> */}
                </Modal>
                {gotoModal}
            </div>
        );
    }
}

export default AddPaperModal;

AddPaperModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

AddPaperModal.defaultProps = {
    history: null,
};
