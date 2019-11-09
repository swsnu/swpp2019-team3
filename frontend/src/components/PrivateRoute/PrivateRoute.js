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
                case getMeStatus.WAITING:
                    // TODO: we should handle timeout
                    break;
                case getMeStatus.SUCCESS:
                    if (this.props.history.location.pathname === "/") {
                        this.props.history.goBack();
                    }
                    break;
                case getMeStatus.FAILURE:
                    if (this.props.history.location.pathname !== "/") {
                        this.props.history.push("/");
                    }
                    break;
                default:
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
