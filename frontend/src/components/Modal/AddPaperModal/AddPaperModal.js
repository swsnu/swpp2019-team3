import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import CollectionEntry from "../../Collection/CollectionEntry/CollectionEntry";
import "./AddPaperModal.css";

class AddPaperModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addPaperCollectionStatus: collectionStatus.NONE,
            makeNewCollectionStatus: collectionStatus.NONE,
            isAddPaperOpen: false,
            checkedCollections: [1, 3, 4],
            collections: [
                { id: 1, title: "collection_1" },
                { id: 2, title: "collection_2" },
                { id: 3, title: "collection_3" },
                { id: 4, title: "collection_4" },
            ],
            collectionName: "",
        };
        this.openAddPaperHandler = this.openAddPaperHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.clickAddButtonHandler = this.clickAddButtonHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
    }

    openAddPaperHandler() {
        this.setState({ isAddPaperOpen: true });
    }

    checkHandler(collection) {
        const beforeCheckedCollections = this.state.checkedCollections;
        if (collection.id in beforeCheckedCollections) {
            console.log(`uncheck${collection.id}`);
            this.setState({ checkedCollections: beforeCheckedCollections.filter((id) => id !== collection) });
        } else {
            console.log(`check${collection.id}`);
            this.setState({ checkedCollections: beforeCheckedCollections.concat(collection) });
        }
    }

    clickAddButtonHandler() {
        const collectionIds = this.state.checkedCollections;
        const paperId = 0;
        const newCollection = { title: this.state.collectionName, text: "empty description" };
        if (this.state.collectionName.length > 0) {
            this.props.onMakeNewCollection(newCollection)
                .then(() => {
                    switch (this.props.makeNewCollectionStatus) {
                    case collectionStatus.SUCCESS:
                        this.clickCancelButtonHandler();
                        break;
                    default:
                        this.setState({ makeNewCollectionStatus: collectionStatus.FAILURE });
                        break;
                    }
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
        let collectionEntries = null;
        if (this.state.collections) {
            collectionEntries = this.state.collections.map((collection) => (
                <CollectionEntry
                  key={collection.id}
                  id={collection.id}
                  title={collection.title}
                  isChecked={this.state.checkedCollections.includes(collection)}
                  checkHandler={() => this.checkHandler(collection)}
                />
            ));
        }

        return (
            <div className="addpapermodal">
                <div className="buttons">
                    <Button className="addpaper-open-button" onClick={this.openAddPaperHandler}>Add</Button>
                </div>
                <Modal
                  show={this.state.isAddPaperOpen}
                  className="addpaper-modal"
                  centered
                >
                    <Modal.Header>
                        <h2 id="add-paper-to-my-collections">Add Paper to My Collections</h2>
                        <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                        <FormControl
                          className="collection-name-input"
                          type="text"
                          placeholder="New Collection"
                          value={this.state.collectionName}
                          onChange={(e) => this.setState({ collectionName: e.target.value })}
                        />
                    </Modal.Header>
                    <Modal.Body>
                        {collectionEntries}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                          className="add-button"
                          onClick={this.clickAddButtonHandler}
                          disabled={false}
                        >Add
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    addPaperCollectionStatus: state.collection.collectionStatus,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewCollection: (newCollection) => dispatch(collectionActions.makeNewCollection(newCollection)),
    onAddPaper: (collectionIds, paperId) => dispatch(
        collectionActions.addCollectionPaper(collectionIds, paperId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPaperModal);

AddPaperModal.propTypes = {
    onMakeNewCollection: PropTypes.func,
    onAddPaper: PropTypes.func,
    addPaperCollectionStatus: PropTypes.string,
};

AddPaperModal.defaultProps = {
    onMakeNewCollection: null,
    onAddPaper: null,
    addPaperCollectionStatus: collectionStatus.NONE,
};
