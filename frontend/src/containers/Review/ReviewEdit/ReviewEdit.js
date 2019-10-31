import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import { Route } from "react-router-dom";

import {
    SideBar, Header,
} from "../../../components";
import * as actionCreators from "../../../store/actions/index";


class ReviewEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.thisReview.title,
            content: this.props.thisReview.content,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    clickEditHandler() {
        return this.onSetReviewContent(
            this.props.thisReview.id, this.state.title, this.state.content,
        )
            .then(
                () => {
                    this.props.history.push(`/papers/${this.props.thisPaper.id}/${this.props.thisReview.id}`);
                },
            );
    }

    render() {
        return (
            <div className="review-edit">
                <Header />
                <SideBar />
                <Form.Group controlId="formReviewTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control name="title" className="title-input" type="text" placeholder={this.props.thisReview.title} bsPrefix="title-input" value={this.state.title} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group controlId="formReviewContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control name="content" className="content-input" rows="7" type="text" placeholder={this.props.thisReview.content} onChange={this.handleChange} />
                </Form.Group>
                <Button className="search-button" href="/">Edit</Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    // currentUserId: state.auth.currentUserId,
    thisPaper: state.paper.selected.paper,
    thisReview: state.review.selected.review,
});

const mapDispatchToProps = (dispatch) => ({
    onSetReviewContent: (review, title, content) => dispatch(
        actionCreators.setReviewContent(review, title, content),
    ),
});

ReviewEdit.propTypes = {
    thisPaper: PropTypes.shape({
        id: PropTypes.number,
        authors: PropTypes.string,
        title: PropTypes.string,
        publication: PropTypes.string,
        abstract: PropTypes.string,
        likesCount: PropTypes.number,
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
    history: PropTypes.instanceOf(Route).isRequired,
};

ReviewEdit.defaultProps = {
    thisPaper: {},
    thisReview: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewEdit);
