import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { authActions } from "../../store/actions";
import { getMeStatus } from "../../constants/constants";

class PrivateRoute extends Component {
    componentDidMount() {
        this.props.onGetMe()
            .then(() => {
                switch (this.props.getMeStatus) {
                case getMeStatus.SUCCESS:
                    if (this.props.history.location.pathname === "/") {
                        this.props.history.push("/main");
                    } else if (this.props.history.location.pathname === "/init") {
                        if (this.props.history.location.state == null || this.props.history.location.state !== "signup") {
                            this.props.history.push("/main");
                        }
                    }
                    break;
                case getMeStatus.FAILURE:
                    if (this.props.history.location.pathname !== "/") {
                        this.props.history.push("/");
                    }
                    break;
                default: // TODO: we should handle timeout
                    break;
                }
            });
    }

    render() {
        return (
            <div className="privateroute" />
        );
    }
}

const mapStateToProps = (state) => ({
    getMeStatus: state.auth.getMeStatus,
});

const mapDispatchToProps = (dispatch) => ({
    onGetMe: () => dispatch(authActions.getMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);

PrivateRoute.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    onGetMe: PropTypes.func,
    getMeStatus: PropTypes.string,
};

PrivateRoute.defaultProps = {
    history: null,
    onGetMe: null,
    getMeStatus: getMeStatus.NONE,
};
