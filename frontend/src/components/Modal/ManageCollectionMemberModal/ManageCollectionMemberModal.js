import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

// import { collectionActions } from "../../../store/actions";
import InviteToCollectionModal from "../InviteToCollectionModal/InviteToCollectionModal";
import WarningModal from "../WarningModal/WarningModal";
import { collectionActions } from "../../../store/actions";
import UserEntry from "../../User/UserEntry/UserEntry";

class ManageCollectionMemberModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            removeMode: false,
            checkedUserIdList: [],
            members: [],
            memberPageNum: 0,
            memberFinished: true,
        };

        this.getMembersTrigger = this.getMembersTrigger.bind(this);
        this.refreshMembers = this.refreshMembers.bind(this);
        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCloseHandler = this.clickCloseHandler.bind(this);
        this.clickKickOffCancelHandler = this.clickKickOffCancelHandler.bind(this);
        this.clickKickOffEnableHandler = this.clickKickOffEnableHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
    }

    getMembersTrigger = (pageNum, includesMe) => {
        this.props.onGetMembers(this.props.thisCollection.id, pageNum + 1, includesMe)
            .then(() => {
                const { members } = this.state;
                this.setState({
                    members: members.concat(this.props.members),
                    memberPageNum: this.props.memberPageNum,
                    memberFinished: this.props.memberFinished,
                });
            })
            .catch(() => {});
    }

    refreshMembers = () => {
        // if removeMode, the list of members should NOT include 'me'
        this.props.onGetMembers(this.props.thisCollection.id, 1, !this.state.removeMode)
            .then(() => {
                this.setState({
                    members: this.props.members,
                    memberPageNum: this.props.memberPageNum,
                    memberFinished: this.props.memberFinished,
                    checkedUserIdList: [],
                });
            })
            .catch(() => {});
    }

    // opening and closing modal
    clickOpenHandler = () => {
        this.getMembersTrigger(0, true);
        this.setState({
            isModalOpen: true,
        });
    }

    clickCloseHandler = () => {
        this.setState({
            isModalOpen: false,
            removeMode: false,
            checkedUserIdList: [],
            members: [],
            memberPageNum: 0,
            memberFinished: true,
        });
    }

    // deleting user feature handlers
    clickKickOffEnableHandler = () => {
        this.setState({
            removeMode: true,
            members: [],
            memberPageNum: 0,
            memberFinished: true,
        });
        this.getMembersTrigger(0, false);
    }

    clickKickOffCancelHandler = () => {
        this.setState({
            removeMode: false,
            checkedUserIdList: [],
            members: [],
            memberPageNum: 0,
            memberFinished: true,
        });
        this.getMembersTrigger(0, true);
    }

    // handler function for user entry
    checkHandler = (user) => {
        const beforeCheckedUsers = this.state.checkedUserIdList;
        if (beforeCheckedUsers.includes(user.id)) {
            this.setState({
                checkedUserIdList: beforeCheckedUsers.filter((id) => id !== user.id),
            });
        } else {
            this.setState({
                checkedUserIdList: beforeCheckedUsers.concat(user.id),
            });
        }
    }

    render() {
        let memberList = (<div />);
        if (this.props.me && this.state.members.length > 0) {
            memberList = this.state.members
                .filter((user) => (!this.state.removeMode || user.id !== this.props.me.id))
                .map((user) => (
                    <UserEntry
                      key={user.id}
                      id={user.id}
                      userName={user.username}
                      userDesc={user.descrpition}
                      isChecked={this.state.checkedUserIdList.includes(user.id)}
                      checkhandler={() => this.checkHandler(user)}
                      showCheck={this.state.removeMode}
                    />
                ));
        }

        const kickOffSupporter = this.state.removeMode
            ? (
                <div id="kickOffButtons">
                    <WarningModal
                      openButtonText="Confirm"
                      whatToWarnText={`Kick off the users from "${this.props.thisCollection.title}"`}
                      whatActionWillBeDone={() => this.props.onDeleteMembers(
                          this.props.thisCollection.id,
                          this.state.checkedUserIdList,
                      )}
                      whatActionWillFollow={this.refreshMembers}
                      disableCondition={this.state.checkedUserIdList.length === 0}
                      disableMessage="Select users"
                    />
                    <Button id="kickOffCancelButton" onClick={this.clickKickOffCancelHandler}>
                        Cancel
                    </Button>
                </div>
            )
            : (
                <Button
                  id="kickOffEnableButton"
                  onClick={this.clickKickOffEnableHandler}
                >
                    Kick Off...
                </Button>
            );

        return (
            <div className="ManageCollectionMemberModal">
                <div id="openButtonDiv">
                    <Button id="modalOpenButton" onClick={this.clickOpenHandler}>
                        Manage Members
                    </Button>
                </div>
                <Modal id="memberModal" show={this.state.isModalOpen} onHide={this.clickCloseHandler} centered>
                    <Modal.Header>
                        <h5 id="createHeaderText">Manage members of {this.props.thisCollection.title}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <InviteToCollectionModal
                          openButtonName="Invite New Users"
                          members={this.state.members}
                          whatActionWillFollow={this.refreshMembers}
                        />
                        <div id="membersListDiv">
                            {memberList}
                            { this.state.memberFinished ? null
                                : (
                                    <Button
                                      className="user-more-button"
                                      onClick={() => {
                                          if (this.state.removeMode) {
                                              this.getMembersTrigger(
                                                  this.state.memberPageNum, false,
                                              );
                                          } else {
                                              this.getMembersTrigger(
                                                  this.state.memberPageNum, true,
                                              );
                                          }
                                      }}
                                      block
                                    >
                            View More
                                    </Button>
                                )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {kickOffSupporter}
                        <Button id="closeButton" onClick={this.clickCloseHandler}>Close</Button>
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

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch) => ({
    onDeleteMembers: (collectionId, memberIdList) => dispatch(
        collectionActions.deleteMembers(collectionId, memberIdList),
    ),
    onGetMembers: (collectionId, pageNum, includesMe) => dispatch(
        collectionActions.getCollectionMembers(collectionId, pageNum, includesMe),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCollectionMemberModal);

ManageCollectionMemberModal.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    thisCollection: PropTypes.objectOf(PropTypes.any),
    members: PropTypes.arrayOf(PropTypes.any),
    onDeleteMembers: PropTypes.func,
    onGetMembers: PropTypes.func,
    memberPageNum: PropTypes.number,
    memberFinished: PropTypes.bool,
};

ManageCollectionMemberModal.defaultProps = {
    me: {},
    thisCollection: {},
    members: [],
    onDeleteMembers: () => {},
    onGetMembers: () => {},
    memberPageNum: 0,
    memberFinished: true,
};
