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
            reviewCount: 0,
            authors: [],
            keywords: [],
            date: "",
            reviews: [],
        };

        this.review = React.createRef();
        this.getReviewsTrigger = this.getReviewsTrigger.bind(this);
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
                    this.setState({ reviewCount: this.props.selectedPaper.count.reviews });
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
                if (this.props.location.state != null && this.props.location.state === "review") {
                    window.scrollTo(this.review.current.offsetTop);
                }
            })
            .catch(() => {});

        this.getReviewsTrigger(0);
    }

    getReviewsTrigger(pageNum) {
        this.props.onGetReviewsByPaper(this.props.location.pathname.split("=")[1], pageNum + 1)
            .then(() => {
                if (this.props.getReviewStatus === reviewStatus.SUCCESS) {
                    const { reviews } = this.state;
                    this.setState({
                        reviews: reviews.concat(this.props.reviewList),
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
          author_id={review.user.id}
          title={review.title}
          isLiked={review.liked}
          likeCount={review.count.likes}
          replyCount={review.count.replies}
          headerExists={false}
          anonymous={review.is_anonymous}
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

        let link = "";
        if (this.props.selectedPaper.download_url) {
            link = this.props.selectedPaper.download_url;
        } else if (this.props.selectedPaper.file_url) {
            link = this.props.selectedPaper.file_url;
        }

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
                          reviewCount={this.state.reviewCount}
                          isLiked={this.props.selectedPaper.liked}
                          link={link}
                          addButtonExists
                          abstractfoldExists
                          foldingNum={500}
                          history={this.props.history}
                        />
                        <div className="up-review" ref={this.review}>
                            <h3 id="review-count">{this.state.reviewCount} reviews</h3>
                            <Button className="review-add" onClick={this.handleClickReviewAddButton}>Create</Button>
                        </div>
                        <div className="reviewcards">
                            <div className="reviewcards-left">{reviewCardsLeft}</div>
                            <div className="reviewcards-right">{reviewCardsRight}</div>
                        </div>
                        { this.props.reviewFinished ? null
                            : (
                                <Button
                                  className="review-more-button"
                                  onClick={() => this.getReviewsTrigger(
                                      this.props.reviewPageNum,
                                  )}
                                  size="lg"
                                  block
                                >
                            View More
                                </Button>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    getPaperStatus: state.paper.getPaperStatus,
    selectedPaper: state.paper.selectedPaper,
    reviewList: state.review.list.list,
    getReviewStatus: state.review.list.status,
    reviewPageNum: state.review.list.pageNum,
    reviewFinished: state.review.list.finished,
});

const mapDispatchToProps = (dispatch) => ({
    onGetPaper: (paperId) => dispatch(paperActions.getPaper(paperId)),
    onGetReviewsByPaper: (paperId, pageNum) => dispatch(
        reviewActions.getReviewsByPaperId(paperId, pageNum),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail);

PaperDetail.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    onGetPaper: PropTypes.func,
    getPaperStatus: PropTypes.string,
    getReviewStatus: PropTypes.string,
    selectedPaper: PropTypes.objectOf(PropTypes.any),
    reviewList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    onGetReviewsByPaper: PropTypes.func,
    reviewPageNum: PropTypes.number,
    reviewFinished: PropTypes.bool,
};

PaperDetail.defaultProps = {
    history: null,
    location: null,
    onGetPaper: null,
    getPaperStatus: paperStatus.NONE,
    getReviewStatus: reviewStatus.NONE,
    selectedPaper: {},
    reviewList: [],
    onGetReviewsByPaper: () => {},
    reviewPageNum: 0,
    reviewFinished: true,
};
