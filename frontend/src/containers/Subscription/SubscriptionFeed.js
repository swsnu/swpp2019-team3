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
            finished: true,
            start: 0,
            recoCount: 10,
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
                this.setState((prevState) => ({
                    subscriptions: prevState.subscriptions.concat(this.props.subscriptionItems),
                    // To maintain the number of feeds as 30 at least there are more than 30 feeds
                    recoCount: 30 - this.props.subscriptionItems.length,
                }));
                this.props.onGetRecommendations()
                    .then(() => {
                        this.setState((prevState) => ({
                            recommendations: prevState.recommendations.concat(
                                this.props.recommendationItems,
                            ),
                        }), () => {
                            this.addRecoToSub();
                        });
                    }).catch(() => {});
            }).catch(() => {});
    }

    clickMoreButton = () => {
        // get new subscription
        if (!this.props.subscriptionFinished) {
            this.props.onGetSubscriptions({
                page_number: this.props.subscriptionPageNum + 1,
            })
                .then(() => {
                    this.setState((prevState) => ({
                        subscriptions: prevState.subscriptions.concat(this.props.subscriptionItems),
                        // To maintain the number of feeds as 30
                        recoCount: 30 - this.props.subscriptionItems.length,
                    }), () => {
                        this.clickMoreButtonNext();
                    });
                }).catch(() => {});
        } else {
            this.setState({
                // To maintain the number of feeds as 30 at least there are more than 30 feeds
                recoCount: 30,
            });
            this.clickMoreButtonNext();
        }
    }

    clickMoreButtonNext = () => {
        // get new recommendation
        if (!this.props.recommendationFinished) {
            this.props.onGetRecommendations({
                page_number: this.props.recommendationPageNum + 1,
            })
                .then(() => {
                    this.setState((prevState) => ({
                        recommendations: prevState.recommendations.concat(
                            this.props.recommendationItems,
                        ),
                    }), () => {
                        this.addRecoToSub();
                    });
                }).catch(() => {});
        } else {
            this.addRecoToSub();
        }
    }

    addRecoToSub = () => {
        // add new recommendation to subscription
        const { recommendations } = this.state;
        const { subscriptions } = this.state;
        // sort recommendations
        for (let i = recommendations.length - 1; i > this.state.start; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [recommendations[i], this.state.recommendations[j]] = [
                recommendations[j],
                recommendations[i],
            ];
        }
        // put selected recommendations in temp
        let temp = [];
        if (recommendations.length >= this.state.recoCount) {
            temp = recommendations.splice(0, this.state.recoCount);
        } else {
            temp = recommendations.splice(0, this.state.recommendations.length);
        }

        // add temp to new subscription
        for (let i = 0; i < temp.length; i += 1) {
            const index = Math.random()
            * (subscriptions.length - this.state.start)
            + this.state.start;
            subscriptions.splice(index, 0, temp[i]);
        }
        this.setState({
            start: subscriptions.length,
            recommendations,
            subscriptions,
        });
        // finished check
        if (this.props.subscriptionFinished
            && this.props.recommendationFinished
            && this.state.recommendations.length <= 0) {
            this.setState({
                finished: true,
            });
        } else {
            this.setState({
                finished: false,
            });
        }
    }

    paperCardMaker = (key, paper, actor, verb, target, type) => (
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
          subscription={type === "subscription"}
          recommendation={type === "recommendation_paper"}
          actor={actor}
          verb={verb}
          target={target}
        />
    )

    collectionCardMaker = (key, collection, actor, verb, target, type) => (
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
          subscription={type === "subscription"}
          actor={actor}
          verb={verb}
          target={target}
        />
    )

    reviewCardMaker = (key, review, actor, verb, target, type) => (
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
          subscription={type === "subscription"}
          recommendation={type === "recommendation_review"}
          actor={actor}
          verb={verb}
          target={target}
        />
    )

    cardMaker = (item) => {
        const itemType = item.action_object.type;
        if (itemType === "paper") {
            return this.paperCardMaker(
                item.type + String(item.id),
                item.action_object.content,
                item.actor, item.verb,
                item.target,
                item.type,
            );
        }
        if (itemType === "collection") {
            return this.collectionCardMaker(
                item.type + String(item.id),
                item.action_object.content,
                item.actor,
                item.verb,
                item.target,
                item.type,
            );
        }
        if (itemType === "review") {
            return this.reviewCardMaker(
                item.type + String(item.id),
                item.action_object.content,
                item.actor,
                item.verb,
                item.target,
                item.type,
            );
        }
        return null;
    }

    render() {
        const cardsLeft = this.state.subscriptions
            .filter((x) => this.state.subscriptions.indexOf(x) % 2 === 0)
            .map((item) => this.cardMaker(item));

        const cardsRight = this.state.subscriptions
            .filter((x) => this.state.subscriptions.indexOf(x) % 2 === 1)
            .map((item) => this.cardMaker(item));

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
