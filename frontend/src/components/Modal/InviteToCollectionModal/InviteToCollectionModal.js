import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { userActions, collectionActions } from "../../../store/actions";
import UserEntry from "../../User/UserEntry/UserEntry";

import "./InviteToCollectionModal.css";

class InviteToCollectionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKeyWord: "",
            isModalOpen: false,
            users: [],
            checkedUserIdList: [],
            pageNum: 0,
            finished: true,
            showFollowings: true,
            loading: false,
        };
        this.modal = React.createRef();
        this.getFollowingsTrigger = this.getFollowingsTrigger.bind(this);
        this.searchUsersTrigger = this.searchUsersTrigger.bind(this);
        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.clickSearchHandler = this.clickSearchHandler.bind(this);
        this.clickInviteUsersHandler = this.clickInviteUsersHandler.bind(this);
        this.checkHandler = this.checkHandler.bind(this);
        this.userEntryMapper = this.userEntryMapper.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll = () => {
        if (!this.state.loading
            && !this.state.finished
            && this.modal.current.scrollTop + this.modal.current.clientHeight + 50
            > this.modal.current.scrollHeight) {
            this.setState({
                loading: true,
            });
            if (this.state.showFollowings) {
                this.getFollowingsTrigger(this.state.pageNum);
            } else {
                this.searchUsersTrigger(this.state.pageNum);
            }
        }
    }

    // handler functions for buttons
    clickOpenHandler = () => {
        this.setState({
            isModalOpen: true,
        }, () => {
            this.modal.current.addEventListener("scroll", this.handleScroll);
            this.getFollowingsTrigger(0);
        });
    }

    getFollowingsTrigger = (pageNum) => {
        this.props.onGetFollowingsNotInCollection(
            this.props.me.id,
            this.props.thisCollection.id,
            pageNum + 1,
        )
            .then(() => {
                const { users } = this.state;
                this.setState({
                    users: users.concat(this.props.myFollowings),
                    pageNum: this.props.followingPageNum,
                    finished: this.props.followingFinished,
                    loading: false,
                });
            })
            .catch(() => {});
    }

    clickSearchHandler = () => {
        this.setState({
            users: [],
            checkedUserIdList: [],
            pageNum: 0,
            finished: true,
            showFollowings: false,
            loading: false,
        });
        this.searchUsersTrigger(0);
    }

    searchUsersTrigger = (pageNum) => {
        this.props.onSearchUsersNotInCollection(
            this.state.searchKeyWord,
            this.props.thisCollection.id,
            pageNum + 1,
        )
            .then(() => {
                const { users } = this.state;
                this.setState({
                    users: users.concat(this.props.searchedUsers),
                    pageNum: this.props.searchUserPageNum,
                    finished: this.props.searchUserFinished,
                });
            })
            .catch(() => {});
    }

    clickCancelHandler = () => {
        this.setState({
            searchKeyWord: "",
            isModalOpen: false,
            users: [],
            checkedUserIdList: [],
            pageNum: 0,
            finished: true,
            showFollowings: true,
        });
        this.modal.current.removeEventListener("scroll", this.handleScroll);
    }

    clickInviteUsersHandler = () => {
        this.props.onInviteUsers(this.props.thisCollection.id, this.state.checkedUserIdList)
            .then(() => {
                this.setState({
                    searchKeyWord: "",
                    isModalOpen: false,
                    users: [],
                    checkedUserIdList: [],
                    pageNum: 0,
                    finished: true,
                    showFollowings: true,
                });
                if (this.props.whatActionWillFollow) {
                    this.props.whatActionWillFollow();
                }
            })
            .catch(() => {});
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
                    <Button variant={this.props.variant} id="modalOpenButton" onClick={this.clickOpenHandler}>
                        {this.props.openButtonName}
                    </Button>
                </div>
                <Modal
                  scrollable
                  id="inviteModal"
                  show={this.state.isModalOpen}
                  onHide={this.clickCancelHandler}
                  centered
                >
                    <Modal.Header className="ModalHeader">
                        <h5 id="inviteHeaderText">Invite users to {this.props.thisCollection.title}</h5>
                        <div className="inviteButtons">
                            <Button
                              variant="info"
                              id="inviteButton"
                              onClick={this.clickInviteUsersHandler}
                              disabled={this.state.checkedUserIdList.length === 0}
                            >
                            Invite
                            </Button>
                            <Button variant="secondary" id="cancelButton" onClick={this.clickCancelHandler}>
                            Cancel
                            </Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body
                      ref={this.modal}
                      className="ModalBody"
                    >
                        <div id="searchArea">
                            <input
                              id="userSearchBar"
                              type="text"
                              placeholder="search users"
                              value={this.state.searchKeyWord}
                              onChange={(event) => this.setState({
                                  searchKeyWord: event.target.value,
                              })}
                              onKeyPress={(e) => {
                                  if (this.state.searchKeyWord.length !== 0 && e.charCode === 13) {
                                      this.clickSearchHandler();
                                  }
                              }}
                            />
                            <Button
                              id="searchButton"
                              variant="outline-info"
                              onClick={this.clickSearchHandler}
                              disabled={this.state.searchKeyWord.length === 0}
                            >
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
    myFollowings: state.user.getFollowings.followings,
    followingPageNum: state.user.getFollowings.pageNum,
    followingFinished: state.user.getFollowings.finished,
    searchedUsers: state.user.search.users,
    searchUserPageNum: state.user.search.pageNum,
    searchUserFinished: state.user.search.finished,
    me: state.auth.me,
});

const mapDispatchToProps = (dispatch) => ({
    onGetFollowingsNotInCollection: (userId, collectionId, pageNum) => dispatch(
        userActions.getFollowingsNotInCollection(userId, collectionId, pageNum),
    ),
    onSearchUsersNotInCollection: (keyword, collectionId, pageNum) => dispatch(
        userActions.searchUserNotInCollection(keyword, collectionId, pageNum),
    ),
    onInviteUsers: (collectionId, userIdList) => dispatch(
        collectionActions.addNewMembers(collectionId, userIdList),
    ),
});


export default connect(mapStateToProps, mapDispatchToProps)(InviteToCollectionModal);

InviteToCollectionModal.propTypes = {
    openButtonName: PropTypes.string,

    thisCollection: PropTypes.objectOf(PropTypes.any),
    myFollowings: PropTypes.arrayOf(PropTypes.any),
    searchedUsers: PropTypes.arrayOf(PropTypes.any),
    me: PropTypes.objectOf(PropTypes.any),

    onGetFollowingsNotInCollection: PropTypes.func,
    followingPageNum: PropTypes.number,
    followingFinished: PropTypes.bool,
    onSearchUsersNotInCollection: PropTypes.func,
    searchUserPageNum: PropTypes.number,
    searchUserFinished: PropTypes.bool,
    onInviteUsers: PropTypes.func,

    whatActionWillFollow: PropTypes.func,
    variant: PropTypes.string,
};

InviteToCollectionModal.defaultProps = {
    openButtonName: "",

    thisCollection: {},
    myFollowings: [],
    followingPageNum: 0,
    followingFinished: true,
    searchedUsers: [],
    searchUserPageNum: 0,
    searchUserFinished: true,
    me: null,

    onGetFollowingsNotInCollection: () => {},
    onSearchUsersNotInCollection: () => {},
    onInviteUsers: () => {},

    whatActionWillFollow: () => {},
    variant: "primary",
};
