import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Modal, FormControl, Button, Form,
} from "react-bootstrap";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import CollectionEntry from "../../Collection/CollectionEntry/CollectionEntry";
import "./AddPaperModal.css";
import GoMyCollectionsModal from "../GoMyCollectionsModal/GoMyCollectionsModal";

class AddPaperModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addPaperCollectionStatus: collectionStatus.NONE,
            makeNewCollectionStatus: collectionStatus.NONE,
            isAddPaperOpen: false,
            checkedCollections: [1, 3, 4],
            collections: [],
            collectionName: "",
            openGotoModal: false,
        };
        this.openAddPaperHandler = this.openAddPaperHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.clickAddButtonHandler = this.clickAddButtonHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
    }

    componentDidMount() {
        this.props.onGetCollections()
            .then(() => {
                this.setState({ collections: this.props.storedCollections });
            });
    }

    openAddPaperHandler() {
        this.props.onGetCollections();
        this.setState({ isAddPaperOpen: true });
    }

    checkHandler(collection) {
        const beforeCheckedCollections = this.state.checkedCollections;
        if (collection.id in beforeCheckedCollections) {
            // console.log(`uncheck${collection.id}`);
            this.setState({ checkedCollections: beforeCheckedCollections.filter((id) => id !== collection.id) });
        } else {
            // console.log(`check${collection.id}`);
            this.setState({ checkedCollections: beforeCheckedCollections.concat(collection.id) });
        }
    }

    clickAddButtonHandler() {
        if (this.state.checkedCollections) {
            const collectionIds = this.state.checkedCollections;
            const paperId = this.props.id;
            const collectionsAndPaper = { id: paperId, collection_ids: collectionIds };
            // console.log(collectionsAndPaper);
            this.props.onAddPaper(collectionsAndPaper)
                .then(() => {
                    switch (this.props.addPaperCollectionStatus) {
                    case collectionStatus.SUCCESS:
                        this.setState({
                            addPaperCollectionStatus: collectionStatus.SUCCESS,
                            makeNewCollectionStatus: collectionStatus.NONE,
                            isAddPaperOpen: false,
                            checkedCollections: [],
                            collectionName: "",
                        });
                        break;
                    default:
                        this.setState({ addPaperCollectionStatus: collectionStatus.FAILURE });
                        break;
                    }
                });
        }

        if (this.state.collectionName.length > 0) {
            const newCollection = { title: this.state.collectionName, text: "empty description" };
            // console.log(newCollection);
            this.props.onMakeNewCollection(newCollection)
                .then(() => {
                    switch (this.props.makeNewCollectionStatus) {
                    case collectionStatus.SUCCESS:
                        this.setState({
                            addPaperCollectionStatus: collectionStatus.NONE,
                            makeNewCollectionStatus: collectionStatus.SUCCESS,
                            isAddPaperOpen: false,
                            checkedCollections: [],
                            collectionName: "",
                        });
                        // this.props.onAddPaper(collectionsAndPaper);
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
        let gotoModal = null;
        if (this.state.addPaperCollectionStatus === collectionStatus.SUCCESS
            || this.state.makeNewCollectionStatus === collectionStatus.SUCCESS) {
            gotoModal = <GoMyCollectionsModal openTrigger history={this.props.history} />;
        }

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
                    <Modal.Footer>
                        <Button
                          className="add-button"
                          onClick={this.clickAddButtonHandler}
                          disabled={false}
                        >Add
                        </Button>
                    </Modal.Footer>
                </Modal>
                {gotoModal}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
    addPaperCollectionStatus: state.collection.edit.status,
    makeNewCollectionStatus: state.collection.make.status,
    getCollectionsStatus: state.collection.list.status,
    storedCollections: state.collection.list.list,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewCollection: (newCollection) => dispatch(collectionActions.makeNewCollection(newCollection)),
    onAddPaper: (collectionsAndPaper) => dispatch(
        collectionActions.addCollectionPaper(collectionsAndPaper),
    ),
    onGetCollections: () => dispatch(collectionActions.getCollectionsByUserId()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPaperModal);

AddPaperModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    me: PropTypes.objectOf(PropTypes.any),
    id: PropTypes.number,
    onMakeNewCollection: PropTypes.func,
    onAddPaper: PropTypes.func,
    onGetCollections: PropTypes.func,
    addPaperCollectionStatus: PropTypes.string,
    makeNewCollectionStatus: PropTypes.string,
};

AddPaperModal.defaultProps = {
    history: null,
    me: null,
    id: -1,
    onMakeNewCollection: null,
    onAddPaper: null,
    onGetCollections: null,
    addPaperCollectionStatus: collectionStatus.NONE,
    makeNewCollectionStatus: collectionStatus.NONE,
};
