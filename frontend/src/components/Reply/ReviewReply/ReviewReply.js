import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import { Modal, FormControl, Button } from "react-bootstrap";
// import * as actionCreators from "../../../store/actions/index";

import "./ReviewReply.css";

class ReviewReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            tempContent: "",
            isLiked: this.props.isLiked,
            likesCount: this.props.likesCount,
            // content: this.props.content,
            // isLiked: this.props.isLiked,
            // likesCount: this.props.likesCount,
            isModalOpen: false,
            isExisting: true,
        };
        this.clickReplyEditButtonHandler = this.clickReplyEditButtonHandler.bind(this);
        this.clickReplyDeleteButtonHandler = this.clickReplyDeleteButtonHandler.bind(this);
        this.clickReplyLikeButtonHandler = this.clickReplyLikeButtonHandler.bind(this);
        this.clickReplyUnlikeBUttonHandler = this.clickReplyUnlikeBUttonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clickConfirmButtonHandler = this.clickConfirmButtonHandler.bind(this);
        this.clickCloseButtonHandler = this.clickCloseButtonHandler.bind(this);
    }

    clickReplyEditButtonHandler() {
        this.setState({
            isModalOpen: true,
        });
    }

    clickReplyDeleteButtonHandler() {
        // return this.props.onDeleteReply(this.props.id);
        this.setState({
            isExisting: false,
        });
    }

    clickReplyLikeButtonHandler() {
        // return this.props.onAddReplyLike(this.props.id, 0);
        const nextState = {
            isLiked: true,
            likesCount: this.state.likesCount + 1,
        };
        this.setState(nextState);
    }

    clickReplyUnlikeBUttonHandler() {
        // return this.props.onRemoveReplyLike(this.props.id, 0);
        const nextState = {
            isLiked: true,
            likesCount: this.state.likesCount + 1,
        };
        this.setState(nextState);
    }

    handleChange(e) {
        this.setState({
            tempContent: e.target.value,
        });
    }

    clickConfirmButtonHandler() {
        /* return this.props.onSetReplyContent(this.props.id, this.state.content)
            .then(() => {
                this.handleCloseModal();
            }); */
        const nextState = {
            content: this.state.tempContent,
            tempContent: "",
        };
        this.setState(nextState);
        this.handleCloseModal();
    }

    clickCloseButtonHandler() {
        const nextState = {
            tempContent: "",
        };
        this.setState(nextState);
        this.handleCloseModal();
    }

    render() {
        return (
            <div className="review-reply-component">
                { this.state.isExisting
                    ? (
                        <div className="reply">
                            <div className="author">{this.props.author}</div>
                            <div className="content">{this.props.content}</div>
                            <div className="buttons">
                                <Button className="like-button" onClick={this.state.isLiked ? this.clickReplyUnlikeBUttonHandler : this.clickReplyLikeButtonHandler}>{this.state.likeCount}</Button>
                                {this.props.authorId === 0
                                    ? <Button className="edit-button" onClick={this.clickReplyEditButtonHandler}>Edit</Button> : null }
                                {this.props.authorId === 0
                                    ? <Button className="delete-button" onClick={this.clickReplyDeleteButtonHandler}>Delete</Button> : null }
                            </div>
                        </div>
                    ) : null }
                { this.state.isExisting
                    ? (
                        <div className="edit-modal">
                            <Modal show={this.state.isModalOpen} onHide={() => this.clickCloseButtonHandler || this.clickConfirmButtonHandler} className="edit-modal" centered>
                                <Modal.Header>Edit Reply</Modal.Header>
                                <Modal.Body>
                                    <FormControl
                                      className="edit-input"
                                      type="text"
                                      placeholder={this.state.content}
                                      bsPrefix="edit-input"
                                      value={this.state.tempContent}
                                      onChange={this.handleChange}
                                    />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={this.clickConfirmButtonHandler}>
                                        Confirm
                                    </Button>
                                    <Button onClick={this.clickCloseButtonHandler}>Cancel</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    )
                    : null }
            </div>
        );
    }
}

/*
const mapStateToProps = (state) => ({
    // currentUserId: state.auth.currentUserId,
    thisReview: state.review.selected.review,
    // thisPaper: state.paper.selected.paper,
    isLiked: state.reviewReply.selected.isLiked,
    likesCount: state.reviewReply.selected.likeCount,
});

const mapDispatchToProps = (dispatch) => ({
    onSetReplyContent: (reply, content) => dispatch(
        actionCreators.setReplyContent(reply, content),
    ),
    onDeleteReply: (reply) => dispatch(
        actionCreators.deleteReply(reply),
    ),
    onAddReplyLike: (reply, user) => dispatch(
        actionCreators.addReplyLike(reply, user),
    ),
    onRemoveReplyLike: (reply, user) => dispatch(
        actionCreators.removeReplyLike(reply, user),
    ),
    onGetReplyLikesCount: (reply) => dispatch(
        actionCreators.getReplyLikesCount(reply),
    ),
    onGetReplyIsLiked: (reply, user) => dispatch(
        actionCreators.getReplyIsLiked(reply, user),
    ),
}); */

ReviewReply.propTypes = {
    /* thisPaper: PropTypes.shape({
        id: PropTypes.number,
        authors: PropTypes.string,
        title: PropTypes.string,
        publication: PropTypes.string,
        abstract: PropTypes.string,
        likesCount: PropTypes.number,
        isLiked: PropTypes.bool,
        date_created: PropTypes.string,
    }),
    thisReview: PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.number,
        paper: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
    }), */
    content: PropTypes.string,
    // id: PropTypes.number,
    author: PropTypes.string,
    authorId: PropTypes.number,
    isLiked: PropTypes.bool,
    likesCount: PropTypes.number,
    /* onSetReplyContent: PropTypes.func,
    onDeleteReply: PropTypes.func,
    onAddReplyLike: PropTypes.func,
    onRemoveReplyLike: PropTypes.func,
    onGetReplyLikesCount: PropTypes.func,
    onGetReplyIsLiked: PropTypes.func, */
};

ReviewReply.defaultProps = {
    // id: 0,
    content: "",
    author: "",
    authorId: 0,
    isLiked: false,
    likesCount: 0,
    /* thisPaper: {},
    thisReview: {},
    onSetReplyContent: () => {},
    onDeleteReply: () => {},
    onAddReplyLike: () => {},
    onRemoveReplyLike: () => {},
    onGetReplyLikesCount: () => {},
    onGetReplyIsLiked: () => {}, */
};

export default ReviewReply;
// export default connect(mapStateToProps, mapDispatchToProps)(ReviewReply);
