import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { reviewActions } from "../../../store/actions";
import "./ReviewCard.css";
import SVG from "../../svg";

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
        this.props.onLikeReview({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterLikeCount });
                this.setState({ isLiked: true });
            });
    }

    // handle click 'Unlike' button
    clickReviewCardUnlikeHandler() {
        this.props.onUnlikeReview({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterUnlikeCount });
                this.setState({ isLiked: false });
            });
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
                        <div className="author">
                            <Card.Link href={`/profile_id=${this.props.author_id}`} className="text">{this.props.author}</Card.Link>
                        </div>
                    </Card.Body>
                    <Card.Footer className="footer">
                        <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickReviewCardUnlikeHandler : this.clickReviewCardLikeHandler}> <div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>{this.state.likeCount}</Button>
                        <Button className="reply-button" variant="light" href={`/review_id=${this.props.id}`}><div className="reply-image"><SVG name="zoom" height="70%" width="70%" /></div>{this.props.replyCount}</Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    likeReviewStatus: state.review.like.status,
    afterLikeCount: state.review.like.count,
    unlikeReviewStatus: state.review.unlike.status,
    afterUnlikeCount: state.review.unlike.count,
});

const mapDispatchToProps = (dispatch) => ({
    onLikeReview: (reviewId) => dispatch(
        reviewActions.likeReview(reviewId),
    ),
    onUnlikeReview: (reviewId) => dispatch(
        reviewActions.unlikeReview(reviewId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewCard);

ReviewCard.propTypes = {
    author: PropTypes.string,
    author_id: PropTypes.number,
    source: PropTypes.string,
    id: PropTypes.number,
    user: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    likeCount: PropTypes.number,
    replyCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikeReview: PropTypes.func,
    onUnlikeReview: PropTypes.func,
};

ReviewCard.defaultProps = {
    author: "",
    author_id: 0,
    source: "",
    id: 0,
    user: "",
    title: "",
    date: "",
    likeCount: 0,
    isLiked: false,
    replyCount: 0,
    headerExists: true,
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikeReview: () => {},
    onUnlikeReview: () => {},
};
