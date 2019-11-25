import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { userActions, collectionActions } from "../../../store/actions";
import UserEntry from "../../User/UserEntry/UserEntry";

class InviteToCollectionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKeyWord: "",
            isModalOpen: false,
            memberIds: [],
            users: [],
            checkedUserIdList: [],
        };

        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.clickSearchHandler = this.clickSearchHandler.bind(this);
        this.clickInviteUsersHandler = this.clickInviteUsersHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.userEntryMapper = this.userEntryMapper.bind(this);
    }

    // handler functions for buttons
    clickOpenHandler = () => {
        this.setState({ memberIds: this.props.members.map((x) => x.id) });
        this.props.onGetFollowings({ id: this.props.me.id })
            .then(() => {
                const { memberIds } = this.state;
                this.setState({
                    isModalOpen: true,
                    users: this.props.myFollowings
                        .filter((x) => !memberIds.includes(x.id)),
                });
            });
    }

    clickCancelHandler = () => {
        this.setState({
            searchKeyWord: "",
            isModalOpen: false,
            checkedUserIdList: [],
        });
    }

    clickSearchHandler = () => {
        this.setState({ checkedUserIdList: [] });
        this.props.onSearchUsers({ text: this.state.searchKeyWord })
            .then(() => {
                const { memberIds } = this.state;
                this.setState({
                    users: this.props.searchedUsers
                        .filter((x) => !memberIds.includes(x.id)),
                });
            });
    }

    clickInviteUsersHandler = () => {
        this.props.onInviteUsers(this.props.thisCollection.id, this.state.checkedUserIdList)
            .then(() => {
                this.setState({
                    searchKeyWord: "",
                    isModalOpen: false,
                    checkedUserIdList: [],
                });
                this.props.onGetMembers(this.props.thisCollection.id);
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

    // helper function for rendering UserEntries
    userEntryMapper = (arr) => arr.map((user) => (
        <UserEntry
          key={user.id}
          id={user.id}
          userName={user.username}
          userDesc={user.description}
          isChecked={this.state.checkedUserIdList.includes(user.id)}
          checkhandler={() => this.checkHandler(user)}
        />
    ))

    render() {
        const userEntries = this.userEntryMapper(this.state.users);

        return (
            <div className="InviteToCollectionModal">
                <div className="OpenButtonDiv">
                    <Button id="modalOpenButton" onClick={this.clickOpenHandler}>
                        {this.props.openButtonName}
                    </Button>
                </div>
                <Modal id="inviteModal" show={this.state.isModalOpen} onHide={this.clickCancelHandler} centered>
                    <Modal.Header>
                        <h5 id="inviteHeaderText">Invite users to {this.props.thisCollection.title}</h5>
                        <Button
                          id="inviteButton"
                          onClick={this.clickInviteUsersHandler}
                          disabled={this.state.checkedUserIdList.length === 0}
                        >
                            Invite
                        </Button>
                        <Button id="cancelButton" onClick={this.clickCancelHandler}>
                            Cancel
                        </Button>
                    </Modal.Header>
                    <Modal.Body className="ModalBody">
                        <div id="searchArea">
                            <input
                              id="userSearchBar"
                              type="text"
                              placeholder="search users"
                              value={this.state.searchKeyWord}
                              onChange={(event) => this.setState({
                                  searchKeyWord: event.target.value,
                              })}
                            />
                            <Button id="searchButton" onClick={this.clickSearchHandler}>
                                Search
                            </Button>
                        </div>
                        <Form>
                            <Form.Group controlId="A" id="userList">
                                {userEntries}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    thisCollection: state.collection.selected.collection,
    myFollowings: state.user.selectedFollowings,
    searchedUsers: state.user.searchedUsers,
    me: state.auth.me,
});

const mapDispatchToProps = (dispatch) => ({
    onGetFollowings: (userId) => dispatch(userActions.getFollowingsByUserId(userId)),
    onSearchUsers: (keyword) => dispatch(userActions.searchUser(keyword)),
    onInviteUsers: (collectionId, userIdList) => dispatch(
        collectionActions.addNewMembers(collectionId, userIdList),
    ),
    onGetMembers: (collectionId) => dispatch(
        collectionActions.getCollectionMembers(collectionId),
    ),
});


export default connect(mapStateToProps, mapDispatchToProps)(InviteToCollectionModal);

InviteToCollectionModal.propTypes = {
    openButtonName: PropTypes.string,

    thisCollection: PropTypes.objectOf(PropTypes.any),
    members: PropTypes.arrayOf(PropTypes.any),
    myFollowings: PropTypes.arrayOf(PropTypes.any),
    searchedUsers: PropTypes.arrayOf(PropTypes.any),
    me: PropTypes.objectOf(PropTypes.any),

    onGetFollowings: PropTypes.func,
    onSearchUsers: PropTypes.func,
    onInviteUsers: PropTypes.func,
    onGetMembers: PropTypes.func,
};

InviteToCollectionModal.defaultProps = {
    openButtonName: "",

    thisCollection: {},
    members: [],
    myFollowings: [],
    searchedUsers: [],
    me: null,

    onGetFollowings: () => {},
    onSearchUsers: () => {},
    onInviteUsers: () => {},
    onGetMembers: () => {},
};
