import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { UserCard } from "../../../components";
import { userActions } from "../../../store/actions";
import "./UserList.css";

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };

        this.userCardsMaker = this.userCardsMaker.bind(this);
    }

    componentDidMount() {
        if (this.props.location.pathname.split("=")[1].split("/")[1] === "followings") {
            this.props.onFollowingUser({ id: this.props.location.pathname.split("=")[1].split("/")[0] })
                .then(() => {
                    this.setState({ users: this.props.followingUsers });
                });
        } else if (this.props.location.pathname.split("=")[1].split("/")[1] === "followers") {
            this.props.onFollowerUser({ id: this.props.location.pathname.split("=")[1].split("/")[0] })
                .then(() => {
                    this.setState({ users: this.props.followerUsers });
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userStatus: state.user.status,
    followerUsers: state.user.selectedFollowers,
    followingUsers: state.user.selectedFollowings,
});

const mapDispatchToProps = (dispatch) => ({
    onFollowerUser: (userId) => dispatch(userActions.getFollowersByUserId(userId)),
    onFollowingUser: (userId) => dispatch(userActions.getFollowingsByUserId(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);

UserList.propTypes = {
    location: PropTypes.objectOf(PropTypes.any),
    followerUsers: PropTypes.arrayOf(PropTypes.any),
    onFollowerUser: PropTypes.func,
    followingUsers: PropTypes.arrayOf(PropTypes.any),
    onFollowingUser: PropTypes.func,
};

UserList.defaultProps = {
    location: null,
    followerUsers: [],
    onFollowerUser: () => {},
    followingUsers: [],
    onFollowingUser: () => {},
};
