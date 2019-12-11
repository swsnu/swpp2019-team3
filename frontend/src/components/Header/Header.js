import React, { Component } from "react";
import {
    Navbar, Form, Dropdown, Button, Nav, Badge, Image,
} from "react-bootstrap";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { authActions } from "../../store/actions";
import { signoutStatus } from "../../constants/constants";
import "./Header.css";
import SVG from "../svg";
import SamplePhoto from "../../containers/User/ProfileDetail/sample.jpg";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchWord: "",
        };

        this.keyPressHandler = this.keyPressHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clickSignoutButtonHandler = this.clickSignoutButtonHandler.bind(this);
        this.readNotiHandler = this.readNotiHandler.bind(this);
    }

    componentDidMount() {
        this.props.onGetNoti()
            .then(() => {})
            .catch(() => {});
    }

    keyPressHandler = (e) => {
        if (this.state.searchWord && e.charCode === 13) {
            this.props.history.push(`/search=${this.state.searchWord}`);
        }
    };

    // for search input change
    handleChange(e) {
        this.setState({
            searchWord: e.target.value,
        });
    }

    clickSignoutButtonHandler() {
        this.props.onSignout()
            .then(() => {
                if (this.props.signoutStatus === signoutStatus.SUCCESS) {
                    this.props.history.push("/");
                }
                // TODO: we should handle timeout
            })
            .catch(() => {});
    }

    readNotiHandler(notificationId) {
        this.props.onReadNoti({ id: notificationId })
            .then(() => {
                this.props.onGetNoti();
            })
            .catch(() => {});
    }

    render() {
        let username = null;
        let id = null;
        if (this.props.me) {
            username = this.props.me.username;
            id = this.props.me.id;
        }

        let notifications = null;
        if (this.props.notifications.length > 0) {
            notifications = this.props.notifications.map(
                (notification) => {
                    let target = null;
                    let targetLink = "";
                    if (notification.target.type === "collection") {
                        targetLink = "/collection_id=";
                    } else if (notification.target.type === "review") {
                        targetLink = "/review_id=";
                    }

                    // if not follow notifications
                    if (notification.target.type !== "user") {
                        target = (
                            <Link
                              id="target-link"
                              to={targetLink + notification.target.id}
                              onClick={() => this.readNotiHandler(notification.id)}
                            >
                                {notification.target.string}&nbsp;
                            </Link>
                        );
                    }
                    return (
                        <div key={notification.id} className="notification-entry">
                            <Link
                              id="actor-link"
                              to={`/profile_id=${notification.actor.id}`}
                              onClick={() => this.readNotiHandler(notification.id)}
                            >
                                {notification.actor.username}
                            </Link>
                                &nbsp;{notification.verb}&nbsp;
                            {target}
                            {notification.timesince} ago&nbsp;
                            <button type="button" className="read-button" onClick={() => this.readNotiHandler(notification.id)}>x</button>
                        </div>
                    );
                },
            );
        } else {
            notifications = <h3 id="no-notifications-message">no notifications</h3>;
        }

        return (
            <div className="header">
                <Navbar id="header">
                    <Nav.Link className="logo" href="/main">PapersFeed</Nav.Link>
                    <div className="search"> {/* if 'Form', 'enter' triggers calls twice} */}
                        <Form.Control
                          className="search-input"
                          type="text"
                          placeholder="Search"
                          value={this.state.searchWord}
                          onChange={this.handleChange}
                          onKeyPress={this.keyPressHandler}
                        />
                        <Button
                          className="search-button"
                          href={`/search=${this.state.searchWord}`}
                          disabled={!this.state.searchWord}
                        >Search
                        </Button>
                    </div>
                    <div className="header-buttons">
                        <Dropdown className="dropdown-notification" alignRight>
                            <Dropdown.Toggle className="notification-button" variant="light" title="notification">
                                <SVG name="bell" height="20px" width="20px" />
                                <Badge variant="secondary">{notifications.length}</Badge>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="notification-menu">
                                {notifications}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="dropdown-account" alignRight>
                            <Dropdown.Toggle title="myaccount" variant="light" className="myaccount-button">
                                <Image className="user-photo" src={SamplePhoto} width={30} height={30} roundedCircle />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="myaccount-menu">
                                <Dropdown.Header className="username-header">{username}</Dropdown.Header>
                                <Dropdown.Item className="my-profile-button" href={`/profile_id=${id}`}>My Profile</Dropdown.Item>
                                <Dropdown.Item className="account-setting" href="/account_setting">Account Setting</Dropdown.Item>
                                <Dropdown.Item className="signout-button" onClick={this.clickSignoutButtonHandler}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
    signoutStatus: state.auth.signoutStatus,
    notifications: state.auth.notifications,
});

const mapDispatchToProps = (dispatch) => ({
    onSignout: () => dispatch(authActions.signout()),
    onGetNoti: () => dispatch(authActions.getNoti()),
    onReadNoti: (notificationId) => dispatch(authActions.readNoti(notificationId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

Header.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    onSignout: PropTypes.func,
    onGetNoti: PropTypes.func,
    onReadNoti: PropTypes.func,
    signoutStatus: PropTypes.string,
    notifications: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

Header.defaultProps = {
    me: null,
    history: null,
    onSignout: () => {},
    onGetNoti: () => {},
    onReadNoti: () => {},
    signoutStatus: signoutStatus.NONE,
    notifications: [],
};
