import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { PaperSpec } from "../../../components";
import { reviewActions, paperActions } from "../../../store/actions";
import "./ReviewControl.css";


class ReviewControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: "",
            paper: { },
            likeCount: 0,
            authorNames: [],
            // keywords: [],
            date: "",
            thisReview: { id: 0 },
            paperId: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.clickButtonHandler = this.clickButtonHandler.bind(this);
    }

    componentDidMount() {
        if (this.props.mode === 0) {
            this.props.onGetPaper({ id: this.props.match.params.paper_id })
                .then(() => {
                    this.setState({
                        paper: this.props.selectedPaper,
                        likeCount: this.props.selectedPaper.count.likes,
                        authorNames: this.props.selectedPaper.authors.map((x) => `${x.first_name} ${x.last_name}`),
                        date: this.props.selectedPaper.publication.date,
                        title: "Enter title here.",
                        content: "Enter content here.",
                    });
                }).catch(() => {
                });
        } else if (this.props.mode === 1) {
            this.props.onGetReview({ id: this.props.match.params.review_id })
                .then(() => {
                    this.setState({
                        thisReview: this.props.selectedReview.review,
                        title: this.props.selectedReview.review.title,
                        content: this.props.selectedReview.review.text,
                        paperId: this.props.selectedReview.review.paper.id,
                    });
                    this.props.onGetPaper({ id: this.state.paperId })
                        .then(() => {
                            this.setState({
                                paper: this.props.selectedPaper,
                                likeCount: this.props.selectedPaper.count.likes,
                                authorNames: this.props.selectedPaper.authors.map((x) => `${x.first_name} ${x.last_name}`),
                                date: this.props.selectedPaper.publication.date,
                            });
                        }).catch(() => {
                        });
                }).catch(() => {

                });
        }
    }

    clickButtonHandler() {
        let review = {};
        if (this.props.mode === 0) {
            review = { id: this.state.paper.id, title: this.state.title, text: this.state.content };
            this.props.onMakeNewReview(review)
                .then(() => {
                    this.props.history.push(`/review_id=${this.props.newReview.review.id}`);
                }).catch(() => {
                });
        } else if (this.props.mode === 1) {
            review = {
                id: this.state.thisReview.id,
                title: this.state.title,
                text: this.state.content,
            };

            this.props.onSetReview(review)
                .then(() => {
                    this.props.history.push(`/review_id=${this.state.thisReview.id}`);
                }).catch(() => {

                });
        }
    }

    handleChange(e) {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    render() {
        return (
            <div className="review-control">
                <div className="review-control-page">
                    <div className="board">
                        <div className="header">{this.props.mode ? "Edit Review For" : "Create Review For"}</div>
                        <div className="paper-spec">
                            <PaperSpec
                              id={this.state.paper.id}
                              title={this.state.paper.title}
                              liked={this.state.paper.liked}
                              abstract={this.state.paper.abstract}
                              likeCount={this.state.likeCount}
                              authors={this.state.authorNames}
                              date={this.state.date}
                            />
                        </div>
                        <Form.Group className="form-title" controlId="formReviewTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" className="title-input" as="textarea" rows="1" type="text" placeholder={this.state.title} value={this.state.title} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="form-content" controlId="formReviewContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control name="content" className="content-input" as="textarea" value={this.state.content} rows="7" type="text" placeholder={this.state.content} onChange={this.handleChange} />
                        </Form.Group>
                        { this.props.mode === 0
                            ? <Button className="create-button" onClick={this.clickButtonHandler}>Create</Button>
                            : <Button className="edit-button" onClick={this.clickButtonHandler}>Edit</Button> }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedReview: state.review.selected,
    newReview: state.review.make,
    selectedPaper: state.paper.selectedPaper,
    getPaperStatus: state.paper.getPaperStatus,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewReview: (review) => (dispatch(reviewActions.makeNewReview(review))),
    onSetReview: (review) => (dispatch(reviewActions.setReviewContent(review))),
    onGetReview: (reviewId) => dispatch(reviewActions.getReview(reviewId)),
    onGetPaper: (paperId) => dispatch(paperActions.getPaper(paperId)),
});

ReviewControl.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    mode: PropTypes.number,
    selectedReview: PropTypes.objectOf(PropTypes.any),
    onMakeNewReview: PropTypes.func,
    onSetReview: PropTypes.func,
    onGetReview: PropTypes.func,
    selectedPaper: PropTypes.objectOf(PropTypes.any),
    onGetPaper: PropTypes.func,
    newReview: PropTypes.objectOf(PropTypes.any),
};

ReviewControl.defaultProps = {
    history: null,
    match: null,
    mode: 0,
    selectedReview: {},
    onMakeNewReview: () => {},
    onSetReview: () => {},
    onGetReview: () => {},
    selectedPaper: {},
    onGetPaper: () => {},
    newReview: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReviewControl));
