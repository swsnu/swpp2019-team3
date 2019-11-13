import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Form, Button, Card,
} from "react-bootstrap";
import { reviewActions, authActions } from "../../../store/actions";
import { reviewStatus, getMeStatus } from "../../../constants/constants";
import { Reply } from "../../../components";
import "./ReviewDetail.css";
import SVG from "../../../components/svg";

class ReviewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thisReview: {
                liked: false,
            },
            replies: [],
            replyCount: 0,
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
    }

    componentDidMount() {
        this.props.onGetMe()
            .then(() => {
                if (this.props.me.getMeStatus === getMeStatus.SUCCESS) {
                    this.setState({
                        user: this.props.me.me,
                    });
                } else {
                    this.history.push("/");
                }
            }).catch(() => {
            });

        this.props.onGetReview({ id: this.props.match.params.review_id })
            .then(() => {
                if (this.props.selectedReview.status === reviewStatus.SUCCESS) {
                    this.setState({
                        thisReview: this.props.selectedReview.review,
                        likeCount: this.props.selectedReview.review.count.likes,
                        author: this.props.selectedReview.review.user,
                        paperId: this.props.selectedReview.review.paper.id,
                    });
                } else {
                    this.props.history.push("/main");
                }
            }).catch(() => {});
    }

    handleChange(e) {
        this.setState({
            newReply: e.target.value,
        });
    }

    clickLikeButtonHandler() {
        const nextState = {
            thisReview: {
                ...this.state.thisReview,
                liked: true,
            },
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    clickUnlikeButtonHandler() {
        const nextState = {
            thisReview: {
                ...this.state.thisReview,
                liked: false,
            },
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    clickEditButtonHandler() {
        this.props.history.push(`/review_id=${this.state.thisReview.id}/edit`);
    }

    clickDeleteButtonHandler() {
        this.props.onDeleteReview({ id: this.state.thisReview.id })
            .then(() => {
                this.props.history.push(`/paper_id=${this.state.paperId}`);
            });
    }

    clickReplyAddButtonHandler() {
        const nextState = ({
            thisReview: {
                ...this.state.thisReview,
            },
            replyCount: this.state.replyCount + 1,
        });
        this.setState(nextState);
    }

    render() {
        const replies = this.state.replies.map((reply) => (
            <Reply
              key={reply.id}
              id={reply.id}
              author={reply.author}
              content={reply.content}
              authorId={reply.authorId}
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
                                    <Button className="like-button" variant="light" onClick={this.state.thisReview.liked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}><div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>{this.state.likeCount}</Button>
                                    <Button className="replyCount-button" variant="light"><div className="reply-image"><SVG name="zoom" height="60%" width="60%" /></div>{this.state.replyCount}</Button>
                                    {this.state.author.id === this.state.user.id
                                        ? <Button className="edit-button" onClick={this.clickEditButtonHandler}>Edit</Button>

                                        : null}
                                    {this.state.author.id === this.state.user.id ? (
                                        <Button className="delete-button" onClick={this.clickDeleteButtonHandler}>Delete</Button>
                                    ) : null}
                                </div>
                                <Form className="new-reply">
                                    <Form.Label className="username">{this.state.user.username}</Form.Label>
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
    selectedReview: state.review.selected,
    me: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    onGetReview: (reviewId) => dispatch(reviewActions.getReview(reviewId)),
    onGetMe: () => dispatch(authActions.getMe()),
    onDeleteReview: (reviewId) => dispatch(reviewActions.deleteReview(reviewId)),
});

ReviewDetail.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    selectedReview: PropTypes.objectOf(PropTypes.any),
    onGetReview: PropTypes.func,
    me: PropTypes.objectOf(PropTypes.any),
    onGetMe: PropTypes.func,
    onDeleteReview: PropTypes.func,
};

ReviewDetail.defaultProps = {
    history: null,
    match: null,
    selectedReview: {},
    onGetReview: () => {},
    me: {},
    onGetMe: () => {},
    onDeleteReview: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);
