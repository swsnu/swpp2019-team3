import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import "./PaperSpec.css";

class PaperSpec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            likeCount: 0,
        };
        this.clickPaperSpecUnlikeHandler = this.clickPaperSpecUnlikeHandler.bind(this);
        this.clickPaperSpecLikeHandler = this.clickPaperSpecLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickPaperSpecLikeHandler() {
        const nextState = {
            isLiked: true,
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    // handle click 'Unlike' button
    clickPaperSpecUnlikeHandler() {
        const nextState = {
            isLiked: false,
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    render() {
        return (
            <div className="paperspec">
                <h2 id="title">{this.props.title}</h2>
                <h3 id="date">{this.props.date}</h3>
                <h3 id="authors">{this.props.authors}</h3>
                <h3 id="keywords">{this.props.keywords}</h3>
                <div className="buttons">
                    <Button className="like-button"
                        onClick={this.state.isLiked ? this.clickPaperSpecUnlikeHandler : this.clickPaperSpecLikeHandler}>
                            {this.state.likeCount}
                    </Button>
                    <Button className="reviewcount-button">{this.props.reviewCount}</Button>
                </div>
                <div className="abstract">
                    <h3 id="abstract-title">abstract</h3>
                    <p id="abstract-content">{this.props.abstract}</p>
                </div>
            </div>
        );
    }
}

PaperSpec.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    abstract: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.string,
    keywords: PropTypes.string,
};

PaperSpec.defaultProps = {
    id: 0,
    title: "",
    abstract: "",
    date: "",
    authors: "",
    keywords: "",
    reviewCount: 0
};

export default PaperSpec;