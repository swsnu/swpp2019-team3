import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Form, Button, Card,
} from "react-bootstrap";
import { reviewActions, replyActions } from "../../../store/actions";
import { Reply } from "../../../components";
import "./ReviewDetail.css";
import SVG from "../../../components/svg";
import { reviewStatus } from "../../../constants/constants";

class ReviewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thisReview: {},
            replies: [],
            replyCount: 0,
            isLiked: false,
            likeCount: 0,
            author: {
                id: 0,
                username: "",
            },
            user: {
                id: 0,
                username: "",
            },
            newReply: "",
            paperId: 0,
        };

        this.clickLikeButtonHandler = this.clickLikeButtonHandler.bind(this);
        this.clickUnlikeButtonHandler = this.clickUnlikeButtonHandler.bind(this);
        this.clickEditButtonHandler = this.clickEditButtonHandler.bind(this);
        this.clickDeleteButtonHandler = this.clickDeleteButtonHandler.bind(this);
        this.clickReplyAddButtonHandler = this.clickReplyAddButtonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleReplies = this.handleReplies.bind(this);
    }

    componentDidMount() {
        this.props.onGetReview({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                if (this.props.selectedReviewStatus === reviewStatus.REVIEW_NOT_EXIST) {
                    this.props.history.push("/main");
                    return;
                }
                this.setState({
                    thisReview: this.props.selectedReview,
                    isLiked: this.props.selectedReview.liked,
                    likeCount: this.props.selectedReview.count.likes,
                    author: this.props.selectedReview.user,
                    paperId: this.props.selectedReview.paper.id,
                    newReply: "",
                });
            }).catch(() => {});

        this.props.onGetReplies({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({
                    replies: this.props.replyList.list,
                });
            }).catch(() => {});
    }

    handleChange(e) {
        this.setState({
            newReply: e.target.value,
        });
    }

    // handle click 'Like' button
    clickLikeButtonHandler() {
        this.props.onLikeReview({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({ likeCount: this.props.afterLikeCount });
                this.setState({ isLiked: true });
            });
    }

    // handle click 'Unlike' button
    clickUnlikeButtonHandler() {
        this.props.onUnlikeReview({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({ likeCount: this.props.afterUnlikeCount });
                this.setState({ isLiked: false });
            });
    }

    clickEditButtonHandler() {
        this.props.history.push(`/review_id=${this.state.thisReview.id}/edit`);
    }

    clickDeleteButtonHandler() {
        this.props.onDeleteReview({ id: this.state.thisReview.id })
            .then(() => {
                this.props.history.push(`/paper_id=${this.state.paperId}`);
            }).catch(() => {

            });
    }

    clickReplyAddButtonHandler() {
        this.props.onMakeNewReply({ id: this.state.thisReview.id, text: this.state.newReply })
            .then(() => {
                this.handleReplies();
                this.setState({
                    newReply: "",
                });
            });
    }

    handleReplies() {
        this.props.onGetReplies({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({
                    replies: this.props.replyList.list,
                });
            }).catch(() => {});
    }

    render() {
        const replies = this.state.replies.map((reply) => (
            <Reply
              key={reply.id}
              id={reply.id}
              author={reply.user.username}
              content={reply.text}
              authorId={reply.user.id}
              likeCount={reply.count.likes}
              isLiked={reply.liked}
              onChange={this.handleReplies}
              userId={this.props.me.id}
              type="review"
            />
        ));


        return (
            <div className="review-detail">
                <div className="board">
                    <Card className="review-reply">
                        <div className="head">REVIEW</div>
                        <Card.Body>
                            <div className="review">
                                <Card.Text className="author">{this.state.author.username}</Card.Text>
                                <Card.Title className="title">{this.state.thisReview.title}</Card.Title>
                                <Card.Text className="content">{this.state.thisReview.text}</Card.Text>
                            </div>
                            <div className="reply">
                                <div className="review-extra">
                                    <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}><div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>{this.state.likeCount}</Button>
                                    <Button className="replyCount-button" variant="light"><div className="reply-image"><SVG name="zoom" height="60%" width="60%" /></div>{this.state.replyCount}</Button>
                                    {this.props.me && this.state.author.id === this.props.me.id
                                        ? <Button className="edit-button" onClick={this.clickEditButtonHandler}>Edit</Button>

                                        : null}
                                    {this.props.me && this.state.author.id === this.props.me.id ? (
                                        <Button className="delete-button" onClick={this.clickDeleteButtonHandler}>Delete</Button>
                                    ) : null}
                                </div>
                                <Form className="new-reply">
                                    <Form.Label className="username">{this.state.user.username}</Form.Label>
                                    <Form.Control className="reply-input" type="text" bsPrefix="reply-input" value={this.state.newReply} onChange={this.handleChange} />
                                    <Button className="new-reply-button" onClick={this.clickReplyAddButtonHandler} disabled={this.state.newReply.length === 0}>Add</Button>
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
    me: state.auth.me,
    selectedReviewStatus: state.review.selected.status,
    selectedReview: state.review.selected.review,
    likeReviewStatus: state.review.like.status,
    afterLikeCount: state.review.like.count,
    unlikeReviewStatus: state.review.unlike.status,
    afterUnlikeCount: state.review.unlike.count,
    replyList: state.reply.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetReview: (reviewId) => dispatch(reviewActions.getReview(reviewId)),
    onDeleteReview: (reviewId) => dispatch(reviewActions.deleteReview(reviewId)),
    onLikeReview: (reviewId) => dispatch(
        reviewActions.likeReview(reviewId),
    ),
    onUnlikeReview: (reviewId) => dispatch(
        reviewActions.unlikeReview(reviewId),
    ),
    onGetReplies: (reviewId) => dispatch(
        replyActions.getRepliesByReview(reviewId),
    ),
    onMakeNewReply: (reply) => dispatch(
        replyActions.makeNewReplyReview(reply),
    ),
});

ReviewDetail.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    selectedReviewStatus: PropTypes.string,
    selectedReview: PropTypes.objectOf(PropTypes.any),
    onGetReview: PropTypes.func,
    onDeleteReview: PropTypes.func,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikeReview: PropTypes.func,
    onUnlikeReview: PropTypes.func,
    replyList: PropTypes.objectOf(PropTypes.any),
    onGetReplies: PropTypes.func,
    onMakeNewReply: PropTypes.func,
};

ReviewDetail.defaultProps = {
    me: null,
    history: null,
    match: null,
    selectedReviewStatus: reviewStatus.NONE,
    selectedReview: {},
    onGetReview: () => {},
    onDeleteReview: () => {},
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikeReview: () => {},
    onUnlikeReview: () => {},
    replyList: { list: {} },
    onGetReplies: () => {},
    onMakeNewReply: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);
