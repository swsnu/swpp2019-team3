import React, { Component } from "react";
import { Card, Button, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import "./ReviewCard.css";
import heart from "../../heart.png";
import talk from "../../talk.png";

class ReviewCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
        };
        this.clickReviewCardUnlikeHandler = this.clickReviewCardUnlikeHandler.bind(this);
        this.clickReviewCardLikeHandler = this.clickReviewCardLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickReviewCardLikeHandler() {
        const nextState = {
            isLiked: true,
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    // handle click 'Unlike' button
    clickReviewCardUnlikeHandler() {
        const nextState = {
            isLiked: false,
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    render() {
        let header = null;
        if (this.props.headerExists) {
            header = <Card.Header className="header">{`${this.props.user} ${this.props.source} this review`}</Card.Header>;
        }

        return (
            <div className="wrapper">
                <Card className="review">
                    {header}
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link href={`/review_id=${this.props.id}`} className="text">{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>{this.props.date}</Card.Text>
                        <Card.Text>{this.props.author}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="footer">
                        <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickReviewCardUnlikeHandler : this.clickReviewCardLikeHandler}> <Image src={heart} width={20} height={20} className="heart-image" />{this.state.likeCount}</Button>
                        <Button className="reply-button" variant="light" href={`/review_id=${this.props.id}`}><Image src={talk} width={20} height={20} className="talk-image" />{this.props.replyCount}</Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

ReviewCard.propTypes = {
    author: PropTypes.string,
    source: PropTypes.string,
    id: PropTypes.number,
    user: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    likeCount: PropTypes.number,
    replyCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
};

ReviewCard.defaultProps = {
    author: "",
    source: "",
    id: 0,
    user: "",
    title: "",
    date: "",
    likeCount: 0,
    isLiked: false,
    replyCount: 0,
    headerExists: true,
};

export default ReviewCard;
