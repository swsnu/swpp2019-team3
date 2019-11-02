import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";
import "./Signup.css";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            id: "",
            password: "",
            email: "",
        };
        this.openModalHandler = this.openModalHandler.bind(this);
        this.clickSignupButtonHandler = this.clickSignupButtonHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
    }

    openModalHandler() {
        this.setState({ isOpen: true });
    }

    clickSignupButtonHandler() {
        this.setState({ isOpen: false });
        this.props.history.push("/main");
    }

    clickCancelButtonHandler() {
        this.setState({ isOpen: false });
    }

    render() {
        return (
            <div className="signup">
                <Button className="open-button" onClick={this.openModalHandler}>Sign Up</Button>
                <Modal
                  show={this.state.isOpen}
                  className="signup-modal"
                  centered
                >
                    <Modal.Header>
                        <h2 id="create-account">Create account</h2>
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
                        <FormControl
                          className="email-input"
                          type="text"
                          placeholder="email"
                          value={this.state.email}
                          onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                        <Button className="signup-button" onClick={this.clickSignupButtonHandler}>Sign Up</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default Signup;

Signup.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

Signup.defaultProps = {
    history: null,
};
