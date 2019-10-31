import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button, Card } from "react-bootstrap";
import { Route } from "react-router-dom";

import {
    SideBar, Header, ReviewReply,
} from "../../../components";
import * as actionCreators from "../../../store/actions/index";
import "./ReviewDetail.css";

class ReviewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newReply: "",
            isLiked: false,
            likesCount: 0,
            replies: this.props.thisReplies,
            repliesCount: this.props.thisReplies.length,
        };
        this.clickLikeButtonHandler = this.clickLikeButtonHandler.bind(this);
        this.clickUnlikeButtonHandler = this.clickUnlikeButtonHandler.bind(this);
        this.clickEditButtonHandler = this.clickEditButtonHandler.bind(this);
        this.clickDeleteButtonHandler = this.clickDeleteButtonHandler.bind(this);
        this.clickReplyAddButtonHandler = this.clickReplyAddButtonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            newReply: e.target.value,
        });
    }

    clickLikeButtonHandler() {
        const nextState = {
            isLiked: true,
            likesCount: this.state.likesCount + 1,
        };
        this.setState(nextState);
    }

    clickUnlikeButtonHandler() {
        const nextState = {
            isLiked: false,
            likesCount: this.state.likesCount - 1,
        };
        this.setState(nextState);
    }

    // -1 for paper id
    clickEditButtonHandler() {
        this.props.history.push(`papers/-1/${this.props.thisReview.id}/edit`);
    }

    clickDeleteButtonHandler() {
        return this.props.onDeleteReview(this.props.thisReview.id).then(
            () => {
                this.props.history.push("papers/-1");
            },
        );
    }

    // 0 is for current User Id, -1 for paper id
    clickReplyAddButtonHandler() {
        return this.props.onMakeNewReply(
            this.props.thisReview.id, -1, 0,
        )
            .then(
                () => {
                    this.props.onGetReplies(this.props.thisReview.id);
                    this.setState({
                        replies: this.props.thisReplies,
                        repliesCount: this.props.thisReplies.length,
                    });
                },
            );
    }

    render() {
        const replies = this.state.replies.map((reply) => (
            <ReviewReply
              key={reply.id}
              id={reply.id}
              author={reply.author}
              content={reply.content}
              authorId={reply.authorId}
            />
        ));

        return (
            <div className="review-detail">
                <Header />
                <SideBar />
                <div className="board">
                    <Card className="review-reply">
                        <Card.Body>
                            <div className="review">
                                <Card.Text className="author">{this.props.thisReview.author}</Card.Text>
                                <Card.Title className="title">{this.props.thisReview.title}</Card.Title>
                                <Card.Text calssName="content">{this.props.thisReview.content}</Card.Text>
                            </div>
                            <div className="reply">
                                <div className="review-extra">
                                    <Button className="like-button" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}>{this.state.likesCount}</Button>
                                    <Button className="replyCount-button" disabled>{this.state.repliesCount}</Button>
                                </div>
                                <Form className="new-reply">
                                    <Form.Label className="username">Username </Form.Label>
                                    <Form.Control className="reply-input" type="text" bsPrefix="reply-input" value={this.state.newReply} onChange={this.handleChange} />
                                    <Button className="new-reply-button" onClick={this.clickReplyAddButtonHandler}>Add</Button>
                                </Form>
                                <div className="replies">
                                    {replies}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    // currentUserId: state.auth.userInfo,
    thisReview: state.review.selected.review,
    // thisPaper: state.paper.selected.paper,
    thisReplies: state.review.selected.replies,
});

const mapDispatchToProps = (dispatch) => ({
    onGetReview: (review) => dispatch(
        actionCreators.getReview(review),
    ),
    onGetReplies: (review) => dispatch(
        actionCreators.getRepliesByReviewId(review),
    ),
    onGetReviewLikesCount: (review) => dispatch(
        actionCreators.getReviewLikesCount(review),
    ),
    onGetReviewIsLiked: (review, user) => dispatch(
        actionCreators.getReviewIsLiked(review, user),
    ),
    onAddReviewLike: (review, user) => dispatch(
        actionCreators.addReviewLike(review, user),
    ),
    onRemoveReviewLike: (review, user) => dispatch(
        actionCreators.removeReviewLike(review, user),
    ),
    onMakeNewReply: (review, user, content) => dispatch(
        actionCreators.makeNewReply(review, user, content),
    ),
    onDeleteReview: (review) => dispatch(
        actionCreators.deleteReview(review),
    ),
    onConsumeReview: (review, user) => dispatch(
        actionCreators.consumeReview(review, user),
    ),
});

ReviewDetail.propTypes = {
    // currentUserId: PropTypes.number,
    /* thisPaper: PropTypes.shape({
        id: PropTypes.number,
        authors: PropTypes.string,
        title: PropTypes.string,
        publication: PropTypes.string,
        abstract: PropTypes.string,
        likesCount: PropTypes.number,
        isLiked: PropTypes.bool,
        date_created: PropTypes.string,
    }), */
    thisReview: PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.number,
        paper: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
    thisReplies: PropTypes.shape([{
        id: PropTypes.number,
        authorId: PropTypes.number,
        author: PropTypes.string,
        review: PropTypes.number,
        content: PropTypes.string,
    }]),
    history: PropTypes.instanceOf(Route).isRequired,
    onGetReview: PropTypes.func,
    onGetReplies: PropTypes.func,
    onGetReviewLikesCount: PropTypes.func,
    onGetReviewIsLiked: PropTypes.func,
    onAddReviewLike: PropTypes.func,
    onRemoveReviewLike: PropTypes.func,
    onMakeNewReply: PropTypes.func,
    onDeleteReview: PropTypes.func,
    onConsumeReview: PropTypes.func,
};

ReviewDetail.defaultProps = {
    // currentUserId: 0,
    // thisPaper: {},
    thisReview: {},
    thisReplies: [],
    onGetReview: () => {},
    onGetReplies: () => {},
    onGetReviewLikesCount: () => {},
    onGetReviewIsLiked: () => {},
    onAddReviewLike: () => {},
    onRemoveReviewLike: () => {},
    onMakeNewReply: () => {},
    onDeleteReview: () => {},
    onConsumeReview: () => {},
};


export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);
