/* eslint-disable react/no-array-index-key */
import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { paperActions } from "../../../store/actions";
import "./PaperCard.css";
import AddPaperModal from "../../Modal/AddPaperModal/AddPaperModal";
import SVG from "../../svg";

class PaperCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
            authorNames: "",
            keywords: "",
        };
        this.processKeywords = this.processKeywords.bind(this);
        this.clickPaperCardUnlikeHandler = this.clickPaperCardUnlikeHandler.bind(this);
        this.clickPaperCardLikeHandler = this.clickPaperCardLikeHandler.bind(this);
    }

    componentDidMount() {
        if (this.props.authors.length > 0) {
            const authorNames = this.props.authors.map((author) => `${author.first_name} ${author.last_name}`);
            this.setState({ authorNames: authorNames.slice(0, 10).join(", ") });
        }
        let authorKeywords = "";
        let abstractKeywords = "";
        if (this.props.keywords.length > 0) {
            authorKeywords = this.processKeywords("author");
            abstractKeywords = this.processKeywords("abstract");

            if (authorKeywords.length > 0) {
                this.setState({ keywords: authorKeywords });
            } else {
                this.setState({ keywords: abstractKeywords });
            }
        }
    }

    processKeywords = (type) => this.props.keywords.sort(
        (a, b) => a.id - b.id,
    ).slice(0, 10).filter(
        (keyword) => keyword.type === type,
    ).map(
        (keyword, index) => (
            <Button
              key={index}
              id={keyword.name}
              className="keyword-tag"
              href={`/search=${keyword.name}`}
              variant="outline-secondary"
              size="sm"
            ># {keyword.name}
            </Button>
        ),
    );


    // handle click 'Like' button
    clickPaperCardLikeHandler() {
        this.props.onLikePaper({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterLikeCount });
                this.setState({ isLiked: true });
            });
    }

    // handle click 'Unlike' button
    clickPaperCardUnlikeHandler() {
        this.props.onUnlikePaper({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterUnlikeCount });
                this.setState({ isLiked: false });
            });
    }

    render() {
        let header = null;
        if (this.props.headerExists) {
            if (this.props.subscription) {
                const actorLink = (<a className="actorLink" href={`/profile_id=${this.props.actor.id}`}>{this.props.actor.username}</a>);
                if (Object.keys(this.props.target).length !== 0) {
                    header = (
                        <Card.Header id="headerSubscriptionTarget">
                            <div className="CardHeader">
                                {this.props.actor.id === 0
                                    ? (<h5 className="actorLink">{this.props.actor.username}</h5>)
                                    : actorLink}
                                <h5 className="verb">{` ${this.props.verb} this paper to`}</h5>
                                <a className="targetLink" href={`/collection_id=${this.props.target.id}`}>{`${this.props.target.title}`}</a>
                            </div>
                        </Card.Header>
                    );
                } else {
                    header = (
                        <Card.Header id="headerSubscription">
                            <div className="CardHeader">
                                {this.props.actor.id === 0
                                    ? (<h5 className="actorLink">{this.props.actor.username}</h5>)
                                    : actorLink}
                                <h5 className="verb">{` ${this.props.verb} this paper`}</h5>
                            </div>
                        </Card.Header>
                    );
                }
            } else if (this.props.paperSource) {
                header = <Card.Header id="header">{`from ${this.props.paperSource}`}</Card.Header>;
            }
        }
        let addButton = null;
        if (this.props.addButtonExists) {
            addButton = <AddPaperModal className="add-button" paperId={this.props.id} history={this.props.history} />;
        }

        return (
            <div className="wrapper">
                <Card className="paper">
                    {header}
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link href={`/paper_id=${this.props.id}`} className="text">{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>{this.props.date}</Card.Text>
                        <Card.Text className="authors">{this.state.authorNames}</Card.Text>
                        <Card.Text className="keywords">{this.state.keywords}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="footer">
                        <div id="footer-flex">
                            <div id="footer-left-buttons">
                                <Button
                                  variant="light"
                                  className="like-button"
                                  onClick={this.state.isLiked
                                      ? this.clickPaperCardUnlikeHandler
                                      : this.clickPaperCardLikeHandler}
                                >
                                    <div id="likeButtonInside">
                                        <SVG name="heart" height="25px" width="25px" />
                                        {this.state.likeCount}
                                    </div>
                                </Button>
                                <Button
                                  variant="light"
                                  className="review-button"
                                  href={`/paper_id=${this.props.id}`}
                                >
                                    <div id="reviewButtonInside">
                                        <SVG name="zoom" height="25px" width="25px" />
                                        {this.props.reviewCount}
                                    </div>
                                </Button>
                            </div>
                            <div>
                                {addButton}
                            </div>
                        </div>
                    </Card.Footer>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaperCard);

PaperCard.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    id: PropTypes.number,
    title: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    keywords: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    likeCount: PropTypes.number,
    reviewCount: PropTypes.number,
    isLiked: PropTypes.bool,
    paperSource: PropTypes.string,
    headerExists: PropTypes.bool,
    addButtonExists: PropTypes.bool,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikePaper: PropTypes.func,
    onUnlikePaper: PropTypes.func,
    subscription: PropTypes.bool,
    actor: PropTypes.objectOf(PropTypes.any),
    verb: PropTypes.string,
    target: PropTypes.objectOf(PropTypes.any),
};

PaperCard.defaultProps = {
    history: null,
    id: 0,
    title: "",
    date: "",
    authors: [],
    keywords: [],
    likeCount: 0,
    reviewCount: 0,
    isLiked: false,
    paperSource: "",
    headerExists: true,
    addButtonExists: false,
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikePaper: () => {},
    onUnlikePaper: () => {},
    subscription: false,
    actor: {},
    verb: "",
    target: {},
};
