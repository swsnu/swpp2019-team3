import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { authActions } from "../../store/actions";
import { signoutStatus, getNotiStatus } from "../../constants/constants";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: "",
        };

        this.clickSignoutButtonHandler = this.clickSignoutButtonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.onGetNoti()
            .then(() => {

            });
    }

    // for search input change
    handleChange(e) {
        this.setState({
            searchKeyword: e.target.value,
        });
    }

    clickSignoutButtonHandler() {
        this.props.onSignout()
            .then(() => {
                if (this.props.signoutStatus === signoutStatus.SUCCESS) {
                    this.props.history.push("/");
                }
                // TODO: we should handle timeout
            });
    }

    render() {
        let username = null;
        if (this.props.me) {
            username = this.props.me.username;
        }

        let notifications = null;
        if (this.props.notifications) {
            notifications = this.props.notifications.map(
                (notification) => (
                    <Dropdown.Item key={notification.id}>
                        <Link to="/a">a</Link>
                        <Link to="b">b</Link>
                    </Dropdown.Item>
                ),
            );
        }

        return (
            <div>
                <Navbar className="header">
                    <Nav.Link className="logo" href="/main">Papersfeed</Nav.Link>
                    <Form inline className="search">
                        <Form.Control className="search-input" type="text" placeholder="Search" bsPrefix="search-input" value={this.state.searchKeyword} onChange={this.handleChange} />
                        <Button className="search-button" href="/search">Search</Button>
                    </Form>
                    <div className="buttons">
                        <Dropdown>
                            <Dropdown.Toggle title="notification" className="notification-button">notification</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {notifications}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                            <Dropdown.Toggle title="myaccount" className="myaccount-button">My Account</Dropdown.Toggle>
                            <Dropdown.Menu className="myaccount-menu">
                                <Dropdown.Header className="username-header">{username}</Dropdown.Header>
                                <Dropdown.Item className="my-profile-button" href="/profile/user_id">My Profile</Dropdown.Item>
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
    getNotiStatus: state.auth.getNotiStatus,
    notifications: state.auth.notifications,
});

const mapDispatchToProps = (dispatch) => ({
    onSignout: () => dispatch(authActions.signout()),
    onGetNoti: () => dispatch(authActions.getNoti()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

Header.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    onSignout: PropTypes.func,
    onGetNoti: PropTypes.func,
    signoutStatus: PropTypes.string,
    getNotiStatus: PropTypes.string,
    notifications: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

Header.defaultProps = {
    me: null,
    history: null,
    onSignout: null,
    onGetNoti: null,
    signoutStatus: signoutStatus.NONE,
    getNotiStatus: getNotiStatus.NONE,
    notifications: [],
};
