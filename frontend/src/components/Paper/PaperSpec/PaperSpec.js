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
            truncateAbstractKeywords: true,
            truncateAbstract: true,
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

    processKeywords = (type) => this.props.keywords.filter(
        (keyword) => keyword.type === type,
    ).sort(
        (a, b) => a.id - b.id,
    ).map(
        (keyword) => (
            <Button
              key={keyword.id}
              id={keyword.name}
              className="keyword-tag"
              href={`/search=${keyword.name}`}
              variant="outline-secondary"
              size="sm"
            ># {keyword.name}
            </Button>
        ),
    )

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
            addButton = <AddPaperModal className="add-button" paperId={this.props.id} history={this.props.history} />;
        }

        let authorKeywords = "";
        let abstractKeywords = "";
        if (this.props.keywords.length > 0) {
            authorKeywords = this.processKeywords("author");
            if (this.state.truncateAbstractKeywords) {
                let moreButton = null;
                if (this.props.keywords.length > 10) {
                    moreButton = (
                        <Button
                          className="keyword-more-button"
                          onClick={() => this.setState({ truncateAbstractKeywords: false })}
                          variant="light"
                          size="sm"
                        >
                        ...
                        </Button>
                    );
                }
                abstractKeywords = (
                    <div id="abstract-keywords-content">{
                        this.processKeywords("abstract").slice(0, 10)
                    }
                    {moreButton}
                    </div>
                );
            } else {
                abstractKeywords = (
                    <div id="abstract-keywords-content">{
                        this.processKeywords("abstract")
                    }
                    <Button
                      className="keyword-less-button"
                      onClick={() => this.setState({ truncateAbstractKeywords: true })}
                      variant="light"
                      size="sm"
                    >
                        {"<"}
                    </Button>
                    </div>
                );
            }
        }

        let abstract = null;
        if (this.props.abstractfoldExists) {
            if (this.state.truncateAbstract) {
                abstract = (
                    <p id="abstract-content">
                        {this.props.abstract.substring(0, this.props.foldingNum)}
                        <Button
                          className="abstract-more-button"
                          onClick={() => this.setState({ truncateAbstract: false })}
                          variant="light"
                          size="sm"
                        >
                        ...
                        </Button>
                    </p>
                );
            } else {
                abstract = (
                    <p id="abstract-content">
                        {this.props.abstract}
                        <Button
                          className="abstract-less-button"
                          onClick={() => this.setState({ truncateAbstract: true })}
                          variant="light"
                          size="sm"
                        >
                            {"<"}
                        </Button>
                    </p>

                );
            }
        } else {
            abstract = (<p id="abstract-content">{this.props.abstract}</p>);
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
                      variant="info"
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
                        {abstractKeywords}
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
                    {abstract}
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
    abstractfoldExists: PropTypes.bool,
    foldingNum: PropTypes.number,
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
    abstractfoldExists: false,
    foldingNum: 0,
};
