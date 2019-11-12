import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Form, Button, Card,
} from "react-bootstrap";
import { reviewActions } from "../../../store/actions";
import { reviewStatus } from "../../../constants/constants";
import { Reply } from "../../../components";
import "./ReviewDetail.css";
import SVG from "../../../components/svg";

class ReviewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thisReview: {},
            replies: [],
        };

        this.clickLikeButtonHandler = this.clickLikeButtonHandler.bind(this);
        this.clickUnlikeButtonHandler = this.clickUnlikeButtonHandler.bind(this);
        this.clickEditButtonHandler = this.clickEditButtonHandler.bind(this);
        this.clickDeleteButtonHandler = this.clickDeleteButtonHandler.bind(this);
        this.clickReplyAddButtonHandler = this.clickReplyAddButtonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

    }

    handleChange(e) {
        this.setState({
            newReply: e.target.value,
        });
    }

    clickLikeButtonHandler() {
        const nextState = {
            isLiked: true,
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    clickUnlikeButtonHandler() {
        const nextState = {
            isLiked: false,
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    clickEditButtonHandler() {
        this.props.history.push(`/review_id=${this.state.id}/edit`);
    }

    clickDeleteButtonHandler() {
        this.props.history.push(`/paper_id=${this.state.paperId}`);
    }

    clickReplyAddButtonHandler() {
        const nextState = ({
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
                                <Card.Text className="author">{this.state.author}</Card.Text>
                                <Card.Title className="title">{this.state.title}</Card.Title>
                                <Card.Text className="content">{this.state.content}</Card.Text>
                            </div>
                            <div className="reply">
                                <div className="review-extra">
                                    <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}><div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>{this.state.likeCount}</Button>
                                    <Button className="replyCount-button" variant="light"><div className="reply-image"><SVG name="zoom" height="60%" width="60%" /></div>{this.state.replyCount}</Button>
                                    {this.state.authorId === 0
                                        ? <Button className="edit-button" onClick={this.clickEditButtonHandler}>Edit</Button>

                                        : null}
                                    {this.state.authorId === 0 ? (
                                        <Button className="delete-button" onClick={this.clickDeleteButtonHandler}>Delete</Button>
                                    ) : null}
                                </div>
                                <Form className="new-reply">
                                    <Form.Label className="username">Girin </Form.Label>
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
});

const mapDispatchToProps = (dispatch) => ({
    onGetReview: (reviewId) => dispatch(reviewActions.getReview(reviewId)),
});

ReviewDetail.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    selectedReview: PropTypes.objectOf(PropTypes.any),
    onGetReview: PropTypes.func,
};

ReviewDetail.defaultProps = {
    history: null,
    selectedReview: {},
    onGetReview: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);
