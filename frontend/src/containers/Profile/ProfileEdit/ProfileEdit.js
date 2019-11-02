import React, { Component } from "react";
// import {connect} from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

import { SideBar, Header } from "../../../components";
// import * as actionCreators from "../../../store/actions/index";

import "./ProfileEdit.css";

class ProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: this.props.userDescription,
        };
    }

    clickApplyHandler = () => {
        // Call onSetUserProfile of ProfileEdit and redirect to ‘Profile Page’.
        // this.props.onSetUserProfile();
        this.props.history.push(`/profile/${this.props.currentUserID}`);
    }

    render() {
        return (
            <div className="ProfileEdit">
                <Header id="Header" />
                <SideBar id="SideBar" />
                <div className="ProfileEditContent">
                    <div className="EditDescArea">
                        <h id="editDescTag">Your Description</h>
                        <textarea
                          id="editDescription"
                          rows="4"
                          type="text"
                          value={this.state.description}
                          onChange={(event) => this.setState({ description: event.target.value })}
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

ProfileEdit.propTypes = {
    currentUserID: PropTypes.number,
    userDescription: PropTypes.string,
    history: PropTypes.objectOf(PropTypes.any),
};

ProfileEdit.defaultProps = {
    currentUserID: 1,
    userDescription: "Kneel before me human, as I am the mighty and cute cat!",
    history: null,
};

export default ProfileEdit;
