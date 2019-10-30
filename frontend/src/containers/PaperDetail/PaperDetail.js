import React, { Component } from "react";

import { PaperSpec, ReviewCard } from "../../components";
import "./PaperDetail.css";

class PaperDetail extends Component {
    state = {
        id: 1,
        title: "paper_title",
        abstract: "abstract abstract abstract abstract abstract abstract abstract abstract ",
        date: "2019.10.30.",
        authors: "paper_authors",
        keywords: "paper_keywords",
        likeCount: 101,
        reviewCount: 2,
        reivews: [
            {
                id: 5,
                paperId: 1,
                title: "review_title1",
                author: "review_author1",
                numReplies: 15
            },
            {
                id: 6,
                paperId: 1,
                title: "review_title2",
                author: "review_author2",
                numReplies: 10
            }
        ]
    }

    componentDidMount() {

    }

    render() {
        let reviewRows = this.state.reivews.map(review => {
            return (
                <ReviewCard
                    key={review.id}
                    id={review.id}
                    paperId={review.paperId}
                    author={review.author}
                    title={review.title}
                    date={review.date}
                />
            );
        })

        return (
            <div className="PaperDetail">
                <PaperSpec
                    id={this.state.id}
                    title={this.state.title}
                    abstract={this.state.abstract}
                    date={this.state.date}
                    authors={this.state.authors}
                    keywords={this.state.keywords}
                />
                <h3 id="reviewCount">reviewCount:{this.state.reviewCount}</h3>
                <div className="reviewRows">{reviewRows}</div>
            </div>
        );
    }
}
export default PaperDetail;