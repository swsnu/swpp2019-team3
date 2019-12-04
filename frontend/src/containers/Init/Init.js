import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { authActions } from "../../store/actions";
import { Form } from "react-bootstrap";

class Init extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: [],
            checkedKeywords: [],
        };
        
        this.checkHandler = this.checkHandler.bind(this);
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
                checkedKeywords: checkedKeywords.splice(checkedKeywords.indexOf(id),1),
            });
        } else {
            this.setState({
                checkedKeywords = checkedKeywords.concat(id),
            });
        }
    }

    render() {
        let keywords = null;
        let keywordsSet = null;
        if (this.state.keywords.length >= 1) {
            keywords = this.state.keywords.map((keyword) => (
                <Form.Check
                  inline label={keyword.name}
                  type = 'checkbox'
                  id={keyword.id}
                  onChange={() => this.checkHandler(keyword.id)}
                />
            ));
            
            const count = keywords.length / 4;
            while (count > 0) {
                keywordsSet.push(
                    <div key='inilne checkbox' className={`checkbox${count}`}>
                        {keywords.splice(0, 4)}
                    </div>
                    );
            }

            keywordsSet.push(
                <div key='inilne checkbox' className={`checkbox${count}`}>
                {keywords}
            </div>
            );
        }

        return (
            <div className="init">
                <div classNmae="keywordCheckbox">
                    {keywordsSet}
                </div>
                { this.state.finished ? null
                    : (
                        <Button
                          className="more-button"
                          onClick={this.clickMoreHandler}
                          size="lg"
                          block
                        >
                View More
                        </Button>
                    ) }
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
