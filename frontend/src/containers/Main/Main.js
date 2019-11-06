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
            feeds: [{
                type: "Collection",
                source: "made",
                id: 1,
                title: "Papers for tasty cat cans",
                user: "Canpicker",
                paperCount: 4,
                replyCount: 3,
                owner: "Ddaeggeol",
                likeCount: 15,
            }, {
                type: "Review",
                source: "liked",
                id: 2,
                title: "What computer-lovers should read",
                user: "Goyangineun Yaong",
                author: "Alpha",
                date: "2019-11-05",
                likeCount: 14,
                replyCount: 2,
            },
            {
                type: "Paper",
                source: "liked",
                authors: "Espitau Thomas, Joux Antonie",
                id: 3,
                paperId: 3,
                date: "2019-11-06",
                title: "CERTIFIED LATTICE REDUCTION",
                user: "Ha",
                likeCount: 0,
                reviewCount: 1,
                keywords: "Combinational optimization Problems, Facility Layout Problem, Quadratic Assignment Problem",
            },
            {
                type: "Review",
                source: "wrote",
                id: 4,
                title: "Best way to go to sleep",
                user: "Uluk",
                author: "Girin",
                date: "2019-10-31",
                likeCount: 75,
                replyCount: 12,
            }],
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
        const feedsLeft = this.state.feeds.filter((x) => this.state.feeds.indexOf(x) % 2 === 0)
            .map((feed) => this.feedMaker(feed));
        const feedsRight = this.state.feeds.filter((x) => this.state.feeds.indexOf(x) % 2 === 1)
            .map((feed) => this.feedMaker(feed));

        return (
            <div className="main">
                <div className="feeds">
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
