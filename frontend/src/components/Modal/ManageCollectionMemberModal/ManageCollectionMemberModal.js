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
        };

        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCloseHandler = this.clickCloseHandler.bind(this);
        this.clickKickOffCancelHandler = this.clickKickOffCancelHandler.bind(this);
        this.clickKickOffEnableHandler = this.clickKickOffEnableHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
    }

    /* eslint-disable react/no-did-update-set-state */
    componentDidUpdate(prevProps) {
        if (this.props.members !== prevProps.members) {
            this.setState({
                members: this.props.members,
            });
        }
    }
    /* eslint-enable react/no-did-update-set-state */

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
                      whatToWarnText={`Kick off following users from "${this.props.thisCollection.title}" \n asdf`}
                      whatActionWillBeDone={() => this.props.onDeleteMembers(
                          this.props.thisCollection.id,
                          this.state.checkedUserIdList,
                      )}
                      whatActionWillFollow={
                          () => {
                              this.props.onGetMembers(this.props.thisCollection.id);
                              this.setState({ checkedUserIdList: [] });
                          }
                      }
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
                          members={this.props.members}
                        />
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
    onGetMembers: (collectionId) => dispatch(
        collectionActions.getCollectionMembers(collectionId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCollectionMemberModal);

ManageCollectionMemberModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    me: PropTypes.objectOf(PropTypes.any),
    thisCollection: PropTypes.objectOf(PropTypes.any),
    members: PropTypes.arrayOf(PropTypes.any),
    onDeleteMembers: PropTypes.func,
    onGetMembers: PropTypes.func,
};

ManageCollectionMemberModal.defaultProps = {
    history: {},
    me: {},
    thisCollection: {},
    members: [],
    onDeleteMembers: () => {},
    onGetMembers: () => {},
};
