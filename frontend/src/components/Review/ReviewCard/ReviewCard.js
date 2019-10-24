import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import "./ReviewCard.css";

class ReviewCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            numLikes: 0,
        };
        this.clickReviewCardUnlikeHandler = this.clickReviewCardUnlikeHandler.bind(this);
        this.clickReviewCardLikeHandler = this.clickReviewCardLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickReviewCardLikeHandler() {
        const nextState = {
            isLiked: true,
            numLikes: this.state.numLikes + 1,
        };
        this.setState(nextState);
    }

    // handle click 'Unlike' button
    clickReviewCardUnlikeHandler() {
        const nextState = {
            isLiked: false,
            numLikes: this.state.numLikes - 1,
        };
        this.setState(nextState);
    }

    render() {
        return (
            <div className="wrapper">
                <Card className="review">
                    <Card.Header>{`${this.props.user} ${this.props.source} this review`}</Card.Header>
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link href={`/paper/${this.props.id}`} className="text">{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>{this.props.date}</Card.Text>
                        <Card.Text>{this.props.author}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button className="like-button" onClick={this.state.isLiked ? this.clickReviewCardUnlikeHandler : this.clickReviewCardLikeHandler}>{this.state.numLikes}</Button>
                        <Button href={`/papers/${this.props.paperId}/${this.props.id}`}>{this.props.numReplies}</Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

ReviewCard.propTypes = {
    author: PropTypes.string,
    paperId: PropTypes.number,
    source: PropTypes.string,
    id: PropTypes.number,
    user: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    numReplies: PropTypes.number,
};

ReviewCard.defaultProps = {
    author: "",
    paperId: 0,
    source: "",
    id: 0,
    user: "",
    title: "",
    date: "",
    numReplies: 0,
};

export default ReviewCard;
