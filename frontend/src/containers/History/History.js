import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";

import { PaperCard, ReviewCard, CollectionCard } from "../../components";
import { paperActions, reviewActions, collectionActions } from "../../store/actions";

import "./History.css";

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            papers: [],
            reviews: [],
            collections: [],
        };

        this.paperCardMaker = this.paperCardMaker.bind(this);
        this.reviewCardMaker = this.reviewCardMaker.bind(this);
        this.collectionCardMaker = this.collectionCardMaker.bind(this);
    }

    componentDidMount() {
        this.props.onGetPaperLike()
            .then(() => {
                this.setState({
                    papers: this.props.paperList,
                });
            }).catch(() => {});

        this.props.onGetReviewLike()
            .then(() => {
                this.setState({
                    reviews: this.props.reviewList,
                });
            }).catch(() => {});

        this.props.onGetCollectionLike()
            .then(() => {
                this.setState({
                    collections: this.props.collectionList,
                });
            }).catch(() => {});
    }

    paperCardMaker = (card) => (
        <PaperCard
          key={card.id}
          id={card.id}
          title={card.title}
          date={card.date}
          authors={card.authors}
          keywords={card.keywords}
          likeCount={card.count.likes}
          reviewCount={card.reviewCount}
          isLiked={card.liked}
          addButtonExists
          headerExists={false}
        />
    )

    reviewCardMaker = (card) => (
        <ReviewCard
          key={card.id}
          paperId={card.paperId}
          author={card.author}
          id={card.id}
          title={card.title}
          user={card.user.username}
          date={card.date}
          likeCount={card.likeCount}
          replyCount={card.replyCount}
          headerExists={false}
        />
    )

    collectionCardMaker = (card) => (
        <CollectionCard
          key={card.id}
          id={card.id}
          user={card.user}
          title={card.title}
          memberCount={card.count.users}
          paperCount={card.count.papers}
          replyCount={card.replyCount}
          likeCount={card.count.likes}
          isLiked={card.liked}
          headerExists={false}
        />
    )

    render() {
        let paperCardLeft = null;
        let paperCardRight = null;
        let reviewCardLeft = null;
        let reviewCardRight = null;
        let collectionCardLeft = null;
        let collectionCardRight = null;
        let paperMessage = "no papers you liked";
        let reviewMessage = "no reviews you liked";
        let collectionMessage = "no collections you liked";

        if (this.state.papers.length > 0) {
            paperCardLeft = this.state.papers
                .filter((x) => this.state.papers.indexOf(x) % 2 === 0)
                .map((paper) => this.paperCardMaker(paper));
            paperCardRight = this.state.papers
                .filter((x) => this.state.papers.indexOf(x) % 2 === 1)
                .map((paper) => this.paperCardMaker(paper));
            paperMessage = null;
        }

        if (this.state.reviews.length > 0) {
            reviewCardLeft = this.state.reviews
                .filter((x) => this.state.reviews.indexOf(x) % 2 === 0)
                .map((review) => this.reviewCardMaker(review));
            reviewCardRight = this.state.reviews
                .filter((x) => this.state.reviews.indexOf(x) % 2 === 1)
                .map((review) => this.reviewCardMaker(review));
            reviewMessage = null;
        }

        if (this.state.collections.length > 0) {
            collectionCardLeft = this.state.collections
                .filter((x) => this.state.collections.indexOf(x) % 2 === 0)
                .map((collection) => this.collectionCardMaker(collection));
            collectionCardRight = this.state.collections
                .filter((x) => this.state.collections.indexOf(x) % 2 === 1)
                .map((collection) => this.collectionCardMaker(collection));
            collectionMessage = null;
        }

        return (
            <div className="history">
                <div className="item-list">
                    <Tabs defaultActiveKey="paper-tab" className="item-tabs">
                        <Tab className="paper-tab" eventKey="paper-tab" title="Paper">
                            <div className="paper-cards">
                                <div className="paper-message">{paperMessage}</div>
                                <div className="paper-cards-left">{paperCardLeft}</div>
                                <div className="paper-cards-right">{paperCardRight}</div>
                            </div>
                        </Tab>
                        <Tab className="collection-tab" eventKey="collection-tab" title="Collection">
                            <div className="collection-cards">
                                <div className="collection-message">{collectionMessage}</div>
                                <div className="collection-cards-left">{collectionCardLeft}</div>
                                <div className="collection-cards-right">{collectionCardRight}</div>
                            </div>
                        </Tab>
                        <Tab className="review-tab" eventKey="review-tab" title="Review">
                            <div className="review-cards">
                                <div className="review-message">{reviewMessage}</div>
                                <div className="review-cards-left">{reviewCardLeft}</div>
                                <div className="review-cards-right">{reviewCardRight}</div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    reviewList: state.review.list.list,
    paperList: state.paper.likedPapers,
    collectionList: state.collection.list.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetReviewLike: () => dispatch(reviewActions.getReviewLike()),
    onGetPaperLike: () => dispatch(paperActions.getPaperLike()),
    onGetCollectionLike: () => dispatch(collectionActions.getCollectionLike()),

});

History.propTypes = {
    reviewList: PropTypes.arrayOf(PropTypes.any),
    paperList: PropTypes.arrayOf(PropTypes.any),
    collectionList: PropTypes.arrayOf(PropTypes.any),
    onGetReviewLike: PropTypes.func,
    onGetPaperLike: PropTypes.func,
    onGetCollectionLike: PropTypes.func,
};

History.defaultProps = {
    reviewList: [],
    paperList: [],
    collectionList: [],
    onGetReviewLike: () => {},
    onGetPaperLike: () => {},
    onGetCollectionLike: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
