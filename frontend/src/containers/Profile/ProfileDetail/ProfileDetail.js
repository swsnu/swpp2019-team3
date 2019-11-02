import React, { Component } from "react";
import {
    Button, Image, Tabs, Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import { connect } from "react-redux";

import { SideBar, Header } from "../../../components";
import CollectionCard from "../../../components/Collection/CollectionCard/CollectionCard";
import ReviewCard from "../../../components/Review/ReviewCard/ReviewCard";

// import * as actionCreators from "../../../store/actions/index";

class ProfileDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doIFollow: this.props.thisUser.doIFollow,
            seletedTab: "collection",
        };
    }

    render() {
        const editButton = (
            <Link to={`/profile/${this.props.thisUser.id}/edit`}>
                <Button id="editButton">Edit</Button>
            </Link>
        );
        const followButton = <Button id="followButton" onClick={() => this.setState({ doIFollow: true })}>Follow</Button>;
        const unfollowButton = <Button id="unfollowButton" onClick={() => this.setState({ doIFollow: false })}>Unfollow</Button>;
        // only one button will be displayed among "edit", "follow", and "unfollow" buttons
        let buttonDisplayed;
        if (this.props.currentUserID === this.props.thisUser.id) {
            buttonDisplayed = editButton;
        } else if (this.state.doIFollow) {
            buttonDisplayed = unfollowButton;
        } else {
            buttonDisplayed = followButton;
        }

        const collectionCards = this.props.thisUserCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              source={collection.source}
              id={collection.id}
              user={collection.user}
              title={collection.title}
              numPapers={collection.numPapers}
              numReplies={collection.numReplies}
            />
        ));

        const reviewCards = this.props.thisUserReviews.map((review) => (
            <ReviewCard
              key={review.id}
              author={review.author}
              paperId={review.paperId}
              source={review.source}
              id={review.id}
              user={review.user}
              title={review.title}
              date={review.date}
              numReplies={review.numReplies}
            />
        ));

        return (
            <div className="ProfileDetail">
                <Header id="Header" />
                <SideBar id="SideBar" />
                <div className="ProfileDetailContent">
                    <div className="userInfo">
                        <Image id="userPhoto" src="sample.jpeg" rounded />
                        <div className="userStatistic">
                            <div id="collectionStat">
                                <h5 id="collectionCount">{this.props.thisUserCollections.length}</h5>
                                <h5 id="collectionText">Collections</h5>
                            </div>
                            <div id="reviewStat">
                                <h5 id="reviewCount">{this.props.thisUserReviews.length}</h5>
                                <h5 id="reviewText">Reviews</h5>
                            </div>
                            <Link id="followerStat" to={`/profile/${this.props.thisUser.id}/followers`}>
                                <h5 id="followerCount">{this.props.thisUser.followersNum}</h5>
                                <h5 id="followerText">Follower</h5>
                            </Link>
                            <Link id="followingStat" to={`/profile/${this.props.thisUser.id}/followings`}>
                                <h5 id="followingCount">{this.props.thisUser.followingsNum}</h5>
                                <h5 id="followingText">Following</h5>
                            </Link>
                        </div>
                        <div className="userText">
                            <h2 id="userName">{this.props.thisUser.name}</h2>
                            <div id="buttonDisplayed">{buttonDisplayed}</div>
                            <p id="userDescription">{this.props.thisUser.description}</p>
                        </div>
                    </div>
                    <div className="itemTabSection">
                        <Tabs defaultActiveKey="collectionTab" id="itemTabs">
                            <Tab eventKey="collectionTab" title="Collections">
                                {collectionCards}
                            </Tab>
                            <Tab eventKey="reviewTab" title="Reviews">
                                {reviewCards}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

ProfileDetail.propTypes = {
    currentUserID: PropTypes.number,
    thisUser: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        followersNum: PropTypes.number,
        followingsNum: PropTypes.number,
        doIFollow: false,
    }),
    // thisUserCollections: PropTypes.arrayOf(PropTypes.instanceOf(Collection))
    thisUserCollections: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.string,
        id: PropTypes.number,
        user: PropTypes.string,
        title: PropTypes.string,
        numPapers: PropTypes.number,
        numReplies: PropTypes.number,
    })),
    // thisUserCollections: PropTypes.arrayOf(PropTypes.instanceOf(Review))
    thisUserReviews: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string,
        paperId: PropTypes.number,
        source: PropTypes.string,
        id: PropTypes.number,
        user: PropTypes.string,
        title: PropTypes.string,
        date: PropTypes.string,
        numReplies: PropTypes.number,
    })),
};

ProfileDetail.defaultProps = {
    currentUserID: 1,
    thisUser: {
        id: 1,
        name: "Arthur",
        description: "I used to think my life was a tragedy...",
        followersNum: 12,
        followingsNum: 47,
        doIFollow: false,
    },
    thisUserCollections: [
        {
            source: "asdf",
            id: 1,
            user: "Arthur",
            title: "Arthur's Joke Collection",
            numPapers: 32,
            numReplies: 13,
        },
        {
            source: "asdf",
            id: 2,
            user: "Arthur",
            title: "Bad jokes collection",
            numPapers: 4,
            numReplies: 1,
        },
        {
            source: "asdf",
            id: 3,
            user: "Arthur",
            title: "Murray show collection",
            numPapers: 62,
            numReplies: 23,
        },
    ],
    thisUserReviews: [
        {
            author: "Arthur",
            paperId: 1,
            source: "asdf",
            id: 1,
            user: "zxcv",
            title: "why so serious?",
            date: "111111",
            numReplies: 6,
        },
        {
            author: "Arthur",
            paperId: 12,
            source: "qwer",
            id: 2,
            user: "1q2w3e4",
            title: "the white knight",
            date: "222222",
            numReplies: 7,
        },
        {
            author: "Arthur",
            paperId: 100,
            source: "zxcv",
            id: 3,
            user: "asdfsad",
            title: "killing joke",
            date: "333333",
            numReplies: 8,
        },
    ],
};

export default ProfileDetail;
