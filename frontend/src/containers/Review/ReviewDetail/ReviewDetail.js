import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Form, Button, Card, Image,
} from "react-bootstrap";

import {
    Reply,
} from "../../../components";
import "./ReviewDetail.css";
import heart from "../../../components/heart.png";
import talk from "../../../components/talk.png";

class ReviewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorId: 1,
            paperId: 4,
            id: 2,
            title: "What computer-lovers should read",
            content: "I think everyone should read this paper. I could learn so many things from this.",
            author: "Alpha",
            likeCount: 14,
            newReply: "",
            isLiked: false,
            replies: [{
                id: 1,
                authorId: 0,
                author: "Girin",
                review: 2,
                likeCount: 7,
                isLiked: false,
                content: "You are right!",
            },
            {
                id: 2,
                authorId: 4,
                author: "Goyangineun Yaong",
                review: 2,
                likeCount: 4,
                isLiked: true,
                content: "Interesting! I want to follow you",
            }],
            replyCount: 2,
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
                        <Card.Body>
                            <div className="review">
                                <Card.Text className="author">{this.state.author}</Card.Text>
                                <Card.Title className="title">{this.state.title}</Card.Title>
                                <Card.Text className="content">{this.state.content}</Card.Text>
                            </div>
                            <div className="reply">
                                <div className="review-extra">
                                    <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}><Image src={heart} width={20} height={20} className="heart-image" />{this.state.likeCount}</Button>
                                    <Button className="replyCount-button" variant="light"><Image src={talk} width={20} height={20} className="talk-image" />{this.state.replyCount}</Button>
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

ReviewDetail.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),

};

ReviewDetail.defaultProps = {
    history: null,
};

export default ReviewDetail;
