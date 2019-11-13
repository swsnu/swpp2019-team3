import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

import { userActions } from "../../../store/actions";
import "./AccountSetting.css";

class AccountSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: this.props.myInfo.description,
            email: this.props.myInfo.email,
        };
    }

    componentDidMount() {
        this.props.onGetMyInfo(this.props.myId);
    }

    clickApplyHandler = () => {
        const newUserInfo = {
            description: this.state.description,
            email: this.state.email,
        };
        this.props.onEditMyInfo(newUserInfo);
    }

    render() {
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
                    </div>
                    <div className="ButtonArea">
                        <Button id="applyButton" onClick={this.clickApplyHandler}>Apply</Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    myId: state.auth.my.id,
    myInfo: state.user.selectedUser,
});

const mapDispatchToProps = (dispatch) => ({
    onGetMyInfo: (userId) => dispatch(userActions.getUserByUserId(userId)),
    onEditMyInfo: (newUserInfo) => dispatch(userActions.editUserInfo(newUserInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);

AccountSetting.propTypes = {
    myId: PropTypes.number,
    myInfo: PropTypes.objectOf(PropTypes.any),
    // history: PropTypes.objectOf(PropTypes.any),
    onGetMyInfo: PropTypes.func,
    onEditMyInfo: PropTypes.func,
};

AccountSetting.defaultProps = {
    myId: 1,
    myInfo: null,
    // history: null,
    onGetMyInfo: null,
    onEditMyInfo: null,
};
