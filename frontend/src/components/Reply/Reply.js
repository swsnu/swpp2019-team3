import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    Modal, FormControl, Button, Nav,
} from "react-bootstrap";
import "./Reply.css";
import SVG from "../svg";

import { replyActions } from "../../store/actions";

class Reply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempContent: "",
            isLiked: false,
            likeCount: 0,
            isModalOpen: false,
            date: "",
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

    componentDidMount() {
        this.setState({
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
            date: this.props.date.split("T")[0],
        });
    }

    clickReplyEditButtonHandler() {
        this.setState({
            isModalOpen: true,
            tempContent: this.props.content,
        });
    }

    clickReplyDeleteButtonHandler() {
        if (this.props.type === "review") {
            this.props.onDeleteReplyReview({ id: this.props.id })
                .then(() => {
                    this.props.onChange();
                });
        } else if (this.props.type === "collection") {
            this.props.onDeleteReplyCollection({ id: this.props.id })
                .then(() => {
                    this.props.onChange();
                });
        }
    }

    clickReplyLikeButtonHandler() {
        this.props.onLikeReply({ id: this.props.id })
            .then(() => {
                this.setState({
                    likeCount: this.props.afterLikeCount,
                    isLiked: true,
                });
            });
    }

    clickReplyUnlikeButtonHandler() {
        this.props.onUnlikeReply({ id: this.props.id })
            .then(() => {
                this.setState({
                    likeCount: this.props.afterUnlikeCount,
                    isLiked: false,
                });
            });
    }

    // for Modal input change
    handleChange(e) {
        this.setState({
            tempContent: e.target.value,
        });
    }

    // for Modal
    clickConfirmButtonHandler() {
        if (this.props.type === "review") {
            this.props.onEditReplyReview({ id: this.props.id, text: this.state.tempContent })
                .then(() => {
                    this.setState({
                        tempContent: "",
                    });
                    this.props.onChange();
                }).catch(() => {});
        } else if (this.props.type === "collection") {
            this.props.onEditReplyCollection({ id: this.props.id, text: this.state.tempContent })
                .then(() => {
                    this.setState({
                        tempContent: "",
                    });
                    this.props.onChange();
                }).catch(() => {});
        }

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
            <div className="reply-component">
                <div className="reply">
                    <div className="author">
                        <Nav.Link to={`/profile_id=${this.props.authorId}`}>{this.props.author}</Nav.Link>
                    </div>
                    <div className="date">{this.state.date}</div>
                    <div className="content">{this.props.content}</div>
                    <div className="buttons">
                        <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickReplyUnlikeButtonHandler : this.clickReplyLikeButtonHandler}>
                            <div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>{this.state.likeCount}
                        </Button>
                        {this.props.authorId === this.props.userId
                            ? <Button className="edit-button" onClick={this.clickReplyEditButtonHandler}>Edit</Button> : null }
                        {this.props.authorId === this.props.userId
                            ? <Button className="delete-button" onClick={this.clickReplyDeleteButtonHandler}>Delete</Button> : null }
                    </div>
                </div>
                <div className="edit-modal">
                    <Modal show={this.state.isModalOpen} onHide={() => this.handleClose} className="edit-modals" centered>
                        <Modal.Header>Edit Reply</Modal.Header>
                        <Modal.Body>
                            <FormControl
                              className="edit-input"
                              as="textarea"
                              placeholder={this.state.content}
                              bsPrefix="edit-input"
                              value={this.state.tempContent}
                              onChange={this.handleChange}
                            />
                        </Modal.Body>
                        <Modal.Footer className="modal-footer">
                            <Button
                              onClick={this.clickConfirmButtonHandler}
                              disabled={
                                  this.state.tempContent.length === 0
                                  || this.state.tempContent === this.props.content
                              }
                            >
                                        Confirm
                            </Button>
                            <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    afterLikeCount: state.reply.like.count,
    afterUnlikeCount: state.reply.unlike.count,
});

const mapDispatchToProps = (dispatch) => ({
    onLikeReply: (replyId) => dispatch(
        replyActions.likeReply(replyId),
    ),
    onUnlikeReply: (replyId) => dispatch(
        replyActions.unlikeReply(replyId),
    ),
    onEditReplyReview: (reply) => dispatch(
        replyActions.editReplyReview(reply),
    ),
    onDeleteReplyReview: (replyId) => dispatch(
        replyActions.deleteReplyReview(replyId),
    ),
    onEditReplyCollection: (reply) => dispatch(
        replyActions.editReplyCollection(reply),
    ),
    onDeleteReplyCollection: (replyId) => dispatch(
        replyActions.deleteReplyCollection(replyId),
    ),
});

Reply.propTypes = {
    id: PropTypes.number,
    content: PropTypes.string,
    author: PropTypes.string,
    authorId: PropTypes.number,
    userId: PropTypes.number,
    isLiked: PropTypes.bool,
    likeCount: PropTypes.number,
    onChange: PropTypes.func,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    type: PropTypes.string,
    onLikeReply: PropTypes.func,
    onUnlikeReply: PropTypes.func,
    onEditReplyCollection: PropTypes.func,
    onEditReplyReview: PropTypes.func,
    onDeleteReplyCollection: PropTypes.func,
    onDeleteReplyReview: PropTypes.func,
    date: PropTypes.string,
};

Reply.defaultProps = {
    id: 0,
    content: "",
    author: "",
    authorId: 0,
    userId: 0,
    isLiked: false,
    likeCount: 0,
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    type: "",
    onChange: () => {},
    onLikeReply: () => {},
    onUnlikeReply: () => {},
    onEditReplyCollection: () => {},
    onEditReplyReview: () => {},
    onDeleteReplyCollection: () => {},
    onDeleteReplyReview: () => {},
    date: "",
};

export default connect(mapStateToProps, mapDispatchToProps)(Reply);
