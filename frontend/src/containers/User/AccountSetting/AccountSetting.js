import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

import { userActions, authActions } from "../../../store/actions";
import "./AccountSetting.css";
import { userStatus } from "../../../constants/constants";

class AccountSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editUserStatus: userStatus.NONE,
            description: "",
            email: "",
        };
    }

    /* eslint-disable react/no-did-update-set-state */
    // It's OK to use setState if it is wrapped in a condition
    // please refer to https://reactjs.org/docs/react-component.html#componentdidupdate
    componentDidUpdate(prevProps) {
        if (this.props.me !== prevProps.me) {
            this.setState({
                description: this.props.me.description,
                email: this.props.me.email,
            });
        }
    }
    /* eslint-enable react/no-did-update-set-state */

    clickApplyHandler = () => {
        // if email is same with before, don't give it backend
        // otherwise, 420(EMAIL_ALREADY_EXISTS) will be raised
        let email = null;
        if (this.state.email !== this.props.me.email) {
            email = this.state.email;
        }
        const newUserInfo = {
            description: this.state.description,
            email,
        };
        this.props.onEditMyInfo(newUserInfo)
            .then(() => {
                if (this.props.editUserStatus === userStatus.DUPLICATE_EMAIL) {
                    this.setState({ editUserStatus: userStatus.DUPLICATE_EMAIL });
                } else if (this.props.editUserStatus === userStatus.SUCCESS) {
                    this.props.onGetMe();
                }
            });
    }

    render() {
        let beforeEmail = null;
        let beforeDescription = null;
        if (this.props.me) {
            beforeEmail = this.props.me.email;
            beforeDescription = this.props.me.description;
        }

        let editUserMessage = "";
        if (this.state.editUserStatus === userStatus.DUPLICATE_EMAIL) {
            editUserMessage = "This email already exists";
        }

        return (
            <div className="AccountSetting">
                <div className="AccountSettingContent">
                    <div className="EditDescArea">
                        <h3 id="editDescTag">Your Description</h3>
                        <textarea
                          id="editDescription"
                          rows="4"
                          type="text"
                          value={this.state.description}
                          onChange={(event) => this.setState({ description: event.target.value })}
                        />
                    </div>
                    <div className="EditEmailArea">
                        <h3 id="editEmailTag">Your Email</h3>
                        <input
                          id="editEmail"
                          type="text"
                          value={this.state.email}
                          onChange={(event) => this.setState({ email: event.target.value })}
                        />
                        <h3 id="edituser-message">{editUserMessage}</h3>
                    </div>
                    <div className="ButtonArea">
                        <Button
                          id="applyButton"
                          onClick={this.clickApplyHandler}
                          disabled={this.state.email === beforeEmail
                          && this.state.description === beforeDescription}
                        >Apply
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    editUserStatus: state.user.status,
    me: state.auth.me,
});

const mapDispatchToProps = (dispatch) => ({
    onEditMyInfo: (newUserInfo) => dispatch(userActions.editUserInfo(newUserInfo)),
    onGetMe: () => dispatch(authActions.getMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);

AccountSetting.propTypes = {
    editUserStatus: PropTypes.string,
    me: PropTypes.objectOf(PropTypes.any),
    onEditMyInfo: PropTypes.func,
    onGetMe: PropTypes.func,
};

AccountSetting.defaultProps = {
    editUserStatus: userStatus.NONE,
    me: null,
    onEditMyInfo: () => {},
    onGetMe: () => {},
};
