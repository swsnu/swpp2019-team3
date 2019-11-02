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

import "./ProfileDetail.css";
import SamplePhoto from "./sample.jpg";
// import * as actionCreators from "../../../store/actions/index";

class ProfileDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doIFollow: this.props.thisUser.doIFollow,
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

        const collectionCardsLeft = this.props.thisUserCollections
            .filter((x) => this.props.thisUserCollections.indexOf(x) % 2 === 0)
            .map((collection) => (
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

        const collectionCardsRight = this.props.thisUserCollections
            .filter((x) => this.props.thisUserCollections.indexOf(x) % 2 === 1)
            .map((collection) => (
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
        const reviewCardsLeft = this.props.thisUserReviews
            .filter((x) => this.props.thisUserReviews.indexOf(x) % 2 === 0)
            .map((review) => (
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

        const reviewCardsRight = this.props.thisUserReviews
            .filter((x) => this.props.thisUserReviews.indexOf(x) % 2 === 1)
            .map((review) => (
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
                        <div className="userStatistic">
                            <div className="userPhotoName">
                                <Image id="userPhoto" src={SamplePhoto} width={150} height={150} roundedCircle />
                                <h2 id="userName">{this.props.thisUser.name}</h2>
                            </div>
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
                        <div className="userDescAndButton">
                            <div id="buttonDisplayed">{buttonDisplayed}</div>
                            <p id="userDescription">{this.props.thisUser.description}</p>
                        </div>
                    </div>
                    <div className="itemTabSection">
                        <Tabs defaultActiveKey="collectionTab" id="itemTabs">
                            <Tab eventKey="collectionTab" title="Collections">
                                <div id="collectionCards">
                                    <div id="collectionCardsLeft">{collectionCardsLeft}</div>
                                    <div id="collectionCardsRight">{collectionCardsRight}</div>
                                </div>
                            </Tab>
                            <Tab eventKey="reviewTab" title="Reviews">
                                <div id="reviewCards">
                                    <div id="reviewCardsLeft">{reviewCardsLeft}</div>
                                    <div id="reviewCardsRight">{reviewCardsRight}</div>
                                </div>
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
        name: "Girin",
        description: "Kneel before me human, as I am the mighty and cute cat!",
        followersNum: 12,
        followingsNum: 47,
        doIFollow: false,
    },
    thisUserCollections: [
        {
            source: "tested",
            id: 1,
            user: "Girin",
            title: "Girin's Paper Collection",
            numPapers: 32,
            numReplies: 13,
        },
        {
            source: "tasted",
            id: 2,
            user: "Girin",
            title: "Papers for tasty cat cans",
            numPapers: 4,
            numReplies: 1,
        },
        {
            source: "hated",
            id: 3,
            user: "Girin",
            title: "Butler's Bad joke collection",
            numPapers: 62,
            numReplies: 23,
        },
    ],
    thisUserReviews: [
        {
            author: "Girin",
            paperId: 1,
            source: "loved",
            id: 1,
            user: "Girin",
            title: "Ciao Churu is my favorite snack!",
            date: "Jan 24th, 2019",
            numReplies: 6,
        },
        {
            author: "Girin",
            paperId: 12,
            source: "liked",
            id: 2,
            user: "Kamui",
            title: "Kamui is my brother!",
            date: "Feb 14, 2018",
            numReplies: 7,
        },
        {
            author: "Girin",
            paperId: 100,
            source: "reluctantly accepted",
            id: 3,
            user: "Butler",
            title: "Bring me tasty food Ningen!",
            date: "March 7, 2018",
            numReplies: 8,
        },
    ],
};

export default ProfileDetail;
