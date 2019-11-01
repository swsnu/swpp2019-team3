import React, { Component } from "react";
import PropTypes from "prop-types";

import { Signup, Signin } from "../../components";
import "./Intro.css";

class Intro extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="intro-page">
                <h1 id="welcome">Welcome to PAPERSFEED!</h1>
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