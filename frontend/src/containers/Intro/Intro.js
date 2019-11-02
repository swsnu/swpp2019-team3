import React, { Component } from "react";
import PropTypes from "prop-types";

import { Signup, Signin } from "../../components";
import "./Intro.css";

/* eslint-disable react/prefer-stateless-function */
class Intro extends Component {
    render() {
        return (
            <div className="intro-page">
                <div className="welcome-sentence">
                    <h1 id="welcome-to">Welcome to&nbsp;</h1>
                    <h1 id="papersfeed">PAPERSFEED</h1>
                    <h1 id="exclamation-mark">!</h1>
                </div>
                <div className="buttons">
                    <Signup className="signup" history={this.props.history} />
                    <Signin className="signin" history={this.props.history} />
                </div>
            </div>
        );
    }
}

Intro.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

Intro.defaultProps = {
    history: null,
};

export default Intro;
