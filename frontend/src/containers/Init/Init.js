import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Form, Button, ButtonGroup } from "react-bootstrap";
import { authActions } from "../../store/actions";

import "./Init.css";

class Init extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: [],
            checkedKeywords: [],
        };

        this.checkHandler = this.checkHandler.bind(this);
        this.clickMoreHandler = this.clickMoreHandler.bind(this);
        this.clickConfirmHandler = this.clickConfirmHandler.bind(this);
    }

    componentDidMount() {
        this.props.onGetKeywords()
            .then(() => {
                this.setState({
                    keywords: this.props.keywordItems,
                });
            });
    }

    checkHandler = (id) => {
        const { checkedKeywords } = this.state;
        if (this.state.checkedKeywords.includes(id)) {
            this.setState({
                checkedKeywords: checkedKeywords.splice(checkedKeywords.indexOf(id), 1),
            });
        } else {
            this.setState({
                checkedKeywords: checkedKeywords.concat(id),
            });
        }
    }

    clickMoreHandler = () => {
        this.props.onGetKeywords({
            page_number: this.props.keywordPageNum + 1,
        })
            .then(() => {
                const { keywords } = this.state;
                this.setState({
                    keywords: keywords.concat(this.props.keywordItems),
                });
            });
    }

    clickConfirmHandler = () => {
        this.props.onMakeTaste({ keywords: this.state.checkedKeywords })
            .then(() => {
                this.props.history.push("/main");
            });
    }

    render() {
        let keywords = null;
        let keywordsSet = null;
        if (this.state.keywords != null && this.state.keywords.length > 0) {
            keywords = this.state.keywords.map((keyword) => (
                <Form.Check
                  inline
                  label={keyword.name}
                  key={keyword.id}
                  type="checkbox"
                  id={keyword.id}
                  onChange={() => this.checkHandler(keyword.id)}
                />
            ));

            let count = keywords.length / 4;
            while (count > 0 && keywords.length > 5) {
                if (keywordsSet != null && keywordsSet.length > 0) {
                    keywordsSet.push(
                        <div key={count} className={`checkbox${count}`}>
                            {keywords.splice(0, 4)}
                        </div>,
                    );
                } else {
                    keywordsSet = [
                        <div key={count} className={`checkbox${count}`}>
                            {keywords.splice(0, 4)}
                        </div>,
                    ];
                }
                count -= 1;
            }

            if (keywordsSet != null) {
                keywordsSet.push(
                    <div key={count} className={`checkbox${count}`}>
                        {keywords}
                    </div>,
                );
            } else {
                keywordsSet = [
                    <div key={count} className={`checkbox${count}`}>
                        {keywords.splice(0, 4)}
                    </div>,
                ];
            }
        }

        return (
            <div className="init">
                <div className="keywordCheckbox">
                    <div className="text">
                        <div className="text-1">What are you interested in?</div>
                        <div className="text-2">(Please choose at least 5)</div>
                    </div>
                    {keywordsSet}
                    <ButtonGroup className="check-buttons" size="lg">
                        { this.props.keywordFinished ? null
                            : (
                                <Button
                                  className="more-button"
                                  onClick={this.clickMoreHandler}
                                  size="lg"
                                  variant="secondary"
                                >
                View More
                                </Button>
                            ) }
                        <Button
                          className="confirm-button"
                          onClick={this.clickConfirmHandler}
                          size="lg"
                          variant="info"
                          disabled={this.state.checkedKeywords.length < 5}
                        >
                Confirm
                        </Button>
                    </ButtonGroup>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    keywordPageNum: state.auth.keywords.pageNum,
    keywordFinished: state.auth.keywords.finished,
    keywordItems: state.auth.keywords.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetKeywords: (pageNum) => dispatch(authActions.getKeywordsInit(pageNum)),
    onMakeTaste: (keywords) => dispatch(authActions.makeTasteInit(keywords)),
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
