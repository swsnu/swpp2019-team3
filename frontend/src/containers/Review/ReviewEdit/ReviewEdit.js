import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

import {
    SideBar, Header, PaperSpec,
} from "../../../components";
// import * as actionCreators from "../../../store/actions/index";
import "./ReviewEdit.css";


class ReviewEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "review_title1",
            content: "review content",
            // title: "this.props.thisReview.title",
            // content: this.props.thisReview.content,
            paper: {
                id: 1,
                title: "paper_title",
                abstract: "abstract abstract abstract abstract abstract abstract abstract abstract ",
                date: "2019.10.30.",
                authors: "paper_authors",
                keywords: "paper_keywords",
                likeCount: 101,
                reviewCount: 3,
            },
        };
        this.handleChange = this.handleChange.bind(this);
        this.clickEditHandler = this.clickEditHandler.bind(this);
    }

    handleChange(e) {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    // 1 for paper id, 5 for review if
    clickEditHandler() {
        /* return this.props.onSetReviewContent(
            this.props.thisReview.id, this.state.title, this.state.content,
        )
            .then(
                () => {
                    this.props.history.push("/papers/1/5");
                },
            ); */
        this.props.history.push("/papers/1/5");
    }

    render() {
        return (
            <div className="review-edit">
                <Header />
                <SideBar />
                <div className="review-edit-page">
                    <div className="board">
                        <div className="paper-spec">
                            <PaperSpec
                              id={this.state.paper.id}
                              title={this.state.paper.title}
                              abstract={this.state.paper.abstract}
                              date={this.state.paper.date}
                              authors={this.state.paper.authors}
                              keywords={this.state.paper.keywords}
                              likeCount={this.state.paper.likeCount}
                              reviewCount={this.state.paper.reviewCount}
                            />
                        </div>
                        <Form.Group className="form-title" controlId="formReviewTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" className="title-input" as="textarea" rows="1" type="text" placeholder={this.state.title} value={this.state.title} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="form-content" controlId="formReviewContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control name="content" className="content-input" as="textarea" rows="7" type="text" placeholder={this.state.content} value={this.state.content} onChange={this.handleChange} />
                        </Form.Group>
                        <Button className="edit-button" onClick={this.clickEditHandler}>Edit</Button>
                    </div>
                </div>
            </div>
        );
    }
}

/*
const mapStateToProps = (state) => ({
    // currentUserId: state.auth.currentUserId,
    // thisPaper: state.paper.selected.paper,
    thisReview: state.review.selected.review,
});

const mapDispatchToProps = (dispatch) => ({
    onSetReviewContent: (review, title, content) => dispatch(
        actionCreators.setReviewContent(review, title, content),
    ),
});
*/
ReviewEdit.propTypes = {
    /* thisPaper: PropTypes.shape({
        id: PropTypes.number,
        authors: PropTypes.string,
        title: PropTypes.string,
        publication: PropTypes.string,
        abstract: PropTypes.string,
        likeCount: PropTypes.number,
        isLiked: PropTypes.bool,
        date_created: PropTypes.string,
    }),
    thisReview: PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.number,
        paper: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
    onSetReviewContent: PropTypes.func, */
    history: PropTypes.objectOf(PropTypes.any),

};

ReviewEdit.defaultProps = {
    /* thisPaper: {},
    thisReview: {},
    onSetReviewContent: () => {}, */
    history: null,
};

export default ReviewEdit;
// export default connect(mapStateToProps, mapDispatchToProps)(ReviewEdit);
