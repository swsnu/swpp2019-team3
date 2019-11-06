import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import PropTypes from "prop-types";

import "./PaperSpec.css";

import AddPaperModal from "../../Modal/AddPaperModal/AddPaperModal";
import heart from "../../heart.png";

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
                <h2 id="title">{this.props.title}</h2>
                <h3 id="date">{this.props.date}</h3>
                <h3 id="authors">{this.props.authors}</h3>
                <h3 id="keywords">{this.props.keywords}</h3>
                <div className="buttons">
                    <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickPaperSpecUnlikeHandler : this.clickPaperSpecLikeHandler}>
                        <Image src={heart} width={20} height={20} className="heart-image" />
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
    id: PropTypes.number,
    title: PropTypes.string,
    abstract: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.string,
    keywords: PropTypes.string,
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
    addButtonExists: PropTypes.bool,
};

PaperSpec.defaultProps = {
    id: -1,
    title: "",
    abstract: "",
    date: "",
    authors: "",
    keywords: "",
    likeCount: 0,
    isLiked: false,
    addButtonExists: false,
};

export default PaperSpec;
