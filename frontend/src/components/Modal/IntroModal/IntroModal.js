import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";
import { authActions } from "../../../store/actions";
import { signupStatus, signinStatus } from "../../../store/reducers/auth/auth";
import "./IntroModal.css";

class IntroModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            isSignupOpen: false,
            isSigninOpen: false,
            email: "",
            username: "",
            password: "",
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
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
        };
        if (!(/^[^@ ]+@[^@ .]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2,3})?$/.test(signingUpUser.email))) {
            this.setState({ signupStatus: signupStatus.WRONG_EMAIL_FORMAT });
            return;
        }
        this.props.onSignup(signingUpUser)
            .then(() => {
                switch (this.props.signupStatus) {
                case signupStatus.WAITING:
                    // TODO: we should handle timeout
                    break;
                case signupStatus.SUCCESS:
                    this.setState({ signupStatus: signupStatus.NONE, isSignupOpen: false });
                    this.props.onSignin(signingUpUser);
                    this.props.history.push("/main");
                    break;
                case signupStatus.DUPLICATE_EMAIL:
                    this.setState({ signupStatus: signupStatus.DUPLICATE_EMAIL });
                    break;
                case signupStatus.DUPLICATE_USERNAME:
                    this.setState({ signupStatus: signupStatus.DUPLICATE_USERNAME });
                    break;
                default:
                    break;
                }
            });
    }

    clickSigninButtonHandler() {
        const signingInUser = {
            email: this.state.email,
            password: this.state.password,
        };
        this.props.onSignin(signingInUser)
            .then(() => {
                switch (this.props.signinStatus) {
                case signinStatus.WAITING:
                    // TODO: we should handle timeout
                    break;
                case signinStatus.SUCCESS:
                    this.setState({ signinStatus: signinStatus.NONE, isSigninOpen: false });
                    this.props.history.push("/main");
                    break;
                case signinStatus.USER_NOT_EXIST:
                    this.setState({ signinStatus: signinStatus.USER_NOT_EXIST });
                    break;
                case signinStatus.WRONG_PW:
                    this.setState({ signinStatus: signinStatus.WRONG_PW });
                    break;
                default:
                    break;
                }
            });
    }

    clickCancelButtonHandler() {
        this.setState({
            signupStatus: signupStatus.NONE,
            signinStatus: signinStatus.NONE,
            isSignupOpen: false,
            isSigninOpen: false,
            email: "",
            username: "",
            password: "",
        });
    }

    render() {
        let modalHeader = null;
        let usernameInput = null;
        let modalFooter = null;

        let signupMessage = null;
        if (this.state.signupStatus === signupStatus.DUPLICATE_EMAIL) {
            signupMessage = "This email already exists";
        } else if (this.state.signupStatus === signupStatus.DUPLICATE_USERNAME) {
            signupMessage = "This username already exists";
        } else if (this.state.signupStatus === signupStatus.WRONG_EMAIL_FORMAT) {
            signupMessage = "Wrong email format";
        }
        let signinMessage = null;
        if (this.state.signinStatus === signinStatus.USER_NOT_EXIST) {
            signinMessage = "This user does not exist";
        } else if (this.state.signinStatus === signinStatus.WRONG_PW) {
            signinMessage = "Wrong password";
        }

        if (this.state.isSignupOpen) {
            modalHeader = (
                <Modal.Header>
                    <h2 id="create-account">Create account</h2>
                    <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                </Modal.Header>
            );
            usernameInput = (
                <FormControl
                  className="username-input"
                  type="text"
                  placeholder="username"
                  value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
            );
            modalFooter = (
                <Modal.Footer className="modal-footer">
                    <h3 id="signup-message">{signupMessage}</h3>
                    <Button
                      className="signup-button"
                      onClick={this.clickSignupButtonHandler}
                      disabled={!(this.state.email && this.state.username && this.state.password)}
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
                    <h3 id="signin-message">{signinMessage}</h3>
                    <Button
                      className="signin-button"
                      onClick={this.clickSigninButtonHandler}
                      disabled={!(this.state.email && this.state.password)}
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
                          className="email-input"
                          type="text"
                          placeholder="email"
                          value={this.state.email}
                          onChange={(e) => this.setState({ email: e.target.value })}
                        />
                        {usernameInput}
                        <FormControl
                          className="password-input"
                          type="password"
                          placeholder="password"
                          value={this.state.password}
                          onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </Modal.Body>
                    {modalFooter}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    signupStatus: state.auth.signupStatus,
    signinStatus: state.auth.signinStatus,
});

const mapDispatchToProps = (dispatch) => ({
    onSignup: (user) => dispatch(authActions.signup(user)),
    onSignin: (user) => dispatch(authActions.signin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntroModal);

IntroModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    onSignup: PropTypes.func,
    onSignin: PropTypes.func,
    signupStatus: PropTypes.string,
    signinStatus: PropTypes.string,
};

IntroModal.defaultProps = {
    history: null,
    onSignup: null,
    onSignin: null,
    signupStatus: signupStatus.NONE,
    signinStatus: signinStatus.NONE,
};
