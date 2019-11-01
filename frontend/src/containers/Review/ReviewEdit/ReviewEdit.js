import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

import {
    SideBar, Header, PaperSpec,
} from "../../../components";
import "./ReviewEdit.css";


class ReviewEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "review_title1",
            content: "review content",
            id: 5,
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
        this.clickEditHandler = this.clickEditHandler.bind(this);
    }

    handleChange(e) {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    clickEditHandler() {
        this.props.history.push(`papers/${this.state.paper.id}/${this.state.id}`);
    }

    render() {
        const paperSpec = () => (
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
        );

        return (
            <div className="review-edit">
                <Header />
                <SideBar />
                <div className="review-edit-page">
                    <div className="board">
                        {paperSpec}
                        <Form.Group className="form-title" controlId="formReviewTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" className="title-input" as="textarea" rows="1" type="text" placeholder={this.state.title} value={this.state.title} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="form-content" controlId="formReviewContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control name="content" className="content-input" as="textarea" rows="7" type="text" placeholder={this.state.content} value={this.state.content} onChange={this.handleChange} />
                        </Form.Group>
                        <Button className="edit-button" onClick={this.clickEditHandler}>Edit</Button>
                    </div>
                </div>
            </div>
        );
    }
}

ReviewEdit.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

ReviewEdit.defaultProps = {
    history: null,
};

export default ReviewEdit;
