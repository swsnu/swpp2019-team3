import React, { Component } from "react";

import {
    SideBar, CollectionCard, ReviewCard, PaperCard, Header,
} from "../../components";
import "./Main.css";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feeds: [{
                type: "Collection",
                source: "liked",
                id: 1,
                title: "dfad",
                user: "Dfafdaf",
                paperCount: 14,
                replyCount: 15,
                likeCount: 30,
            }, {
                type: "Review",
                source: "liked",
                key: 1,
                id: 3,
                title: "dfad",
                user: "Dfafdaf",
                likeCount: 14,
                replyCount: 15,
            },
            {
                type: "Paper",
                source: "liked",
                key: 1,
                id: 3,
                paperId: 1,
                title: "dfad",
                user: "Dfafdaf",
                likeCount: 14,
                reviewCount: 15,
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
                  id={feed.id}
                  user={feed.user}
                  title={feed.title}
                  authors={feed.authors}
                  date={feed.date}
                  keywords={feed.keywords}
                  likeCount={feed.likeCount}
                  reviewCount={feed.reviewCount}
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
                <Header />
                <SideBar />
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
