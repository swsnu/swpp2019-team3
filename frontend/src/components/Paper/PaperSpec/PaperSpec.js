import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./PaperSpec.css";
import SVG from "../../svg";
import AddPaperModal from "../../Modal/AddPaperModal/AddPaperModal";
import { paperActions } from "../../../store/actions";

class PaperSpec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            likeCount: 0,
        };
        this.processKeywords = this.processKeywords.bind(this);
        this.clickPaperSpecUnlikeHandler = this.clickPaperSpecUnlikeHandler.bind(this);
        this.clickPaperSpecLikeHandler = this.clickPaperSpecLikeHandler.bind(this);
    }

    /* eslint-disable react/no-did-update-set-state */
    // It's OK to use setState if it is wrapped in a condition
    // please refer to https://reactjs.org/docs/react-component.html#componentdidupdate
    componentDidUpdate(prevProps) {
        if (this.props.isLiked !== prevProps.isLiked
            || this.props.likeCount !== prevProps.likeCount) {
            this.setState({
                isLiked: this.props.isLiked,
                likeCount: this.props.likeCount,
            });
        }
    }
    /* eslint-enable react/no-did-update-set-state */

    processKeywords = (type) => {
        const keywords = this.props.keywords.filter(
            (keyword) => keyword.type === type,
        ).sort(
            (a, b) => a.id - b.id,
        ).map(
            (keyword) => keyword.name,
        );
        return keywords.join(", ");
    }

    // handle click 'Like' button
    clickPaperSpecLikeHandler() {
        this.props.onLikePaper({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterLikeCount });
                this.setState({ isLiked: true });
            });
    }

    // handle click 'Unlike' button
    clickPaperSpecUnlikeHandler() {
        this.props.onUnlikePaper({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterUnlikeCount });
                this.setState({ isLiked: false });
            });
    }

    render() {
        let addButton = null;
        if (this.props.addButtonExists) {
            addButton = <AddPaperModal className="add-button" id={this.props.id} history={this.props.history} />;
        }

        let authorKeywords = "";
        let abstractKeywords = "";
        if (this.props.keywords.length > 0) {
            authorKeywords = this.processKeywords("author");
            abstractKeywords = this.processKeywords("abstract");
        }

        let authorNames = "";
        if (this.props.authors.length > 0) {
            authorNames = this.props.authors.map((author) => `${author.first_name} ${author.last_name}`).join(", ");
        }

        return (
            <div className="paperspec">
                <div className="paperInfo">
                    <h2 id="title">{this.props.title}</h2>
                    <h3 id="date">{this.props.date}</h3>
                    <Button
                      className="url-button"
                      onClick={() => window.open(this.props.link)}
                      disabled={this.props.link.length === 0}
                    >URL
                    </Button>
                    <h3 id="authors">{authorNames}</h3>
                    <div className="author-keywords">
                        Defined by Authors
                        <h3 id="author-keywords-content">{authorKeywords}</h3>
                    </div>
                    <div className="abstract-keywords">
                        Extracted from Abstract
                        <h3 id="abstract-keywords-content">{abstractKeywords}</h3>
                    </div>
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

const mapStateToProps = (state) => ({
    likePaperStatus: state.paper.likePaperStatus,
    afterLikeCount: state.paper.likeCount,
    unlikePaperStatus: state.paper.unlikePaperStatus,
    afterUnlikeCount: state.paper.unlikeCount,
});

const mapDispatchToProps = (dispatch) => ({
    onLikePaper: (paperId) => dispatch(
        paperActions.likePaper(paperId),
    ),
    onUnlikePaper: (paperId) => dispatch(
        paperActions.unlikePaper(paperId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaperSpec);

PaperSpec.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    id: PropTypes.number,
    title: PropTypes.string,
    abstract: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.any),
    keywords: PropTypes.arrayOf(PropTypes.any),
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
    addButtonExists: PropTypes.bool,
    link: PropTypes.string,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikePaper: PropTypes.func,
    onUnlikePaper: PropTypes.func,
};

PaperSpec.defaultProps = {
    history: null,
    id: -1,
    title: "",
    abstract: "",
    date: "",
    authors: [],
    keywords: [],
    likeCount: 0,
    isLiked: false,
    addButtonExists: false,
    link: "",
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikePaper: () => {},
    onUnlikePaper: () => {},
};
