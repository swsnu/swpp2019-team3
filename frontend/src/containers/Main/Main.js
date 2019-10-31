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
                numPapers: 14,
                numReplies: 15,
            }, {
                type: "Review",
                source: "liked",
                key: 1,
                id: 3,
                title: "dfad",
                user: "Dfafdaf",
                numPapers: 14,
                numReplies: 15,
            },
            {
                type: "Paper",
                source: "liked",
                key: 1,
                id: 2,
                title: "dfad",
                user: "Dfafdaf",
                numPapers: 14,
                numReplies: 15,
            }],
        };
    }

    render() {
        const feedsLeft = this.state.feeds.filter((x) => this.state.feeds.indexOf(x) % 2 === 0)
            .map((feed) => {
                if (feed.type === "Collection") {
                    return (
                        <CollectionCard
                          source={feed.source}
                          key={feed.id}
                          id={feed.id}
                          title={feed.title}
                          user={feed.user}
                          numReplies={feed.numReplies}
                          numPapers={feed.numPapers}
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
                          numReplies={feed.numReplies}
                        />
                    );
                }
                return 0;
            });
        const feedsRight = this.state.feeds.filter((x) => this.state.feeds.indexOf(x) % 2 === 1)
            .map((feed) => {
                if (feed.type === "Collection") {
                    return (
                        <CollectionCard
                          source={feed.source}
                          key={feed.id}
                          id={feed.id}
                          title={feed.title}
                          user={feed.user}
                          numPapers={feed.numPapers}
                          numReplies={feed.numReplies}
                        />
                    );
                }
                if (feed.type === "Review") {
                    return (
                        <ReviewCard
                          source={feed.source}
                          paperId={feed.paperId}
                          key={feed.id}
                          author={feed.author}
                          id={feed.id}
                          title={feed.title}
                          user={feed.user}
                          date={feed.date}
                          numReplies={feed.numReplies}
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
                          numReplies={feed.numReplies}
                        />
                    );
                }
                return 0;
            });

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
