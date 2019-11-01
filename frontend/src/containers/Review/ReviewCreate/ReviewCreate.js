import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import {
    SideBar, Header, PaperSpec,
} from "../../../components";
// import * as actionCreators from "../../../store/actions/index";
import "./ReviewCreate.css";

class ReviewCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
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
        this.clickCreateHandler = this.clickCreateHandler.bind(this);
    }

    handleChange(e) {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    // 1 for paper id, 4 for review id
    clickCreateHandler() {
        /* return this.props.onMakeNewReview(
            -1, 0, this.state.title, this.state.content,
        )
            .then(
                () => {
                    this.props.history.push(`/papers/-1/${this.props.thisReview.id}`);
                },
            ); */
        // eslint-disable-next-line react/prop-types
        this.props.history.push("/papers/1/4");
    }

    render() {
        return (
            <div className="review-create">
                <Header />
                <SideBar />
                <div className="review-create-page">
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
                            <Form.Control name="title" className="title-input" as="textarea" rows="1" type="text" placeholder="Enter title" value={this.state.title} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="form-content" controlId="formReviewContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control name="content" className="content-input" as="textarea" value={this.state.content} rows="7" type="text" placeholder="Enter content" onChange={this.handleChange} />
                        </Form.Group>
                        <Button className="create-button" onClick={this.clickCreateHandler}>Create</Button>
                    </div>
                </div>
            </div>
        );
    }
}

/*
const mapStateToProps = (state) => ({
    // currentUserId: state.auth.currentUserId,
    // thisPaper: state.paper.selected.paper,
    thisReview: state.review.selected.review,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewReview: (paper, author, title, content) => dispatch(
        actionCreators.makeNewReview(paper, author, title, content),
    ),
});
*/
ReviewCreate.propTypes = {
    // currentUserId: PropTypes.number,
    /* thisPaper: PropTypes.shape({
        id: PropTypes.number,
        authors: PropTypes.string,
        title: PropTypes.string,
        publication: PropTypes.string,
        abstract: PropTypes.string,
        likeCount: PropTypes.number,
        isLiked: PropTypes.bool,
        date_created: PropTypes.string,
    }),
    thisReview: PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.number,
        paper: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
    onMakeNewReview: PropTypes.func, */
    history: PropTypes.objectOf(PropTypes.any),
};

ReviewCreate.defaultProps = {
    // currentUserId: 0,
    // thisPaper: {},
    // thisReview: {},
    // onMakeNewReview: () => {},
    history: null,
};

export default ReviewCreate;
// export default connect(mapStateToProps, mapDispatchToProps)(ReviewCreate);
