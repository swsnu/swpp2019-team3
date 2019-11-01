import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, FormControl, Button } from "react-bootstrap";

import "./ReviewReply.css";

class ReviewReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            tempContent: "",
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
            isModalOpen: false,
            isExisting: true, // for delete reply, it will be removed after redux work
        };
        this.clickReplyEditButtonHandler = this.clickReplyEditButtonHandler.bind(this);
        this.clickReplyDeleteButtonHandler = this.clickReplyDeleteButtonHandler.bind(this);
        this.clickReplyLikeButtonHandler = this.clickReplyLikeButtonHandler.bind(this);
        this.clickReplyUnlikeButtonHandler = this.clickReplyUnlikeButtonHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clickConfirmButtonHandler = this.clickConfirmButtonHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    clickReplyEditButtonHandler() {
        this.setState({
            isModalOpen: true,
        });
    }

    clickReplyDeleteButtonHandler() {
        this.setState({
            isExisting: false,
        });
    }

    clickReplyLikeButtonHandler() {
        const nextState = {
            isLiked: true,
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    clickReplyUnlikeButtonHandler() {
        const nextState = {
            isLiked: false,
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    // for Modal input change
    handleChange(e) {
        this.setState({
            tempContent: e.target.value,
        });
    }

    // for Modal
    clickConfirmButtonHandler() {
        const nextState = {
            content: this.state.tempContent,
            tempContent: "",
        };
        this.setState(nextState);
        this.handleClose();
    }

    // for Modal
    clickCancelButtonHandler() {
        const nextState = {
            tempContent: "",
        };
        this.setState(nextState);
        this.handleClose();
    }

    // for Modal/ onHide()
    handleClose() {
        this.setState({
            isModalOpen: false,
        });
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
                                <Button className="like-button" onClick={this.state.isLiked ? this.clickReplyUnlikeButtonHandler : this.clickReplyLikeButtonHandler}>{this.state.likeCount}</Button>
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
                            <Modal show={this.state.isModalOpen} onHide={() => this.handleClose} className="edit-modals" centered>
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
                                <Modal.Footer className="modal-footer">
                                    <Button onClick={this.clickConfirmButtonHandler}>
                                        Confirm
                                    </Button>
                                    <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    )
                    : null }
            </div>
        );
    }
}

ReviewReply.propTypes = {
    content: PropTypes.string,
    author: PropTypes.string,
    authorId: PropTypes.number,
    isLiked: PropTypes.bool,
    likeCount: PropTypes.number,
};

ReviewReply.defaultProps = {
    content: "",
    author: "",
    authorId: 0,
    isLiked: false,
    likeCount: 0,
};

export default ReviewReply;
