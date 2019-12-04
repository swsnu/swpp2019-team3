import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { authActions } from "../../store/actions";

class Init extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: [],
        };
    }

    componentDidMount() {
        this.props.onGetKeywords()
            .then(() => {
                this.setState({
                    keywords: this.props.keywordItems,
                });
            });
    }

    render() {
        keywords = 
        return ();
    }
}

const mapStateToProps = (state) => ({
    keywordPageNum: state.auth.keywords.pageNum,
    keywordFinished: state.auth.keywords.finished,
    keywordItems: state.auth.keywords.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetKeywords: (pageNum) => dispatch(authActions.getKeywords(pageNum)),
    onMakeTaste: (keywords) => dispatch(authActions.makeNewTasteInit(keywords)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Init);

Init.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    keywordItems: PropTypes.arrayOf(PropTypes.any),
    onGetKeywords: PropTypes.func,
    onMakeTaste: PropTypes.func,
    keywordFinished: PropTypes.bool,
    keywordPageNum: PropTypes.number,
};

Init.defaultProps = {
    history: null,
    keywordItems: [],
    onGetKeywords: () => {},
    onMakeTaste: () => {},
    keywordFinished: true,
    keywordPageNum: 0,
};
