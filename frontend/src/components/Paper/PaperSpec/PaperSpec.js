import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import "./PaperSpec.css";
import SVG from "../../svg";
import AddPaperModal from "../../Modal/AddPaperModal/AddPaperModal";

class PaperSpec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
        };
        this.clickPaperSpecUnlikeHandler = this.clickPaperSpecUnlikeHandler.bind(this);
        this.clickPaperSpecLikeHandler = this.clickPaperSpecLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickPaperSpecLikeHandler() {
        this.setState({ likeCount: this.props.likeCount });
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
        let addButton = null;
        if (this.props.addButtonExists) {
            addButton = <AddPaperModal className="add-button" id={this.props.id} history={this.props.history} />;
        }

        return (
            <div className="paperspec">
                <div className="paperInfo">
                    <h2 id="title">{this.props.title}</h2>
                    <h3 id="date">{this.props.date}</h3>
                    <Button className="url-button" onClick={() => window.open(this.props.link)}>URL</Button>
                    <h3 id="authors">{this.props.authors}</h3>
                    <h3 id="author-keywords">
                        Defined by Authors
                        <h3 id="author-keywords-content">{this.props.authorKeywords}</h3>
                    </h3>
                    <h3 id="abstract-keywords">
                        Extracted from Abstract
                        <h3 id="abstract-keywords-content">{this.props.abstractKeywords}</h3>
                    </h3>
                </div>
                <div className="buttons">
                    <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickPaperSpecUnlikeHandler : this.clickPaperSpecLikeHandler}>
                        <div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>
                        {this.state.likeCount}
                    </Button>
                    {addButton}
                </div>
                <div className="abstract">
                    <h3 id="abstract-title">Abstract</h3>
                    <p id="abstract-content">{this.props.abstract}</p>
                </div>
            </div>
        );
    }
}

PaperSpec.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    id: PropTypes.number,
    title: PropTypes.string,
    abstract: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.string,
    authorKeywords: PropTypes.string,
    abstractKeywords: PropTypes.string,
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
    addButtonExists: PropTypes.bool,
    link: PropTypes.string,
};

PaperSpec.defaultProps = {
    history: null,
    id: -1,
    title: "",
    abstract: "",
    date: "",
    authors: "",
    authorKeywords: "",
    abstractKeywords: "",
    likeCount: 0,
    isLiked: false,
    addButtonExists: false,
    link: "",
};

export default PaperSpec;
