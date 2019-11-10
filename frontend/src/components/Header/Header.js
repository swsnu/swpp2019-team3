import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: "",
            notifications: [],
        };

        this.handleChange = this.handleChange.bind(this);
    }

    // for search input change
    handleChange(e) {
        this.setState({
            searchKeyword: e.target.value,
        });
    }

    render() {
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
                                <Dropdown.Header>User className</Dropdown.Header>
                                <Dropdown.Item className="my-profile-button" href="/profile/user_id">My Profile</Dropdown.Item>
                                <Dropdown.Item className="logout-button" href="/">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar>
            </div>
        );
    }
}

export default Header;
