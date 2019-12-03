import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { PaperCard, CollectionCard, ReviewCard } from "../../components";
import { authActions } from "../../store/actions";

import "./SubscriptionFeed.css";

class SubscriptionFeed extends Component {
    componentDidMount() {
        this.props.onGetSubscriptions();
    }

    // FIXME: if de-commentize those lines, somehow onGetSubscriptions is called recursively
    // componentDidUpdate(prevProps) {
    //     if (this.props.subscriptionItems !== prevProps.subscriptionItems) {
    //         this.props.onGetSubscriptions();
    //     }
    // }

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

    cardMaker = (item) => {
        const itemType = item.action_object.type;
        if (itemType === "paper") {
            return this.paperCardMaker(
                item.id, item.action_object.content, item.actor, item.verb, item.target,
            );
        }
        if (itemType === "collection") {
            return this.collectionCardMaker(
                item.id, item.action_object.content, item.actor, item.verb, item.target,
            );
        }
        if (itemType === "review") {
            return this.reviewCardMaker(
                item.id, item.action_object.content, item.actor, item.verb, item.target,
            );
        }
        return null;
    }

    render() {
        const cardsLeft = this.props.subscriptionItems
            .filter((x) => this.props.subscriptionItems.indexOf(x) % 2 === 0)
            .map((item) => this.cardMaker(item));

        const cardsRight = this.props.subscriptionItems
            .filter((x) => this.props.subscriptionItems.indexOf(x) % 2 === 1)
            .map((item) => this.cardMaker(item));

        return (
            <div className="SubscriptionFeed">
                {/* <div id="SubscriptionText">My Subscription Feed</div> */}
                <div id="subscriptionCards">
                    <div id="subscriptionCardsLeft">{cardsLeft}</div>
                    <div id="subscriptionCardsRight">{cardsRight}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    subscriptionItems: state.auth.subscriptions,
});

const mapDispatchToProps = (dispatch) => ({
    onGetSubscriptions: () => dispatch(authActions.getSubscriptions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionFeed);

SubscriptionFeed.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    subscriptionItems: PropTypes.arrayOf(PropTypes.any),
    onGetSubscriptions: PropTypes.func,
};

SubscriptionFeed.defaultProps = {
    history: null,
    subscriptionItems: [],
    onGetSubscriptions: () => {},
};
