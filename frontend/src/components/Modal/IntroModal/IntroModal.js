import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";
import "./IntroModal.css";

class IntroModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignupOpen: false,
            isSigninOpen: false,
            id: "",
            password: "",
            email: "",
        };
        this.openSignupHandler = this.openSignupHandler.bind(this);
        this.openSigninHandler = this.openSigninHandler.bind(this);
        this.clickSignupButtonHandler = this.clickSignupButtonHandler.bind(this);
        this.clickSigninButtonHandler = this.clickSigninButtonHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
    }

    openSignupHandler() {
        this.setState({ isSignupOpen: true });
    }

    openSigninHandler() {
        this.setState({ isSigninOpen: true });
    }

    clickSignupButtonHandler() {
        this.setState({ isSignupOpen: false });
        this.props.history.push("/main");
    }

    clickSigninButtonHandler() {
        this.setState({ isSigninOpen: false });
        this.props.history.push("/main");
    }

    clickCancelButtonHandler() {
        this.setState({ isSignupOpen: false, isSigninOpen: false });
    }

    render() {
        let modalHeader = null;
        let emailInput = null;
        let modalFooter = null;
        if (this.state.isSignupOpen) {
            modalHeader = (
                <Modal.Header>
                    <h2 id="create-account">Create account</h2>
                    <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                </Modal.Header>
            );
            emailInput = (
                <FormControl
                  className="email-input"
                  type="text"
                  placeholder="email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
            );
            modalFooter = (
                <Modal.Footer className="modal-footer">
                    <Button className="signup-button" onClick={this.clickSignupButtonHandler}>Sign Up</Button>
                </Modal.Footer>
            );
        } else if (this.state.isSigninOpen) {
            modalHeader = (
                <Modal.Header>
                    <h2 id="welcome-back">Welcome back</h2>
                    <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                </Modal.Header>
            );
            modalFooter = (
                <Modal.Footer>
                    <Button className="signin-button" onClick={this.clickSigninButtonHandler}>Sign In</Button>
                </Modal.Footer>
            );
        }
        return (
            <div className="intromodal">
                <div className="buttons">
                    <Button className="signup-open-button" onClick={this.openSignupHandler}>Sign Up</Button>
                    <Button className="signin-open-button" onClick={this.openSigninHandler}>Sign In</Button>
                </div>
                <Modal
                  show={this.state.isSignupOpen || this.state.isSigninOpen}
                  className="signup-modal"
                  centered
                >
                    {modalHeader}
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
                        {emailInput}
                    </Modal.Body>
                    {modalFooter}
                </Modal>
            </div>
        );
    }
}
export default IntroModal;

IntroModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

IntroModal.defaultProps = {
    history: null,
};
