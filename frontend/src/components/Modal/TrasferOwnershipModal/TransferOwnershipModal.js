import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

import { collectionActions } from "../../../store/actions";
import WarningModal from "../WarningModal/WarningModal";
import UserEntry from "../../User/UserEntry/UserEntry";

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
        };


        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
    }

    getMembersTrigger = () => {
        this.props.onGetMembers(this.props.thisCollection.id, this.state.memberPageNum + 1)
            .then(() => {
                const { members } = this.state;
                this.setState({
                    members: members.concat(this.props.members),
                    memberPageNum: this.props.memberPageNum,
                    memberFinished: this.props.memberFinished,
                });
            });
    }

    clickOpenHandler = () => {
        this.getMembersTrigger();
        this.setState({ isModalOpen: true });
    }

    clickCancelHandler = () => {
        this.setState({
            isModalOpen: false,
            selectedUserId: -1,
            selectedUserName: "",
            members: [],
            memberPageNum: 0,
            memberFinished: true,
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
                      type="radio"
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
                <Modal id="transferModal" show={this.state.isModalOpen} onHide={this.clickCancelHandler} centered>
                    <Modal.Header>
                        <h5 id="transferHeaderText">Transfer ownership of {this.collectionName}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        {memberList}
                    </Modal.Body>
                    <Modal.Footer>
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
                          disableCondition={this.state.selectedUserId <= 0}
                          disableMessage="Select a user"
                        />
                        <Button id="cancelButton" onClick={this.clickCancelHandler}>
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
});

const mapDispatchToProps = (dispatch) => ({
    onTransferOwnership: (collectionId, targetUserId) => dispatch(
        collectionActions.setOwner(collectionId, targetUserId),
    ),
    onGetMembers: (collectionId, pageNum) => dispatch(
        collectionActions.getCollectionMembers(collectionId, pageNum),
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
