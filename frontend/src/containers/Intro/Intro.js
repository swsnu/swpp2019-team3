import React, { Component } from "react";

import { Signup, Signin } from "../../components";
import "./Intro.css";

class Intro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signupOpen: false,
            signInOpen: false,
        }
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
export default Intro;