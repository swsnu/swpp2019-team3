import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";
import authActions from "../../../store/actions/index";
import { signupStatus } from "../../../store/reducers/auth";
import "./IntroModal.css";

class IntroModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signupStatus: signupStatus.NONE,
            isSignupOpen: false,
            isSigninOpen: false,
            username: "",
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
        const signingUpUser = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
        };
        this.props.onSignup(signingUpUser)
            .then(() => {
                switch (this.props.signupStatus) {
                case signupStatus.WAITING:
                    // TODO: we should handle timeout
                    break;
                case signupStatus.SUCCESS:
                    this.setState({ signupStatus: signupStatus.NONE });
                    this.props.history.push("/main");
                    break;
                case signupStatus.DUPLICATE_USERNAME:
                    this.setState({ signupStatus: signupStatus.DUPLICATE_USERNAME });
                    break;
                case signupStatus.DUPLICATE_EMAIL:
                    this.setState({ signupStatus: signupStatus.DUPLICATE_EMAIL });
                    break;
                default:
                    break;
                }
            });
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

        let signupMessage = null;
        if (this.state.signupStatus === signupStatus.DUPLICATE_USERNAME) {
            signupMessage = "This username already exists";
        } else if (this.state.signupStatus === signupStatus.DUPLICATE_EMAIL) {
            signupMessage = "This email already exists";
        }

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
                    <h3 id="signup-message">{signupMessage}</h3>
                    <Button
                      className="signup-button"
                      onClick={this.clickSignupButtonHandler}
                      disabled={!(this.state.username && this.state.password && this.state.email)}
                    >Sign Up
                    </Button>
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
                    <Button
                      className="signin-button"
                      onClick={this.clickSigninButtonHandler}
                      disabled={!(this.state.username && this.state.password)}
                    >Sign In
                    </Button>
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
                          className="username-input"
                          type="text"
                          placeholder="username"
                          value={this.state.username}
                          onChange={(e) => this.setState({ username: e.target.value })}
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

const mapStateToProps = (state) => ({
    signupStatus: state.auth.status,
});

const mapDispatchToProps = (dispatch) => ({
    onSignup: (user) => dispatch(authActions.signup(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntroModal);

IntroModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    onSignup: PropTypes.func,
    signupStatus: PropTypes.string,
};

IntroModal.defaultProps = {
    history: null,
    onSignup: null,
    signupStatus: signupStatus.NONE,
};
