import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import {
    PaperSpec,
} from "../../../components";
import "./ReviewControl.css";

class ReviewControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            id: 5,
            content: "",
            paper: {
                id: 1,
                title: "paper_title",
                abstract: "abstract abstract abstract abstract abstract abstract abstract abstract ",
                date: "2019.10.30.",
                authors: "paper_authors",
                keywords: "paper_keywords",
                likeCount: 101,
                reviewCount: 3,
            },
        };
        this.handleChange = this.handleChange.bind(this);
        this.clickButtonHandler = this.clickButtonHandler.bind(this);
    }

    clickButtonHandler() {
        this.props.history.push(`/review_id=${this.state.id}`);
    }

    handleChange(e) {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    render() {
        return (
            <div className="review-control">
                <div className="review-control-page">
                    <div className="board">
                        <div className="paper-spec">
                            <PaperSpec
                              id={this.state.paper.id}
                              title={this.state.paper.title}
                              abstract={this.state.paper.abstract}
                              date={this.state.paper.date}
                              authors={this.state.paper.authors}
                              keywords={this.state.paper.keywords}
                              likeCount={this.state.paper.likeCount}
                              reviewCount={this.state.paper.reviewCount}
                            />
                        </div>
                        <Form.Group className="form-title" controlId="formReviewTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" className="title-input" as="textarea" rows="1" type="text" placeholder={this.props.mode === 0 ? "Enter title" : this.state.title} value={this.state.title} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="form-content" controlId="formReviewContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control name="content" className="content-input" as="textarea" value={this.state.content} rows="7" type="text" placeholder={this.props.mode === 0 ? "Enter content" : this.state.content} onChange={this.handleChange} />
                        </Form.Group>
                        { this.props.mode === 0
                            ? <Button className="create-button" onClick={this.clickButtonHandler}>Create</Button>
                            : <Button className="edit-button" onClick={this.clickButtonHandler}>Edit</Button> }
                    </div>
                </div>
            </div>
        );
    }
}

ReviewControl.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    mode: PropTypes.number,
};

ReviewControl.defaultProps = {
    history: null,
    mode: 0,
};

export default ReviewControl;
