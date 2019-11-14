import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { PaperSpec, ReviewCard } from "../../components";
import { paperActions, reviewActions } from "../../store/actions";
import { paperStatus, reviewStatus } from "../../constants/constants";
import "./PaperDetail.css";

class PaperDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likeCount: 0,
            /* eslint-disable react/no-unused-state */
            reviewCount: 0,
            /* eslint-enable react/no-unused-state */
            authors: [],
            keywords: [],
            date: "",
            reviews: [],
        };
        this.reviewMaker = this.reviewMaker.bind(this);
        this.handleClickReviewAddButton = this.handleClickReviewAddButton.bind(this);
    }

    componentDidMount() {
        this.props.onGetPaper({ id: this.props.location.pathname.split("=")[1] })
            .then(() => {
                if (this.props.getPaperStatus === paperStatus.FAILURE) {
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
                    this.setState({ authors: this.props.selectedPaper.authors });
                }
                if (this.props.selectedPaper.publication) {
                    this.setState({ date: this.props.selectedPaper.publication.date });
                }
                if (this.props.selectedPaper.keywords) {
                    this.setState({ keywords: this.props.selectedPaper.keywords });
                }
            })
            .catch(() => {});

        this.props.onGetReviewsByPaper({ id: this.props.location.pathname.split("=")[1] })
            .then(() => {
                if (this.props.reviewList.status === reviewStatus.SUCCESS) {
                    this.setState({
                        reviews: this.props.reviewList.list,
                    });
                } else {
                    this.props.history.push("/main");
                }
            })
            .catch(() => {});
    }

    reviewMaker = (review) => (
        <ReviewCard
          key={review.id}
          id={review.id}
          paperId={review.paper.id}
          author={review.user.username}
          title={review.title}
          likeCount={review.count.likes}
          replyCount={review.count.replies}
          headerExists={false}
        />
    )

    handleClickReviewAddButton() {
        return this.props.history.push(`/paper_id=${this.props.location.pathname.split("=")[1]}/create`);
    }

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
                          authors={this.state.authors}
                          keywords={this.state.keywords}
                          likeCount={this.state.likeCount}
                          reviewCount={this.state.reviews.length}
                          isLiked={this.props.selectedPaper.liked}
                          addButtonExists
                          history={this.props.history}
                        />
                        <div className="up-review">
                            <h3 id="review-count">{this.state.reviews.length} reviews</h3>
                            <Button className="review-add" onClick={this.handleClickReviewAddButton}>Add</Button>
                        </div>
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
    reviewList: state.review.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetPaper: (paperId) => dispatch(paperActions.getPaper(paperId)),
    onGetReviewsByPaper: (paperId) => dispatch(reviewActions.getReviewsByPaperId(paperId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail);

PaperDetail.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    onGetPaper: PropTypes.func,
    getPaperStatus: PropTypes.string,
    selectedPaper: PropTypes.objectOf(PropTypes.any),
    reviewList: PropTypes.objectOf(PropTypes.any),
    onGetReviewsByPaper: PropTypes.func,
};

PaperDetail.defaultProps = {
    history: null,
    location: null,
    onGetPaper: null,
    getPaperStatus: paperStatus.NONE,
    selectedPaper: {},
    reviewList: null,
    onGetReviewsByPaper: () => {},
};
