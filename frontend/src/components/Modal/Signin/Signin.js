import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";
import "./Signin.css";

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            id: "",
            password: "",
        };
        this.openModalHandler = this.openModalHandler.bind(this);
        this.clickSigninButtonHandler = this.clickSigninButtonHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
    }

    openModalHandler() {
        this.setState({ isOpen: true });
    }

    clickSigninButtonHandler() {
        this.setState({ isOpen: false });
        this.props.history.push("/main");
    }

    clickCancelButtonHandler() {
        this.setState({ isOpen: false });
    }

    render() {
        return (
            <div className="signin">
                <Button className="open-button" onClick={this.openModalHandler}>Sign In</Button>
                <Modal
                  show={this.state.isOpen}
                  className="signin-modal"
                  centered
                >
                    <Modal.Header>
                        <h2 id="welcome-back">Welcome back</h2>
                        <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl
                          className="id-input"
                          type="text"
                          placeholder="ID"
                          value={this.state.id}
                          onChange={(e) => this.setState({ id: e.target.value })}
                        />
                        <FormControl
                          className="password-input"
                          type="text"
                          placeholder="password"
                          value={this.state.password}
                          onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="signin-button" onClick={this.clickSigninButtonHandler}>Sign In</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default Signin;

Signin.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

Signin.defaultProps = {
    history: null,
};
