import React, { Component } from "react";

import { Header, SideBar, PaperSpec, ReviewCard } from "../../components";
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
        reviews: [
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
            },
            {
                id: 7,
                paperId: 1,
                title: "review_title3",
                author: "review_author3",
                numReplies: 100
            }
        ]
    }

    componentDidMount() {

    }

    render() {
        let reviewCardsLeft = this.state.reviews.filter(x => this.state.reviews.indexOf(x) % 2 === 0)
            .map(review => {
                return (
                    <ReviewCard
                        key={review.id}
                        id={review.id}
                        paperId={review.paperId}
                        author={review.author}
                        title={review.title}
                        date={review.date}
                        numReplies={review.numReplies}
                        headerExists={false}
                    />
                );
            });

        let reviewCardsRight = this.state.reviews.filter(x => this.state.reviews.indexOf(x) % 2 === 1)
            .map(review => {
                return (
                    <ReviewCard
                        key={review.id}
                        id={review.id}
                        paperId={review.paperId}
                        author={review.author}
                        title={review.title}
                        date={review.date}
                        numReplies={review.numReplies}
                        headerExists={false}
                    />
                );
            });

        return (
            <div className="paperdetail-page">
                <Header />
                <SideBar />
                <div className="paperdetail">
                    <div className="paperdetail-content">
                        <PaperSpec
                            id={this.state.id}
                            title={this.state.title}
                            abstract={this.state.abstract}
                            date={this.state.date}
                            authors={this.state.authors}
                            keywords={this.state.keywords}
                            reviewCount={this.state.reviewCount}
                        />
                        <div className="reviewcards">
                            <div className="reviewcards-left">{reviewCardsLeft}</div>
                            <div className="reviewcards-right">{reviewCardsRight}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default PaperDetail;