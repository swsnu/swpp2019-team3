import React, { Component } from "react";
import PropTypes from "prop-types";

import {
    CollectionCard, ReviewCard, PaperCard,
} from "../../components";
import "./Main.css";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feeds: [],
        };

        this.feedMaker = this.feedMaker.bind(this);
    }

    feedMaker = (feed) => {
        if (feed.type === "Collection") {
            return (
                <CollectionCard
                  source={feed.source}
                  key={feed.id}
                  id={feed.id}
                  title={feed.title}
                  user={feed.user}
                  replyCount={feed.replyCount}
                  paperCount={feed.paperCount}
                  likeCount={feed.likeCount}
                />
            );
        }
        if (feed.type === "Review") {
            return (
                <ReviewCard
                  source={feed.source}
                  paperId={feed.paperId}
                  author={feed.author}
                  key={feed.id}
                  id={feed.id}
                  title={feed.title}
                  user={feed.user}
                  date={feed.date}
                  likeCount={feed.likeCount}
                  replyCount={feed.replyCount}
                />
            );
        }
        if (feed.type === "Paper") {
            return (
                <PaperCard
                  key={feed.id}
                  source={feed.source}
                  id={feed.id}
                  user={feed.user}
                  title={feed.title}
                  authors={feed.authors}
                  date={feed.date}
                  keywords={feed.keywords}
                  likeCount={feed.likeCount}
                  reviewCount={feed.reviewCount}
                  addButtonExists
                  history={this.props.history}
                />
            );
        }
        return null;
    }

    render() {
        const tmpMessage = "Welcome to PapersFeed. Subscription and Recommendation system will be ready soon!";
        const feedsLeft = this.state.feeds.filter((x) => this.state.feeds.indexOf(x) % 2 === 0)
            .map((feed) => this.feedMaker(feed));
        const feedsRight = this.state.feeds.filter((x) => this.state.feeds.indexOf(x) % 2 === 1)
            .map((feed) => this.feedMaker(feed));

        return (
            <div className="main">
                <div className="feeds">
                    <h2 id="tmp-message">{tmpMessage}</h2>
                    <div className="board">
                        <div className="left">{feedsLeft}</div>
                        <div className="right">{feedsRight}</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Main;

Main.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

Main.defaultProps = {
    history: null,
};
