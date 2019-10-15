import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: "",
            activeMyAccout: false,
            notifications: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleMyAccount = this.handleMyAccount.bind(this);
    }

    // for search input change
    handleChange(e) {
        this.setState({
            searchKeyword: e.target.value,
        });
    }

    // for search
    handleSearch() {
        return this.searchKeyword;
    }

    // for my account
    handleMyAccount() {
        if (this.state.activeMyAccout === false) {
            this.setState({
                activeMyAccout: true,
            });
        } else {
            this.setState({
                activeMyAccout: false,
            });
        }
    }

    render() {
        return (
            <div>
                <Navbar className="header">
                    <Nav.Link className="logo" href="/main">Papersfeed</Nav.Link>
                    <Form inline className="search">
                        <Form.Control type="text" placeholder="Search" bsPrefix="search-input" value={this.state.searchKeyword} onChange={this.handleChange} />
                        <Button class="search-button" href={`/search/${this.state.searchKeyword}`} onClick={this.handleSearch}>Search</Button>
                    </Form>
                    <div className="buttons">
                        <Dropdown>
                            <Dropdown.Toggle title="notification" className="notification-button">notification</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.state.notifications}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button className="myaccount-button" onClick={this.handleMyAccount}>My Account</Button>
                        <Modal className="myaccount-modal" centered show={this.state.activeMyAccout}>
                            <Modal.Body className="buttons">
                                <Button className="my-profile-button" href="/profile">My Profile</Button>
                                <Button className="logout-button" href="/login">Logout</Button>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.handleMyAccount}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Navbar>
            </div>
        );
    }
}

export default Header;
