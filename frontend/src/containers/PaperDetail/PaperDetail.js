import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes, { any } from "prop-types";

import { PaperSpec, ReviewCard } from "../../components";
import { paperActions } from "../../store/actions";
import { getPaperStatus } from "../../store/reducers/paper";
import "./PaperDetail.css";

class PaperDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likeCount: 0,
            /* eslint-disable react/no-unused-state */
            reviewCount: 0,
            /* eslint-enable react/no-unused-state */
            authorNames: "",
            keywords: "",
            date: "",
            reviews: [
                {
                    id: 5,
                    paperId: 1,
                    title: "review_title1",
                    author: "review_author1",
                    likeCount: 5,
                    replyCount: 15,
                },
                {
                    id: 6,
                    paperId: 1,
                    title: "review_title2",
                    author: "review_author2",
                    likeCount: 3,
                    replyCount: 10,
                },
                {
                    id: 7,
                    paperId: 1,
                    title: "review_title3",
                    author: "review_author3",
                    likeCount: 4,
                    replyCount: 100,
                },
            ],
        };
        this.reviewMaker = this.reviewMaker.bind(this);
    }

    componentDidMount() {
        this.props.onGetPaper({ id: this.props.location.pathname.split("=")[1] })
            .then(() => {
                if (this.props.getPaperStatus === getPaperStatus.FAILURE) {
                    this.props.history.push("/main");
                    return;
                }
                if (this.props.selectedPaper.count) {
                    this.setState({ likeCount: this.props.selectedPaper.count.likes });
                    /* eslint-disable react/no-unused-state */
                    this.setState({ reviewCount: this.props.selectedPaper.count.reviews });
                    /* eslint-enable react/no-unused-state */
                }
                if (this.props.selectedPaper.authors) {
                    const { authors } = this.props.selectedPaper;
                    const authorNames = authors.map((author) => `${author.first_name} ${author.last_name}`);
                    this.setState({ authorNames: authorNames.join(", ") });
                }
                if (this.props.selectedPaper.publication) {
                    this.setState({ date: this.props.selectedPaper.publication.date });
                    this.setState({ keywords: "Combinational optimization Problems, Facility Layout Problem, Quadratic Assignment Problem" });
                }
                // FIXME: Please uncomment this block if onGetPaper can get keywords
                /* if (this.props.selectedPaper.keywords) {
                    this.setState({ keywords: this.props.selectedPaper.keywords.join(", ") });
                } */
            });
    }

    reviewMaker = (review) => (
        <ReviewCard
          key={review.id}
          id={review.id}
          paperId={review.paperId}
          author={review.author}
          title={review.title}
          date={review.date}
          likeCount={review.likeCount}
          replyCount={review.replyCount}
          headerExists={false}
        />
    )

    render() {
        const reviewCardsLeft = this.state.reviews
            .filter((x) => this.state.reviews.indexOf(x) % 2 === 0)
            .map((review) => this.reviewMaker(review));

        const reviewCardsRight = this.state.reviews
            .filter((x) => this.state.reviews.indexOf(x) % 2 === 1)
            .map((review) => this.reviewMaker(review));

        return (
            <div className="paperdetail-page">
                <div className="paperdetail">
                    <div className="paperdetail-content">
                        <PaperSpec
                          id={this.props.selectedPaper.id}
                          title={this.props.selectedPaper.title}
                          abstract={this.props.selectedPaper.abstract}
                          date={this.state.date}
                          authors={this.state.authorNames}
                          keywords={this.state.keywords}
                          likeCount={this.state.likeCount}
                          isLiked={this.props.selectedPaper.liked}
                          addButtonExists
                        />
                        {/* FIXME: review-count should reflect this.state.reviewCount */}
                        <h3 id="review-count">{this.state.reviews.length} reviews</h3>
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
const mapStateToProps = (state) => ({
    getPaperStatus: state.paper.getPaperStatus,
    selectedPaper: state.paper.selectedPaper,
});

const mapDispatchToProps = (dispatch) => ({
    onGetPaper: (paperId) => dispatch(paperActions.getPaper(paperId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail);

PaperDetail.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(any),
    onGetPaper: PropTypes.func,
    getPaperStatus: PropTypes.string,
    selectedPaper: PropTypes.objectOf(any),
};

PaperDetail.defaultProps = {
    history: null,
    location: null,
    onGetPaper: null,
    getPaperStatus: getPaperStatus.NONE,
    selectedPaper: {},
};
