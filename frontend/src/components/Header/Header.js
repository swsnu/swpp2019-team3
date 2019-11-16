import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { authActions } from "../../store/actions";
import { signoutStatus } from "../../constants/constants";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: "",
            notifications: [],
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
                                {this.state.notifications}
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
};

Header.defaultProps = {
    me: null,
    history: null,
    onSignout: null,
    onGetNoti: null,
    signoutStatus: signoutStatus.NONE,
};
