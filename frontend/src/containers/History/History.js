import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs, Tab, Button } from "react-bootstrap";

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
                    papers: this.props.paperList.list,
                });
            }).catch(() => {});

        this.props.onGetReviewLike()
            .then(() => {
                this.setState({
                    reviews: this.props.reviewList.list,
                });
            }).catch(() => {});

        this.props.onGetCollectionLike()
            .then(() => {
                this.setState({
                    collections: this.props.collectionList.list,
                });
            }).catch(() => {});
    }

    clickPaperMoreHandler = () => {
        this.props.onGetPaperLike({
            page_number: this.props.paperList.pageNum + 1,
        })
            .then(() => {
                const { papers } = this.state;
                this.setState({
                    papers: papers.concat(this.props.paperList.list),
                });
            });
    };

    clickCollectionMoreHandler = () => {
        this.props.onGetCollectionLike({
            page_number: this.props.collectionList.pageNum + 1,
        })
            .then(() => {
                const { collections } = this.state;
                this.setState({
                    collections: collections.concat(this.props.collectionList.list),
                });
            });
    };

    clickReviewMoreHandler = () => {
        this.props.onGetReviewLike({
            page_number: this.props.reviewList.pageNum + 1,
        })
            .then(() => {
                const { reviews } = this.state;
                this.setState({
                    reviews: reviews.concat(this.props.reviewList.list),
                });
            });
    };

    paperCardMaker = (card) => (
        <PaperCard
          key={card.id}
          id={card.id}
          title={card.title}
          date={card.date}
          authors={card.authors}
          keywords={card.keywords}
          likeCount={card.count.likes}
          reviewCount={card.count.reviews}
          isLiked={card.liked}
          addButtonExists
          headerExists={false}
        />
    )

    reviewCardMaker = (card) => (
        <ReviewCard
          key={card.id}
          author={card.user.username}
          author_id={card.user.id}
          id={card.id}
          title={card.title}
          user={card.user.username}
          date={card.date}
          isLiked={card.liked}
          likeCount={card.count.likes}
          replyCount={card.count.replies}
          headerExists={false}
          anonymous={card.is_anonymous}
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
          replyCount={card.count.replies}
          likeCount={card.count.likes}
          isLiked={card.liked}
          owner={card.owner}
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
        let paperMessage = (
            <div className="alert alert-warning" role="alert">
                No papers you liked.
            </div>
        );
        let reviewMessage = (
            <div className="alert alert-warning" role="alert">
                No reviews you liked.
            </div>
        );
        let collectionMessage = (
            <div className="alert alert-warning" role="alert">
                No collections you liked.
            </div>
        );

        if (this.state.papers != null && this.state.papers.length > 0) {
            paperCardLeft = this.state.papers
                .filter((x) => this.state.papers.indexOf(x) % 2 === 0)
                .map((paper) => this.paperCardMaker(paper));
            paperCardRight = this.state.papers
                .filter((x) => this.state.papers.indexOf(x) % 2 === 1)
                .map((paper) => this.paperCardMaker(paper));
            paperMessage = null;
        }

        if (this.state.papers != null && this.state.reviews.length > 0) {
            reviewCardLeft = this.state.reviews
                .filter((x) => this.state.reviews.indexOf(x) % 2 === 0)
                .map((review) => this.reviewCardMaker(review));
            reviewCardRight = this.state.reviews
                .filter((x) => this.state.reviews.indexOf(x) % 2 === 1)
                .map((review) => this.reviewCardMaker(review));
            reviewMessage = null;
        }

        if (this.state.papers != null && this.state.collections.length > 0) {
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
                <div className="history-text">My History</div>
                <div className="item-list">
                    <Tabs defaultActiveKey="paper-tab" className="item-tabs">
                        <Tab className="paper-tab" eventKey="paper-tab" title="Paper">
                            {paperMessage}
                            <div className="paper-cards">
                                <div className="paper-cards-left">{paperCardLeft}</div>
                                <div className="paper-cards-right">{paperCardRight}</div>
                            </div>
                            { this.props.paperList.finished ? null
                                : (
                                    <Button
                                      className="paper-more-button"
                                      onClick={this.clickPaperMoreHandler}
                                      size="lg"
                                      block
                                    >
                View More
                                    </Button>
                                )}
                        </Tab>
                        <Tab className="collection-tab" eventKey="collection-tab" title="Collection">
                            {collectionMessage}
                            <div className="collection-cards">
                                <div className="collection-cards-left">{collectionCardLeft}</div>
                                <div className="collection-cards-right">{collectionCardRight}</div>
                            </div>
                            {this.props.collectionList.finished ? null
                                : (
                                    <Button
                                      className="collection-more-button"
                                      onClick={this.clickCollectionMoreHandler}
                                      size="lg"
                                      block
                                    >
                View More
                                    </Button>
                                )}
                        </Tab>
                        <Tab className="review-tab" eventKey="review-tab" title="Review">
                            {reviewMessage}
                            <div className="review-cards">
                                <div className="review-cards-left">{reviewCardLeft}</div>
                                <div className="review-cards-right">{reviewCardRight}</div>
                            </div>
                            { this.props.reviewList.finished ? null
                                : (
                                    <Button
                                      className="review-more-button"
                                      onClick={this.clickReviewMoreHandler}
                                      size="lg"
                                      block
                                    >
                View More
                                    </Button>
                                ) }
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    reviewList: state.review.list,
    paperList: state.paper.getLikedPapers,
    collectionList: state.collection.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetReviewLike: (pageNum) => dispatch(reviewActions.getReviewLike(pageNum)),
    onGetPaperLike: (pageNum) => dispatch(paperActions.getPaperLike(pageNum)),
    onGetCollectionLike: (pageNum) => dispatch(collectionActions.getCollectionLike(pageNum)),

});

History.propTypes = {
    reviewList: PropTypes.objectOf(PropTypes.any),
    paperList: PropTypes.objectOf(PropTypes.any),
    collectionList: PropTypes.objectOf(PropTypes.any),
    onGetReviewLike: PropTypes.func,
    onGetPaperLike: PropTypes.func,
    onGetCollectionLike: PropTypes.func,
};

History.defaultProps = {
    reviewList: {},
    paperList: {},
    collectionList: {},
    onGetReviewLike: () => {},
    onGetPaperLike: () => {},
    onGetCollectionLike: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
