import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, FormControl } from "react-bootstrap";
import * as actionCreators from "../../../store/actions/index";

import "./ReviewReply.css";

function EditModal(props) {
    return (
        <div className="edit-modal">
            {true ? (
                <Modal className="edit-modal" centered>
                    <Modal.Header>Edit Reply</Modal.Header>
                    <Modal.Body>
                        <FormControl className="edit-input" type="text" placeholder={props.content} bsPrefix="edit-input" value={props.content} onChange={props.onChange} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={props.onConfirm}>Confirm</Button>
                        <Button onClick={props.onCancel}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            ) : null }
        </div>
    );
}

class ReviewReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            isLiked: this.props.isLiked,
            likesCount: this.props.likesCount,
            isModalOpen: true,
        };
        this.clickReplyEditButtonHandler = this.clickReplyEditButtonHandler.bind(this);
        this.clickReplyDeleteButtonHandler = this.clickReplyDeleteButtonHandler.bind(this);
        this.clickReplyLikeButtonHandler = this.clickReplyLikeButtonHandler.bind(this);
        this.clickReplyUnlikeBUttonHandler = this.clickReplyUnlikeBUttonHandler.bind(this);
    }

    clickReplyEditButtonHandler() {
        this.setState({
            isModalOpen: true,
        });
    }

    clickReplyDeleteButtonHandler() {
        return this.props.onDeleteReply(this.props.id);
    }

    clickReplyLikeButtonHandler() {
        return this.props.onAddReplyLike(this.props.id, 0);
    }

    clickReplyUnlikeBUttonHandler() {
        return this.props.onRemoveReplyLike(this.props.id, 0);
    }

    handleChange(e) {
        this.setState({
            content: e.target.value,
        });
    }

    clickConfirmButtonHandler() {
        return this.props.onSetReplyContent(this.props.id, this.state.content)
            .then(
                () => {
                    this.setState({
                        isModalOpen: false,
                    });
                },
            );
    }

    clickCancelButtonHandler() {
        this.setState({
            content: this.props.content,
            isModalOpen: false,
        });
    }


    render() {
        return (
            <div className="review-reply-component">
                <div className="reply">
                    <div className="author">{this.props.author}</div>
                    <div className="content">{this.props.content}</div>
                    <div className="buttons">
                        <Button className="like-button" onClick={this.state.isLiked ? this.clickReplyUnlikeBUttonHandler : this.clickReplyLikeButtonHandler}>{this.state.likesCount}</Button>
                        {this.props.authorId === 0
                            ? <Button className="edit-button" onClick={this.clickReplyEditButtonHandler}>Edit</Button> : null }
                        {this.props.authorId === 0
                            ? <Button className="delete-button" onClick={this.clickReplyDeleteButtonHandler}>Delete</Button> : null }
                    </div>
                </div>
                <EditModal
                  isOpen={this.state.isModalOpen}
                  content={this.state.content}
                  onChange={this.handleChange}
                  onConfirm={this.clickConfirmButtonHandler}
                  onCancel={this.clickCancelButtonHandler}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    // currentUserId: state.auth.currentUserId,
    thisReview: state.review.selected.review,
    // thisPaper: state.paper.selected.paper,
    isLiked: state.reviewReply.selected.isLiked,
    likesCount: state.reviewReply.selected.likesCount,
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
});

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
    }), */
    thisReview: PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.number,
        paper: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
    content: PropTypes.string,
    id: PropTypes.number,
    author: PropTypes.string,
    authorId: PropTypes.number,
    isLiked: PropTypes.bool,
    likesCount: PropTypes.number,
    onSetReplyContent: PropTypes.func,
    onDeleteReply: PropTypes.func,
    onAddReplyLike: PropTypes.func,
    onRemoveReplyLike: PropTypes.func,
    onGetReplyLikesCount: PropTypes.func,
    onGetReplyIsLiked: PropTypes.func,
};

ReviewReply.defaultProps = {
    content: "",
    id: 0,
    author: "",
    authorId: 0,
    isLiked: false,
    likesCount: 0,
    // thisPaper: {},
    thisReview: {},
    onSetReplyContent: () => {},
    onDeleteReply: () => {},
    onAddReplyLike: () => {},
    onRemoveReplyLike: () => {},
    onGetReplyLikesCount: () => {},
    onGetReplyIsLiked: () => {},
};

EditModal.propTypes = {
    content: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    isOpen: PropTypes.bool,
};

EditModal.defaultProps = {
    content: "",
    onConfirm: () => {},
    onCancel: () => {},
    onChange: () => {},
    isOpen: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewReply);
