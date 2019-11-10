/* eslint-disable no-underscore-dangle */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Modal, FormControl, Button, Form,
} from "react-bootstrap";
import GoMyCollectionsModal from "../GoMyCollectionsModal/GoMyCollectionsModal";
import CollectionEntry from "../../Collection/CollectionEntry/CollectionEntry";
import "./AddPaperModal.css";
import { collectionActions, authActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";

class AddPaperModal extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            addPaperCollectionStatus: collectionStatus.NONE,
            makeNewCollectionStatus: collectionStatus.NONE,
            isAddPaperOpen: false,
            checkedCollections: [],
            collections: [],
            collectionName: "",
            me: null,
        };
        this.openAddPaperHandler = this.openAddPaperHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
        this.clickAddButtonHandler = this.clickAddButtonHandler.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        this.props.onGetMe()
            .then(() => {
                if (this._isMounted) {
                    this.setState({ me: this.props.me });

                    this.props.onGetCollections({ id: this.state.me.id })
                        .then(() => {
                            if (this._isMounted) {
                                this.setState({ collections: this.props.collectionList });
                            }
                        })
                        .catch(() => {});
                }
            })
            .catch(() => {});
    }

    componentWillUnmount() {
        this._isMounted = false;
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
        let collectionIds = this.state.checkedCollections;
        const paperId = this.props.id;
        let collectionsAndPaper = { id: paperId, collection_ids: collectionIds };
        if (this.state.collectionName.length > 0) {
            const newCollection = { title: this.state.collectionName, text: `This is ${this.state.collectionName} collection.` };
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
                        collectionIds = collectionIds.concat(this.props.selectedCollection.id);
                        collectionsAndPaper = { id: paperId, collection_ids: collectionIds };
                        this.props.onAddPaper(collectionsAndPaper);
                        break;
                    default:
                        this.setState({ makeNewCollectionStatus: collectionStatus.FAILURE });
                        break;
                    }
                });
        } else if (this.state.checkedCollections) {
            this.props.onAddPaper(collectionsAndPaper)
                .then(() => {
                    switch (this.props.addPaperCollectionStatus) {
                    case collectionStatus.SUCCESS:
                        this.setState({
                            addPaperCollectionStatus: collectionStatus.SUCCESS,
                            makeNewCollectionStatus: collectionActions.NONE,
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
    }

    render() {
        let gotoModal = null;
        if (this.state.addPaperCollectionStatus === collectionStatus.SUCCESS
            || this.state.makeNewCollectionStatus === collectionStatus.SUCCESS) {
            gotoModal = <GoMyCollectionsModal openTrigger history={this.props.history} />;
        }

        let collectionEntries = null;
        if (this.state.collections.length >= 1) {
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
    addPaperCollectionStatus: state.collection.edit.status,
    makeNewCollectionStatus: state.collection.make.status,
    collectionList: state.collection.list.list,
    selectedCollection: state.collection.make.collection,
    me: state.auth.me,

});

const mapDispatchToProps = (dispatch) => ({
    onGetCollections: (userId) => dispatch(
        collectionActions.getCollectionsByUserId(userId),
    ),
    onMakeNewCollection: (collection) => dispatch(
        collectionActions.makeNewCollection(collection),
    ),
    onAddPaper: (collectionsAndPaper) => dispatch(
        collectionActions.addCollectionPaper(collectionsAndPaper),
    ),
    onGetMe: () => dispatch(authActions.getMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPaperModal);


AddPaperModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    collectionList: PropTypes.arrayOf(PropTypes.any),
    selectedCollection: PropTypes.objectOf(PropTypes.any),
    onGetCollections: PropTypes.func,
    onMakeNewCollection: PropTypes.func,
    onAddPaper: PropTypes.func,
    id: PropTypes.number,
    addPaperCollectionStatus: PropTypes.string,
    makeNewCollectionStatus: PropTypes.string,
    me: PropTypes.objectOf(PropTypes.any),
    onGetMe: PropTypes.func,
};

AddPaperModal.defaultProps = {
    history: null,
    collectionList: [],
    selectedCollection: {},
    onGetCollections: () => {},
    onMakeNewCollection: () => {},
    onAddPaper: () => {},
    id: 0,
    addPaperCollectionStatus: collectionStatus.NONE,
    makeNewCollectionStatus: collectionStatus.NONE,
    me: null,
    onGetMe: () => {},
};
