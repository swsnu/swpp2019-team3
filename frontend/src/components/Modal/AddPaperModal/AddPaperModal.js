import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Modal, FormControl, Button, Form,
} from "react-bootstrap";
import GoMyCollectionsModal from "../GoMyCollectionsModal/GoMyCollectionsModal";
import CollectionEntry from "../../Collection/CollectionEntry/CollectionEntry";
import "./AddPaperModal.css";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";

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
        this.clickAddButtonHandler = this.clickAddButtonHandler.bind(this);
    }

    componentDidMount() {
        this.props.onGetCollections({id: 1})
        .then(() => {
            this.setState({collections: this.props.collectionList});
        });
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

    clickAddButtonHandler() {
        if (this.state.collectionName !== "") {
            this.props.onMakeNewCollection({title: this.state.collectionName, text: " "})
            .then(() => {
                this.state.checkedCollections.push(this.props.selectedCollection);
            }
            )
        }

        if (this.state.checkedCollections.length >= 1) {
            this.props.onAddPaper({id: this.props.id, collection_ids: JSON.stringify(this.state.checkedCollections) })
            .then(()=>{
                this.setState({
                    addPaperCollectionStatus: collectionStatus.SUCCESS,
                })
            })
        }

    }

    render() {
        let gotoModal = null;
        if (this.state.addPaperCollectionStatus === collectionStatus.SUCCESS) {
            gotoModal = <GoMyCollectionsModal openTrigger history={this.props.history} />;
        }

        let collectionEntries = null;
        if ( this.state.collections.length >= 1) {
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

const mapStateToProps = (state) => ({
    collectionList: state.collection.list.list,
    selectedCollection: state.collection.make.collection,

});

const mapDispatchToProps = (dispatch) => ({
    onGetCollections: (userId) => dispatch(
        collectionActions.getCollectionsByUserId(userId)
    ),
    onMakeNewCollection: (collection) => dispatch(
        collectionActions.makeNewCollection(collection)
    ),
    onAddPaper: (collectionsAndPaper) => dispatch(
        collectionActions.addCollectionPaper(collectionsAndPaper)
    ),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddPaperModal);


AddPaperModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    collectionList: PropTypes.arrayOf(PropTypes.any),
    selectedCollection: PropTypes.objectOf(PropTypes.any),
    onGetCollections: PropTypes.func,
    onMakeNewCollection: PropTypes.func,
    id: PropTypes.number,
};

AddPaperModal.defaultProps = {
    history: null,
    collectionList: [],
    selectedCollection: {},
    onGetCollections: () => {},
    onMakeNewCollection: () => {},
    id: 0,
};


