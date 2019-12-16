import React, { Component } from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reviewActions } from "../../../store/actions";
import "./ReviewCard.css";
import { LikeButton, SubItemButton } from "../../Button/index";

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
        if (this.props.headerExists && this.props.subscription) {
            const actorLink = (<a className="actorLink" href={`/profile_id=${this.props.actor.id}`}>{this.props.actor.username}</a>);
            if (Object.keys(this.props.target).length !== 0) {
                header = (
                    <Card.Header id="headerReviewSubscriptionTarget">
                        <span className="CardHeaderText">
                            {actorLink}
                            {` ${this.props.verb} this review on `}
                            <a className="targetLink" href={`/paper_id=${this.props.target.id}`}>{`${this.props.target.title}`}</a>
                        </span>
                    </Card.Header>
                );
            } else {
                header = (
                    <Card.Header id="headerReviewSubscription">
                        <span className="CardHeaderText">
                            {actorLink}
                            {` ${this.props.verb} this review`}
                        </span>
                    </Card.Header>
                );
            }
        } else if (this.props.recommendation) {
            header = (
                <Card.Header id="headerReviewSubscriptionTarget">
                    <span className="CardHeaderText">
                        {` ${this.props.verb} on`}
                        <a className="targetLink" href={`/paper_id=${this.props.target.id}`}>{`${this.props.target.title}`}</a>
                    </span>
                </Card.Header>
            );
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
                            {this.props.me && this.props.author_id !== this.props.me.id && this.props.anonymous ? "Anonymous User"
                                : (<Card.Link href={`/profile_id=${this.props.author_id}`} className="text">{this.props.author}</Card.Link>)}
                        </div>
                    </Card.Body>
                    <Card.Footer className="footer">
                        <LikeButton
                          id="likeButton"
                          isLiked={this.state.isLiked}
                          likeFn={this.clickReviewCardLikeHandler}
                          unlikeFn={this.clickReviewCardUnlikeHandler}
                          likeCount={this.state.likeCount}
                        />
                        <SubItemButton
                          id="replyButton"
                          click={() => this.props.history.push({ pathname: `/review_id=${this.props.id}`, state: "reply" })}
                          count={this.props.replyCount}
                          tab
                        />
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReviewCard));

ReviewCard.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    author: PropTypes.string,
    author_id: PropTypes.number,
    id: PropTypes.number,
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
    subscription: PropTypes.bool,
    actor: PropTypes.objectOf(PropTypes.any),
    verb: PropTypes.string,
    target: PropTypes.objectOf(PropTypes.any),
    recommendation: PropTypes.bool,
    anonymous: PropTypes.bool,
    history: PropTypes.objectOf(PropTypes.any),
};

ReviewCard.defaultProps = {
    me: null,
    history: null,
    author: "",
    author_id: 0,
    id: 0,
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
    subscription: false,
    actor: {},
    verb: "",
    target: {},
    recommendation: false,
    anonymous: false,
};
