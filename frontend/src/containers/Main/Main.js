/* eslint-disable react/prefer-stateless-function */
import React, { Component } from "react";
import PropTypes from "prop-types";
import SubscriptionFeed from "../Subscription/SubscriptionFeed";

// import "./Main.css";

// I want to give a choice for users to select what to display on their "Main".
// The disabling of 'prefer-stateless-function' is the result of such plan.
// If our team has not enough time or thinks it's unnecessary,
// we may consider remove this component and set SubscriptionFeed as new "Main".
class Main extends Component {
    render() {
        return (
            <div className="main">
                <div className="feeds">
                    <SubscriptionFeed history={this.props.history} />
                </div>
            </div>
        );
    }
}

export default Main;

Main.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

Main.defaultProps = {
    history: null,
};
