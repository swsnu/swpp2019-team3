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
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";

class AddPaperModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddPaperOpen: false,
            beforeCheckedCollections: [],
            checkedCollections: [],
            collections: [],
            collectionName: "",
            collectionPageNum: 0,
            collectionFinished: true,
            loading: false,
        };

        this.modal = React.createRef();
        this.getCollectionsTrigger = this.getCollectionsTrigger.bind(this);
        this.equalTwoChecked = this.equalTwoChecked.bind(this);
        this.openAddPaperHandler = this.openAddPaperHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.clickUpdateButtonHandler = this.clickUpdateButtonHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    getCollectionsTrigger(pageNum) {
        this.props.onGetCollectionsWithContains({
            id: this.props.me.id, paper: this.props.paperId, page_number: pageNum + 1,
        })
            .then(() => {
                const { collections } = this.state;
                let { checkedCollections } = this.state;
                checkedCollections = checkedCollections.concat(this.props.collectionList.filter(
                    (collection) => collection.contains_paper === true,
                ).map((collection) => collection.id));
                this.setState({
                    collections: collections.concat(this.props.collectionList),
                    beforeCheckedCollections: checkedCollections,
                    checkedCollections,
                    collectionPageNum: this.props.collectionPageNum,
                    collectionFinished: this.props.collectionFinished,
                    loading: false,
                });
            })
            .catch(() => {});
    }


    handleScroll = () => {
        if (!this.state.loading
            && !this.state.collectionFinished
            && ((this.modal.current.scrollTop + this.modal.current.clientHeight + 200)
            > this.modal.current.scrollHeight)) {
            this.setState({
                loading: true,
            });
            this.getCollectionsTrigger(
                this.state.collectionPageNum,
            );
        }
    }

    equalTwoChecked = (before, curr) => before.sort().toString() === curr.sort().toString()

    openAddPaperHandler() {
        this.getCollectionsTrigger(0);
        this.setState({
            isAddPaperOpen: true,
        }, () => {
            this.modal.current.addEventListener("scroll", this.handleScroll);
        });
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

    clickCancelHandler() {
        const { beforeCheckedCollections } = this.state;
        this.setState({
            isAddPaperOpen: false,
            checkedCollections: beforeCheckedCollections,
            collectionName: "",
            collectionPageNum: 0,
            collectionFinished: true,
            collections: [],
        });
        this.modal.current.removeEventListener("scroll", this.handleScroll);
    }

    clickUpdateButtonHandler() {
        const { beforeCheckedCollections } = this.state;
        let collectionIds = this.state.checkedCollections;
        const { paperId } = this.props;
        let collectionsAndPaper = { id: paperId, collection_ids: collectionIds };

        // create new collection and update it with other collections
        if (this.state.collectionName.length > 0) {
            const newCollection = { title: this.state.collectionName, text: `This is ${this.state.collectionName} collection.` };
            this.props.onMakeNewCollection(newCollection)
                .then(() => {
                    if (this.props.makeNewCollectionStatus === collectionStatus.SUCCESS) {
                        collectionIds = collectionIds.concat(this.props.selectedCollection.id);
                        collectionsAndPaper = { id: paperId, collection_ids: collectionIds };
                        this.props.onAddPaper(collectionsAndPaper)
                            .then(() => {
                                this.setState({
                                    checkedCollections: beforeCheckedCollections,
                                    collectionName: "",
                                    collectionPageNum: 0,
                                    collectionFinished: true,
                                    collections: [],
                                });
                                this.getCollectionsTrigger(this.state.collectionPageNum);
                            });
                    }
                });
        // only add to or remove from existing collections
        } else if (!this.equalTwoChecked(this.state.beforeCheckedCollections,
            this.state.checkedCollections)) {
            this.props.onAddPaper(collectionsAndPaper)
                .then(() => {
                    if (this.props.addPaperCollectionStatus === collectionStatus.SUCCESS) {
                        this.setState({
                            collectionName: "",
                            collectionPageNum: 0,
                            collectionFinished: true,
                            collections: [],
                        });
                        this.getCollectionsTrigger(this.state.collectionPageNum);
                    }
                });
        }
    }

    render() {
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
                <Button className="addpaper-open-button" onClick={this.openAddPaperHandler}>Add to...</Button>
                <Modal
                  show={this.state.isAddPaperOpen}
                  onHide={this.clickCancelHandler}
                  className="addpaper-modal"
                  centered
                >
                    <Modal.Header className="modal-header">
                        <div className="header-content">
                            <div id="add-paper-to-my-collections">Add this Paper to Collections</div>
                            <div id="header-buttons">
                                <GoMyCollectionsModal
                                  className="gomycollectionsmodal"
                                  history={this.props.history}
                                  whatActionWillBeDone={this.clickUpdateButtonHandler}
                                  disableCondition={this.state.collectionName.length === 0
                                    && this.equalTwoChecked(this.state.beforeCheckedCollections,
                                        this.state.checkedCollections)}
                                />
                                <Button variant="secondary" className="cancel-button" onClick={this.clickCancelHandler}>Cancel</Button>
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Body ref={this.modal} className="ModalBody">
                        <FormControl
                          className="collection-name-input"
                          type="text"
                          placeholder="New Collection"
                          value={this.state.collectionName}
                          onChange={(e) => this.setState({ collectionName: e.target.value })}
                        />
                        <Form><Form.Group controlId="A" className="entry-board">{collectionEntries}</Form.Group></Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    addPaperCollectionStatus: state.collection.edit.status,
    makeNewCollectionStatus: state.collection.make.status,
    collectionList: state.collection.list.list,
    collectionPageNum: state.collection.list.pageNum,
    collectionFinished: state.collection.list.finished,
    selectedCollection: state.collection.make.collection,
    me: state.auth.me,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollectionsWithContains: (userAndPaper) => dispatch(
        collectionActions.getCollectionsByUserId(userAndPaper),
    ),
    onMakeNewCollection: (collection) => dispatch(
        collectionActions.makeNewCollection(collection),
    ),
    onAddPaper: (collectionsAndPaper) => dispatch(
        collectionActions.addCollectionPaper(collectionsAndPaper),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPaperModal);


AddPaperModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    collectionList: PropTypes.arrayOf(PropTypes.any),
    selectedCollection: PropTypes.objectOf(PropTypes.any),
    onGetCollectionsWithContains: PropTypes.func,
    onMakeNewCollection: PropTypes.func,
    onAddPaper: PropTypes.func,
    paperId: PropTypes.number,
    addPaperCollectionStatus: PropTypes.string,
    makeNewCollectionStatus: PropTypes.string,
    me: PropTypes.objectOf(PropTypes.any),
    collectionPageNum: PropTypes.number,
    collectionFinished: PropTypes.bool,
};

AddPaperModal.defaultProps = {
    history: null,
    collectionList: [],
    selectedCollection: {},
    onGetCollectionsWithContains: () => {},
    onMakeNewCollection: () => {},
    onAddPaper: () => {},
    paperId: 0,
    addPaperCollectionStatus: collectionStatus.NONE,
    makeNewCollectionStatus: collectionStatus.NONE,
    me: {},
    collectionPageNum: 0,
    collectionFinished: true,
};
