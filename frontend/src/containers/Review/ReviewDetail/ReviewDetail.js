/* eslint-disable no-await-in-loop */
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
            thisReview: {
            },
            replies: [],
            isLiked: false,
            likeCount: 0,
            author: {
                id: 0,
                username: "",
            },
            newReply: "",
            paperId: 0,
            creationDate: "",
            modificationDate: "",
            newReplies: [],
            replyPageCount: 1,
            replyFinished: true,
        };

        this.initReviewDetail = this.initReviewDetail.bind(this);
        this.clickLikeButtonHandler = this.clickLikeButtonHandler.bind(this);
        this.clickUnlikeButtonHandler = this.clickUnlikeButtonHandler.bind(this);
        this.clickEditButtonHandler = this.clickEditButtonHandler.bind(this);
        this.clickDeleteButtonHandler = this.clickDeleteButtonHandler.bind(this);
        this.clickReplyAddButtonHandler = this.clickReplyAddButtonHandler.bind(this);
        this.clickMoreButtonHandler = this.clickMoreButtonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleReplies = this.handleReplies.bind(this);
    }

    componentDidMount() {
        this.initReviewDetail();
    }

    /* eslint-disable react/no-did-update-set-state */
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({
                newReply: "",
                replies: [],
                newReplies: [],
            });
            this.initReviewDetail();
        }
    }
    /* eslint-enable react/no-did-update-set-state */

    clickMoreButtonHandler = () => {
        this.props.onGetReplies({
            id: Number(this.props.match.params.review_id),
            page_number: this.state.replyPageCount + 1,
        })
            .then(() => {
                const { replies } = this.state;
                this.setState({
                    replies: replies.concat(this.props.replyList.list),
                    replyPageCount: this.props.replyList.pageNum,
                    replyFinished: this.props.replyList.finished,
                });
            });
    }

    async handleReplies() {
        // get replies utile previous pageCount
        const end = this.state.replyPageCount;
        this.setState({
            newReplies: [],
        });
        for (let i = 1; (i === 1) || (i < end + 1); i += 1) {
            await this.forEachHandleReply(i, end);
            if (i === end || this.props.replyList.finished === true) {
                this.setState((prevState) => ({
                    replies: prevState.newReplies.concat(this.props.replyList.list),
                    replyPageCount: this.props.replyList.pageNum,
                    newReplies: [],
                    replyFinished: this.props.replyList.finished,
                }));
                break;
            }
            this.setState((prevState) => ({
                newReplies: prevState.newReplies.concat(this.props.replyList.list),
            }));
        }
    }

    forEachHandleReply(i) {
        return this.props.onGetReplies({
            id: Number(this.props.match.params.review_id),
            page_number: Number(i),
        });
    }

    initReviewDetail() {
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
                    creationDate: `${this.props.selectedReview.creation_date.split("T")[0]} ${this.props.selectedReview.creation_date.split("T")[1].substring(0, 5)}`,
                    modificationDate: `${this.props.selectedReview.modification_date.split("T")[0]} ${this.props.selectedReview.modification_date.split("T")[1].substring(0, 5)}`,
                });
            }).catch(() => {});

        this.props.onGetReplies({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({
                    replies: this.props.replyList.list,
                    replyPageCount: 1,
                    replyFinished: this.props.replyList.finished,
                });
            }).catch(() => {});
    }

    // handle click 'Like' button
    clickLikeButtonHandler() {
        this.props.onLikeReview({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({
                    likeCount: this.props.afterLikeCount,
                    isLiked: true,
                });
            });
    }

    // handle click 'Unlike' button
    clickUnlikeButtonHandler() {
        this.props.onUnlikeReview({ id: Number(this.props.match.params.review_id) })
            .then(() => {
                this.setState({
                    likeCount: this.props.afterUnlikeCount,
                    isLiked: false,
                });
            });
    }

    clickReplyAddButtonHandler() {
        this.props.onMakeNewReply({ id: this.state.thisReview.id, text: this.state.newReply })
            .then(() => {
                this.setState({
                    newReply: "",
                });
                this.handleReplies();
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

    handleChange(e) {
        this.setState({
            newReply: e.target.value,
        });
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
              date={reply.modification_date}
              type="review"
            />
        ));
        const replyCount = (this.state.replyPageCount > 1
            || (this.state.replyPageCount === 1 && this.state.replyFinished === false))
            ? "10+" : this.state.replies.length;
        return (
            <div className="review-detail">
                <div className="board">
                    <Card className="review-reply">
                        <div className="head">REVIEW</div>
                        <Card.Body>
                            <div className="review">
                                <div className="author">
                                    {this.props.me && this.props.selectedReview.is_anonymous && this.state.author.id !== this.props.me.id ? "Anonymous User"
                                        : (<Card.Link href={`/profile_id=${this.state.author.id}`} className="text">{this.state.author.username}</Card.Link>)}
                                </div>
                                <div id="date">
                                    <div id="creationDate">Created: {this.state.creationDate}</div>
                                    <div id="lastUpdateDate">Last Updated: {this.state.modificationDate}</div>
                                </div>
                                <Card.Title className="title">{this.state.thisReview.title}</Card.Title>
                                <Card.Text className="content">{this.state.thisReview.text}</Card.Text>
                            </div>
                            <div className="reply">
                                <div className="review-extra">
                                    <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}><div className="heart-image"><SVG name="heart" height="25px" width="25px" /></div>{this.state.likeCount}</Button>
                                    <Button className="replyCount-button" variant="light"><div className="reply-image"><SVG name="zoom" height="25px" width="25px" /></div>{replyCount}</Button>
                                    {this.props.me && this.state.author.id === this.props.me.id
                                        ? <Button className="edit-button" variant="outline-info" onClick={this.clickEditButtonHandler}>Edit</Button>

                                        : null}
                                    {this.props.me && this.state.author.id === this.props.me.id ? (
                                        <Button className="delete-button" variant="outline-secondary" onClick={this.clickDeleteButtonHandler}>Delete</Button>
                                    ) : null}
                                    <Button className="paper-button" variant="secondary" href={`/paper_id=${this.state.paperId}`}>Paper</Button>
                                </div>
                                <Form className="new-reply">
                                    <Form.Label className="username">{this.props.me.username}</Form.Label>
                                    <Form.Control className="reply-input" as="textarea" bsPrefix="reply-input" value={this.state.newReply} onChange={this.handleChange} />
                                    <Button className="new-reply-button" variant="info" onClick={this.clickReplyAddButtonHandler} disabled={this.state.newReply.length === 0}>Add</Button>
                                </Form>
                                <div className="replies">
                                    {replies}
                                    { this.state.replyFinished ? null
                                        : (
                                            <Button
                                              className="reply-more-button"
                                              onClick={this.clickMoreButtonHandler}
                                              size="lg"
                                              block
                                            >
                View More
                                            </Button>
                                        ) }
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
    location: PropTypes.objectOf(PropTypes.any),
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
    location: null,
    history: null,
    match: null,
    selectedReviewStatus: reviewStatus.NONE,
    selectedReview: { creation_date: "", modification_date: "" },
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
