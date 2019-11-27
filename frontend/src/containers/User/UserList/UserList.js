import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
            id: this.props.match.params.id,
            users: [],
        };

        this.userCardsMaker = this.userCardsMaker.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.mode === "followings") {
            this.props.onFollowingUser({ id: this.state.id })
                .then(() => {
                    if (this.props.userStatus === userStatus.USER_NOT_EXIST) {
                        console.log("1");
                        this.props.history.push("/main");
                    }
                    if (this._isMounted) {
                        this.setState({ users: this.props.followingUsers });
                    }
                });
        } else if (this.props.mode === "followers") {
            this.props.onFollowerUser({ id: this.state.id })
                .then(() => {
                    if (this.props.userStatus === userStatus.USER_NOT_EXIST) {
                        this.props.history.push("/main");
                    }
                    if (this._isMounted) {
                        this.setState({ users: this.props.followerUsers });
                    }
                });
        } else if (this.props.mode === "members") {
            this.props.onGetMembers(this.state.id)
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

    componentWillUnmount() {
        this._isMounted = false;
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userStatus: state.user.status,
    followerUsers: state.user.selectedFollowers,
    followingUsers: state.user.selectedFollowings,
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
    userStatus: PropTypes.string,
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
    userStatus: userStatus.NONE,
    getMembersStatus: collectionStatus.NONE,
};
