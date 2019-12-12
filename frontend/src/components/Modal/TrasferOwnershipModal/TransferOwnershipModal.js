import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

import { collectionActions } from "../../../store/actions";
import WarningModal from "../WarningModal/WarningModal";
import UserEntry from "../../User/UserEntry/UserEntry";

import "./TransferOwnershipModal.css";

class TransferOwnershipModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            selectedUserId: -1,
            selectedUserName: "",
            members: [],
            memberPageNum: 0,
            memberFinished: true,
            loading: false,
        };

        this.modal = React.createRef();
        this.getMembersTrigger = this.getMembersTrigger.bind(this);
        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll = () => {
        if (!this.state.loading
            && !this.state.memberFinished
            && this.modal.current.scrollTop + this.modal.current.clientHeight + 50
            > this.modal.current.scrollHeight) {
            this.setState({
                loading: true,
            });
            this.getMembersTrigger(this.state.memberPageNum);
        }
    }

    getMembersTrigger = (pageNum) => {
        this.props.onGetMembers(this.props.thisCollection.id, pageNum + 1, false)
            .then(() => {
                const { members } = this.state;
                this.setState({
                    members: members.concat(this.props.members),
                    memberPageNum: this.props.memberPageNum,
                    memberFinished: this.props.memberFinished,
                    loading: false,
                });
            })
            .catch(() => {});
    }

    clickOpenHandler = () => {
        this.getMembersTrigger(0);
        this.setState({
            isModalOpen: true,
        }, () => {
            this.modal.current.addEventListener("scroll", this.handleScroll);
        });
    }

    clickCancelHandler = () => {
        this.setState({
            isModalOpen: false,
            selectedUserId: -1,
            selectedUserName: "",
            members: [],
            memberPageNum: 0,
            memberFinished: true,
        }, () => {
            this.modal.current.removeEventListener("scroll", this.handleScroll);
        });
    }

    checkHandler = (user) => {
        this.setState({
            selectedUserId: user.id,
            selectedUserName: user.username,
        });
    }

    render() {
        let memberList = (<div />);
        if (this.props.me && this.state.members.length > 0) {
            memberList = this.state.members
                .filter((user) => user.id !== this.props.me.id)
                .map((user) => (
                    <UserEntry
                      key={user.id}
                      id={user.id}
                      userName={user.username}
                      userDesc={user.descrpition}
                      isChecked={this.state.selectedUserId === user.id}
                      checkhandler={() => this.checkHandler(user)}
                      type="checkbox"
                    />
                ));
        }

        return (
            <div className="TransferOwnership">
                <div id="openButtonDiv">
                    <Button id="modalOpenButton" onClick={this.clickOpenHandler}>
                        Transfer Ownership
                    </Button>
                </div>
                <Modal scrollable id="transferModal" show={this.state.isModalOpen} onHide={this.clickCancelHandler} centered>
                    <Modal.Header className="ModalHeader">
                        <h5 id="transferHeaderText">Transfer ownership to {this.collectionName}</h5>
                    </Modal.Header>
                    <Modal.Body ref={this.modal} className="ModalBody">
                        {memberList}
                    </Modal.Body>
                    <Modal.Footer className="modalFooter">
                        <WarningModal
                          openButtonText="Transfer to ..."
                          whatToWarnText={`Transfer "${this.props.thisCollection.title}" to "${this.state.selectedUserName}"`}
                          whatActionWillBeDone={() => this.props.onTransferOwnership(
                              this.props.thisCollection.id,
                              this.state.selectedUserId,
                          )}
                          whatActionWillFollow={() => {
                              this.props.history.replace(`/collection_id=${this.props.thisCollection.id}`);
                          }}
                          variant="info"
                          disableCondition={this.state.selectedUserId <= 0}
                          disableMessage="Select a user"
                        />
                        <Button variant="secondary" id="cancelButton" onClick={this.clickCancelHandler}>
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
    thisCollection: state.collection.selected.collection,
    members: state.collection.getMembers.members,
    memberPageNum: state.collection.getMembers.pageNum,
    memberFinished: state.collection.getMembers.finished,
});

const mapDispatchToProps = (dispatch) => ({
    onTransferOwnership: (collectionId, targetUserId) => dispatch(
        collectionActions.setOwner(collectionId, targetUserId),
    ),
    onGetMembers: (collectionId, pageNum, includesMe) => dispatch(
        collectionActions.getCollectionMembers(collectionId, pageNum, includesMe),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferOwnershipModal);
// export default TransferOwnershipModal;

TransferOwnershipModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),

    me: PropTypes.objectOf(PropTypes.any),
    thisCollection: PropTypes.objectOf(PropTypes.any),
    members: PropTypes.arrayOf(PropTypes.any),

    onTransferOwnership: PropTypes.func,
    onGetMembers: PropTypes.func,
    memberPageNum: PropTypes.number,
    memberFinished: PropTypes.bool,
};

TransferOwnershipModal.defaultProps = {
    history: {},

    me: {},
    thisCollection: {},
    members: [],

    onTransferOwnership: () => {},
    onGetMembers: () => {},
    memberPageNum: 0,
    memberFinished: true,
};
