import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";

import { UserCard } from "../../../components";
import { userActions, collectionActions } from "../../../store/actions";
import { userStatus, collectionStatus } from "../../../constants/constants";
import "./UserList.css";

/* eslint-disable no-underscore-dangle */
class UserList extends Component {
    _isMounted=false;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            pageNum: 0,
            finished: true,
        };

        this.clickUserMoreHandler = this.clickUserMoreHandler.bind(this);
        this.getUsersTrigger = this.getUsersTrigger.bind(this);
        this.userCardsMaker = this.userCardsMaker.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.match.params) {
            this.getUsersTrigger(this.state.pageNum);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params !== prevProps.match.params) {
            this.getUsersTrigger(this.state.pageNum);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    clickUserMoreHandler = () => {
        this.getUsersTrigger(this.state.pageNum);
    };

    getUsersTrigger = (pageNum) => {
        const { users } = this.state;
        if (this.props.mode === "followings") {
            this.props.onFollowingUser({ id: this.props.match.params.id, page_number: pageNum + 1 })
                .then(() => {
                    if (this.props.getFollowingsStatus === userStatus.USER_NOT_EXIST) {
                        this.props.history.push("/main");
                    }
                    if (this._isMounted) {
                        this.setState({
                            users: users.concat(this.props.followingUsers),
                            pageNum: this.props.followingPageNum,
                            finished: this.props.followingFinished,
                        });
                    }
                });
        } else if (this.props.mode === "followers") {
            this.props.onFollowerUser({ id: this.props.match.params.id, page_number: pageNum + 1 })
                .then(() => {
                    if (this.props.getFollowersStatus === userStatus.USER_NOT_EXIST) {
                        this.props.history.push("/main");
                    }
                    if (this._isMounted) {
                        this.setState({
                            users: users.concat(this.props.followerUsers),
                            pageNum: this.props.followerPageNum,
                            finished: this.props.followerFinished,
                        });
                    }
                });
        } else if (this.props.mode === "members") {
            this.props.onGetMembers(this.props.match.params.id, pageNum + 1)
                .then(() => {
                    if (this.props.getMembersStatus === collectionStatus.FAILURE) {
                        this.props.history.push("/main");
                    }
                    if (this._isMounted) {
                        this.setState({ users: this.props.members });
                    }
                });
        }
    }

    userCardsMaker = (user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.username}
          email={user.email}
          description={user.description}
          doIFollow={user.is_following}
          followerCount={user.count.follower}
          followingCount={user.count.following}
        />
    )

    render() {
        let userCardsLeft = null;
        let userCardsRight = null;
        let userMessage = "no users";

        if (this.state.users.length > 0) {
            userCardsLeft = this.state.users
                .filter((x) => this.state.users.indexOf(x) % 2 === 0)
                .map((user) => this.userCardsMaker(user));
            userCardsRight = this.state.users
                .filter((x) => this.state.users.indexOf(x) % 2 === 1)
                .map((user) => this.userCardsMaker(user));
            userMessage = null;
        }

        return (
            <div className="user-list">
                <div className="item-list">
                    <div id="user-cards">
                        <h3 id="user-message">{userMessage}</h3>
                        <div id="user-cards-left">{userCardsLeft}</div>
                        <div id="user-cards-right">{userCardsRight}</div>
                    </div>
                    { this.state.finished ? null
                        : (
                            <Button
                              className="user-more-button"
                              onClick={this.clickUserMoreHandler}
                              size="lg"
                              block
                            >
                            View More
                            </Button>
                        )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    getFollowersStatus: state.user.getFollowers.status,
    followerUsers: state.user.getFollowers.followers,
    followerPageNum: state.user.getFollowers.pageNum,
    followerFinished: state.user.getFollowers.finished,
    getFollowingsStatus: state.user.getFollowings.status,
    followingUsers: state.user.getFollowings.followings,
    followingPageNum: state.user.getFollowings.pageNum,
    followingFinished: state.user.getFollowings.finished,
    getMembersStatus: state.collection.selected.status,
    members: state.collection.selected.members,
});

const mapDispatchToProps = (dispatch) => ({
    onFollowerUser: (userId) => dispatch(userActions.getFollowersByUserId(userId)),
    onFollowingUser: (userId) => dispatch(userActions.getFollowingsByUserId(userId)),
    onGetMembers: (collectionId) => dispatch(
        collectionActions.getCollectionMembers(collectionId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserList));

UserList.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    mode: PropTypes.string,
    followerUsers: PropTypes.arrayOf(PropTypes.any),
    onFollowerUser: PropTypes.func,
    followingUsers: PropTypes.arrayOf(PropTypes.any),
    onFollowingUser: PropTypes.func,
    members: PropTypes.arrayOf(PropTypes.any),
    onGetMembers: PropTypes.func,
    getFollowersStatus: PropTypes.string,
    followerPageNum: PropTypes.number,
    followerFinished: PropTypes.bool,
    getFollowingsStatus: PropTypes.string,
    followingPageNum: PropTypes.number,
    followingFinished: PropTypes.bool,
    getMembersStatus: PropTypes.string,
};

UserList.defaultProps = {
    history: null,
    match: null,
    mode: "",
    followerUsers: [],
    onFollowerUser: () => {},
    followingUsers: [],
    onFollowingUser: () => {},
    members: [],
    onGetMembers: () => {},
    getFollowersStatus: userStatus.NONE,
    followerPageNum: 0,
    followerFinished: true,
    getFollowingsStatus: userStatus.NONE,
    followingPageNum: 0,
    followingFinished: true,
    getMembersStatus: collectionStatus.NONE,
};
