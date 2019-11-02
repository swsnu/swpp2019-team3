import React, { Component } from "react";
// import {connect} from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

// import * as actionCreators from "../../../store/actions/index";

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
                <h>Your Description</h>
                <textarea
                  id="editDescription"
                  rows="4"
                  type="text"
                  value={this.state.description}
                  onChange={(event) => this.setState({ description: event.target.value })}
                />
                <div>
                    <Button id="applyButton" onClick={this.clickApplyHandler}>Apply</Button>
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
    userDescription: "asdf",
    history: null,
};

export default ProfileEdit;
