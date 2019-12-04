import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { userActions } from "../../../store/actions";
import "./UserCard.css";

class UserCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followerCount: this.props.followerCount,
            doIFollow: this.props.doIFollow,
        };

        this.clickFollowHandler = this.clickFollowHandler.bind(this);
        this.clickUnfollowHandler = this.clickUnfollowHandler.bind(this);
    }

    clickFollowHandler = () => {
        this.props.onFollow({ id: this.props.id })
            .then(() => {
                this.setState({
                    followerCount: this.props.afterFollowCount,
                    doIFollow: true,
                });
            });
    }

    clickUnfollowHandler = () => {
        this.props.onUnFollow({ id: this.props.id })
            .then(() => {
                this.setState({
                    followerCount: this.props.afterUnfollowCount,
                    doIFollow: false,
                });
            });
    }

    render() {
        let followButton = (
            <Button
              className="follow-button"
              variant="secondary"
              onClick={this.state.doIFollow
                  ? this.clickUnfollowHandler : this.clickFollowHandler}
            >
                {this.state.doIFollow ? "unfollow" : "follow"}
            </Button>
        );
        if (this.props.me && this.props.me.id === this.props.id) {
            followButton = null;
        }

        return (
            <div className="wrapper">
                <Card className="user">
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link href={`/profile_id=${this.props.id}`} className="text">{this.props.username}</Card.Link>
                        </div>
                        <Card.Text id="email">{this.props.email}</Card.Text>
                        <Card.Text id="description">{this.props.description}</Card.Text>
                        {followButton}
                    </Card.Body>
                    <Card.Footer className="footer">
                        <Button
                          className="follower-count"
                          variant="light"
                          href={`/profile_id=${this.props.id}/followers`}
                        >
                            follower: {this.state.followerCount}
                        </Button>
                        <Button
                          className="following-count"
                          variant="light"
                          href={`/profile_id=${this.props.id}/followings`}
                        >
                            following: {this.props.followingCount}
                        </Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
    afterFollowCount: state.user.followCount,
    afterUnfollowCount: state.user.unfollowCount,
});

const mapDispatchToProps = (dispatch) => ({
    onFollow: (targetId) => dispatch(userActions.addUserFollowing(targetId)),
    onUnFollow: (targetId) => dispatch(userActions.removeUserFollowing(targetId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);

UserCard.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,
    doIFollow: PropTypes.bool,
    onFollow: PropTypes.func,
    onUnFollow: PropTypes.func,
    afterFollowCount: PropTypes.number,
    afterUnfollowCount: PropTypes.number,
};

UserCard.defaultProps = {
    me: {},
    id: 0,
    username: "",
    email: "",
    description: "",
    followerCount: 0,
    followingCount: 0,
    doIFollow: false,
    onFollow: () => {},
    onUnFollow: () => {},
    afterFollowCount: 0,
    afterUnfollowCount: 0,
};
