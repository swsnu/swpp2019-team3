import React, { Component } from "react";
import {
    Navbar, Form, Dropdown, Button, Nav, Badge,
} from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { authActions } from "../../store/actions";
import { signoutStatus } from "../../constants/constants";
import "./Header.css";
import SVG from "../svg";
import PhotoDisplayer from "../Photo/PhotoDisplayer/PhotoDisplayer";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchWord: "",
            openNoti: false,
            notiLoading: true,
            notifications: [],
            newNotifications: [],
            notiPageNum: 0,
            notiFinished: true,
        };

        this.notiMenu = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
        this.openNoti = this.openNoti.bind(this);
        this.keyPressHandler = this.keyPressHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clickSignoutButtonHandler = this.clickSignoutButtonHandler.bind(this);
        this.readNotiHandler = this.readNotiHandler.bind(this);
    }

    componentDidMount() {
        this.props.onGetNoti(0);
    }

    getNotiTrigger(pageNum) {
        this.props.onGetNoti(pageNum + 1)
            .then(() => {
                const { notifications } = this.state;
                this.setState({
                    notifications: notifications.concat(this.props.notifications),
                    notiPageNum: this.props.notiPageNum,
                    notiFinished: this.props.notiFinished,
                    notiLoading: false,
                });
            })
            .catch(() => {});
    }

    keyPressHandler = (e) => {
        if (this.state.searchWord && e.charCode === 13) {
            this.props.history.push(`/search=${this.state.searchWord}`);
        }
    };

    handleScroll = () => {
        const { scrollHeight } = this.notiMenu.current.childNodes[1];
        const { scrollTop } = this.notiMenu.current.childNodes[1];
        const { clientHeight } = this.notiMenu.current.childNodes[1];

        if (!this.state.notiLoading
            && !this.state.notiFinished
            && ((scrollTop + clientHeight + 50)
            > scrollHeight)) {
            this.setState({
                notiLoading: true,
            });
            this.getNotiTrigger(this.state.notiPageNum);
        }
    }

    openNoti() {
        if (!this.state.openNoti) {
            this.getNotiTrigger(0);
            this.setState({ openNoti: true });
            this.notiMenu.current.childNodes[1].addEventListener("scroll", this.handleScroll);
        } else {
            this.notiMenu.current.childNodes[1].removeEventListener("scroll", this.handleScroll);
            this.setState({
                openNoti: false,
                notifications: [],
                newNotifications: [],
                notiPageNum: 0,
                notiFinished: true,
            });
        }
    }

    /* eslint-disable no-await-in-loop */
    async handleNotis() {
        // get notifications until previous pageCount
        const end = this.state.notiPageNum;
        this.setState({
            newNotifications: [],
        });
        for (let i = 1; (i === 1) || (i < end + 1); i += 1) {
            await this.forEachHandleNoti(i, end);
            if (i === end || this.props.notiFinished === true) {
                this.setState((prevState) => ({
                    notifications: prevState.newNotifications.concat(this.props.notifications),
                    notiPageNum: this.props.notiPageNum,
                    newNotifications: [],
                    notiFinished: this.props.notiFinished,
                }));
                break;
            }
            this.setState((prevState) => ({
                newNotifications: prevState.newNotifications.concat(this.props.notifications),
            }));
        }
    }
    /* eslint-enable no-await-in-loop */

    forEachHandleNoti(i) {
        return this.props.onGetNoti(i);
    }

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
                this.handleNotis();
            })
            .catch(() => {});
    }

    render() {
        let username = null;
        let id = null;
        let profilePhoto = <div />;
        if (this.props.me) {
            username = this.props.me.username;
            id = this.props.me.id;
            profilePhoto = (
                <PhotoDisplayer
                  index={this.props.me.photo_index}
                  width="30px"
                  height="30px"
                  roundedCircle
                />
            );
        }

        let notifications = null;
        if (this.state.notifications.length > 0) {
            notifications = this.state.notifications.map(
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
                    <Nav.Link disabled={this.props.history.location.state != null && this.props.history.location.state.previous === "signup"} className="logo" href="/main">PapersFeed</Nav.Link>
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
                          disabled={!this.state.searchWord || (this.props.history.location.state != null && this.props.history.location.state.previous === "signup")}
                        >Search
                        </Button>
                    </div>
                    <div className="header-buttons">
                        <Dropdown ref={this.notiMenu} className="dropdown-notification" alignRight onToggle={() => this.openNoti()}>
                            <Dropdown.Toggle className="notification-button" variant="light" title="notification">
                                <SVG name="bell" height="20px" width="20px" />
                                <Badge variant="secondary">{this.props.notiTotalCount}</Badge>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="notification-menu">
                                {notifications}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="dropdown-account" alignRight>
                            <Dropdown.Toggle title="myaccount" variant="light" className="myaccount-button">
                                {profilePhoto}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="myaccount-menu">
                                <Dropdown.Header className="username-header">{username}</Dropdown.Header>
                                <Dropdown.Item className="my-profile-button" href={(this.props.history.location.state != null && this.props.history.location.state.previous === "signup") ? null : `/profile_id=${id}`}>My Profile</Dropdown.Item>
                                <Dropdown.Item className="account-setting" href={(this.props.history.location.state != null && this.props.history.location.state.previous === "signup") ? null : "/account_setting"}>Account Setting</Dropdown.Item>
                                <Dropdown.Item className="tutorial-link" href={(this.props.history.location.state != null && this.props.history.location.state.previous === "signup") ? null : "/tutorial"}>Tutorial</Dropdown.Item>
                                <Dropdown.Item className="signout-button" onClick={(this.props.history.location.state != null && this.props.history.location.state.previous === "signup") ? null : this.clickSignoutButtonHandler}>Logout</Dropdown.Item>
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
    notifications: state.auth.notifications.notifications,
    notiPageNum: state.auth.notifications.pageNum,
    notiFinished: state.auth.notifications.finished,
    notiTotalCount: state.auth.notifications.totalCount,
});

const mapDispatchToProps = (dispatch) => ({
    onSignout: () => dispatch(authActions.signout()),
    onGetNoti: (pageNum) => dispatch(authActions.getNoti(pageNum)),
    onReadNoti: (notificationId) => dispatch(authActions.readNoti(notificationId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));

Header.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    onSignout: PropTypes.func,
    onGetNoti: PropTypes.func,
    onReadNoti: PropTypes.func,
    signoutStatus: PropTypes.string,
    notifications: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    notiPageNum: PropTypes.number,
    notiFinished: PropTypes.bool,
    notiTotalCount: PropTypes.number,
};

Header.defaultProps = {
    me: null,
    history: null,
    onSignout: () => {},
    onGetNoti: () => {},
    onReadNoti: () => {},
    signoutStatus: signoutStatus.NONE,
    notifications: [],
    notiPageNum: 0,
    notiFinished: true,
    notiTotalCount: 0,
};
