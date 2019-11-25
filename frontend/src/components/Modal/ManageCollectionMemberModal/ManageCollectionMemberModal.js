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
        };
    }

    // opening and closing modal
    clickOpenHandler = () => {
        this.setState({
            isModalOpen: true,
        });
    }

    clickCloseHandler = () => {
        this.setState({
            isModalOpen: false,
            removeMode: false,
            checkedUserIdList: [],
        });
    }

    // deleting user feature handlers
    clickKickOffEnableHandler = () => {
        this.setState({
            removeMode: true,
        });
    }

    clickKickOffConfirmHandler = () => {
        // FIXME : 400 bad request
        // this.props.onDeleteMembers(this.props.thisCollection.id, this.state.checkedUserIdList);
    }

    clickKickOffCancelHandler = () => {
        this.setState({
            removeMode: false,
            checkedUserIdList: [],
        });
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

    confirmDisableCond = () => {
        if (this.props.me) {
            return this.state.checkedUserIdList.length === 0
                || this.state.checkedUserIdList.includes(this.props.me.id);
        }
        return true;
    }

    render() {
        let memberList = (<div />);
        if (this.props.members.length > 0) {
            memberList = this.props.members.map((user) => (
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
                      history={this.props.history}
                      openButtonText="Confirm"
                      whatToWarnText={`Kick off following users from "${this.props.thisCollection.title}" \n asdf`}
                      whatActionWillBeDone={this.clickKickOffConfirmHandler}
                      whereToGoAfterConfirm={`/collection_id=${this.props.thisCollection.id}`}
                      moveAfterDone={false}
                      disableCondition={this.confirmDisableCond()}
                      disableMessage="Select users except you"
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
                  disabled
                  // FIXME : delete these comments and above 'disabled'
                  // after 'bad request issue' for 'deleteMembers' action function is solved
                >
                    Kick Off ...
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
                        <InviteToCollectionModal openButtonName="Invite New Users" />
                        <div id="membersListDiv">
                            {memberList}
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
    members: state.collection.selected.members,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch) => ({
    onDeleteMembers: (collectionId, memberIdList) => dispatch(
        collectionActions.deleteMembers(collectionId, memberIdList),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCollectionMemberModal);

ManageCollectionMemberModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    me: PropTypes.objectOf(PropTypes.any),
    thisCollection: PropTypes.objectOf(PropTypes.any),
    members: PropTypes.arrayOf(PropTypes.any),
    // eslint-disable-next-line react/no-unused-prop-types
    onDeleteMembers: PropTypes.func,
};

ManageCollectionMemberModal.defaultProps = {
    history: {},
    me: {},
    thisCollection: {},
    members: [],
    onDeleteMembers: () => {},
};
