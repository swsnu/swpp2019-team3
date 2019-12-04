import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import { PaperCard, CollectionCard, ReviewCard } from "../../components";
import { authActions } from "../../store/actions";

import "./SubscriptionFeed.css";

class SubscriptionFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscriptions: [],
            recommendations: [],
            finished: false,
            start: 0,
            recoNum: 10,
        };
        this.paperCardMaker = this.paperCardMaker.bind(this);
        this.reviewCardMaker = this.reviewCardMaker.bind(this);
        this.collectionCardMaker = this.collectionCardMaker.bind(this);
        this.clickMoreButton = this.clickMoreButton.bind(this);
        this.addRecoToSub = this.addRecoToSub.bind(this);
    }

    componentDidMount() {
        this.props.onGetSubscriptions()
            .then(() => {
                this.setState({
                    subscriptions: this.props.subscriptionItems,
                });
                this.props.onGetRecommendations()
                    .then(() => {
                        this.setState({
                            recommendations: this.props.recommendationItems,
                        });
                        this.addRecoToSub();
                        if (this.props.subscriptionFinished) {
                            if (this.state.recommendations.length <= 0) {
                                this.setState({
                                    finished: true,
                                });
                            } else {
                                this.setState({
                                    recoNum: 20,
                                });
                            }
                        }
                    }).catch(() => {});
            }).catch(() => {});
    }

    // FIXME: if de-commentize those lines, somehow onGetSubscriptions is called recursively
    // componentDidUpdate(prevProps) {
    //     if (this.props.subscriptionItems !== prevProps.subscriptionItems) {
    //         this.props.onGetSubscriptions();
    //     }
    // }

    clickMoreButton = () => {
        if (!this.props.subscriptionFinished) {
            this.props.onGetSubscriptions({
                page_number: this.props.subscriptionPageNum + 1,
            })
                .then(() => {
                    const { subscriptions } = this.state;
                    this.setState({
                        subscriptions: subscriptions.concat(this.props.subscriptionItems),
                    });
                    this.clickMoreButtonNext();
                }).catch(() => {});
        } else {
            this.clickMoreButtonNext();
        }
    }

    clickMoreButtonNext = () => {
        if (!this.props.recommendationFinished) {
            this.props.onGetRecommendations({
                page_number: this.props.recommendationPageNum + 1,
            })
                .then(() => {
                    const { recommendations } = this.state;
                    this.setState({
                        recommendations: recommendations.concat(this.props.recommendationItems),
                    });
                    this.addRecoToSub();
                }).catch(() => {});
        } else {
            this.addRecoToSub();
        }
    }

    addRecoToSub = () => {
        for (let i = this.state.recommendations.length - 1; i > this.state.start; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.state.recommendations[i], this.state.recommendations[j]] = [
                this.state.recommendations[j],
                this.state.recommendations[i],
            ];
        }
        let temp = [];
        if (this.state.recommendations.length >= this.state.recoNum) {
            temp = this.state.recommendations.splice(0, this.state.recoNum);
        } else {
            temp = this.state.recommendations.splice(0, this.state.recommendations.length);
        }

        for (let i = 0; i < temp.length; i += 1) {
            const index = Math.random()
            * (this.state.subscriptions.length - this.state.start)
            + this.state.start;
            this.state.subscriptions.splice(index, 0, temp[i]);
        }
        this.setState((prevState) => ({
            start: prevState.subscriptions.length,
        }));
        if (this.props.subscriptionFinished) {
            if (this.state.recommendations.length <= 0) {
                this.setState({
                    finished: true,
                });
            } else {
                this.setState({
                    recoNum: 20,
                });
            }
        }
    }

    paperCardMaker = (key, paper, actor, verb, target) => (
        <PaperCard
          key={key}
          id={paper.id}
          title={paper.title}
          authors={paper.authors}
          keywords={paper.keywords}
          likeCount={paper.count.likes}
          reviewCount={paper.count.reviews}
          isLiked={paper.liked}
          addButtonExists
          history={this.props.history}
          headerExists
          subscription
          actor={actor}
          verb={verb}
          target={target}
        />
    )

    collectionCardMaker = (key, collection, actor, verb, target) => (
        <CollectionCard
          key={key}
          id={collection.id}
          title={collection.title}
          memberCount={collection.count.users}
          paperCount={collection.count.papers}
          replyCount={collection.count.replies}
          likeCount={collection.count.likes}
          isLiked={collection.liked}
          headerExists
          subscription
          actor={actor}
          verb={verb}
          target={target}
        />
    )

    reviewCardMaker = (key, review, actor, verb, target) => (
        <ReviewCard
          key={key}
          id={review.id}
          paperId={review.paper.id}
          author={review.user.username}
          author_id={review.user.id}
          title={review.title}
          isLiked={review.liked}
          likeCount={review.count.likes}
          replyCount={review.count.replies}
          headerExists
          subscription
          actor={actor}
          verb={verb}
          target={target}
        />
    )

    cardMaker = (item, index) => {
        const itemType = item.action_object.type;
        if (itemType === "paper") {
            return this.paperCardMaker(
                index, item.action_object.content, item.actor, item.verb, item.target,
            );
        }
        if (itemType === "collection") {
            return this.collectionCardMaker(
                index, item.action_object.content, item.actor, item.verb, item.target,
            );
        }
        if (itemType === "review") {
            return this.reviewCardMaker(
                index, item.action_object.content, item.actor, item.verb, item.target,
            );
        }
        return null;
    }

    render() {
        const cardsLeft = this.state.subscriptions
            .filter((x) => this.state.subscriptions.indexOf(x) % 2 === 0)
            .map((item, index) => this.cardMaker(item, index));

        const cardsRight = this.state.subscriptions
            .filter((x) => this.state.subscriptions.indexOf(x) % 2 === 1)
            .map((item, index) => this.cardMaker(item, index));

        return (
            <div className="SubscriptionFeed">
                {/* <div id="SubscriptionText">My Subscription Feed</div> */}
                <div id="subscriptionCards">
                    <div id="subscriptionCardsLeft">{cardsLeft}</div>
                    <div id="subscriptionCardsRight">{cardsRight}</div>
                </div>
                { this.state.finished ? null
                    : (
                        <Button
                          className="more-button"
                          onClick={this.clickMoreButton}
                          size="lg"
                          block
                        >
                View More
                        </Button>
                    ) }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    subscriptionPageNum: state.auth.subscriptions.pageNum,
    subscriptionFinished: state.auth.subscriptions.finished,
    subscriptionItems: state.auth.subscriptions.list,
    recommendationItems: state.auth.recommendations.list,
    recommendationPageNum: state.auth.recommendations.pageNum,
    recommendationFinished: state.auth.recommendations.finished,
});

const mapDispatchToProps = (dispatch) => ({
    onGetSubscriptions: (pageNum) => dispatch(authActions.getSubscriptions(pageNum)),
    onGetRecommendations: (pageNum) => dispatch(authActions.getRecommendations(pageNum)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionFeed);

SubscriptionFeed.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    subscriptionItems: PropTypes.arrayOf(PropTypes.any),
    onGetSubscriptions: PropTypes.func,
    recommendationItems: PropTypes.arrayOf(PropTypes.any),
    onGetRecommendations: PropTypes.func,
    subscriptionFinished: PropTypes.bool,
    subscriptionPageNum: PropTypes.number,
    recommendationFinished: PropTypes.bool,
    recommendationPageNum: PropTypes.number,
};

SubscriptionFeed.defaultProps = {
    history: null,
    subscriptionItems: [],
    onGetSubscriptions: () => {},
    recommendationItems: [],
    onGetRecommendations: () => {},
    subscriptionFinished: true,
    subscriptionPageNum: 0,
    recommendationFinished: true,
    recommendationPageNum: 0,
};
