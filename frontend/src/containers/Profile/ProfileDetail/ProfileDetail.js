import React, { Component } from "react";
import {
    Button, Image, Tabs, Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import { connect } from "react-redux";

import {
    CollectionCard, ReviewCard,
} from "../../../components";

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

    cardMaker = (card) => {
        if (card.type === "Collection") {
            return (
                <CollectionCard
                  key={card.id}
                  source={card.source}
                  id={card.id}
                  user={card.user}
                  title={card.title}
                  paperCount={card.paperCount}
                  replyCount={card.replyCount}
                  headerExists={false}
                />
            );
        } if (card.type === "Review") {
            return (
                <ReviewCard
                  key={card.id}
                  author={card.author}
                  paperId={card.paperId}
                  source={card.source}
                  id={card.id}
                  user={card.user}
                  title={card.title}
                  date={card.date}
                  likeCount={card.likeCount}
                  replyCount={card.replyCount}
                  headerExists={card.headerExists}
                />
            );
        }
        return 0;
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
            .map((collection) => this.cardMaker(collection));

        const collectionCardsRight = this.props.thisUserCollections
            .filter((x) => this.props.thisUserCollections.indexOf(x) % 2 === 1)
            .map((collection) => this.cardMaker(collection));

        const reviewCardsLeft = this.props.thisUserReviews
            .filter((x) => this.props.thisUserReviews.indexOf(x) % 2 === 0)
            .map((review) => this.cardMaker(review));

        const reviewCardsRight = this.props.thisUserReviews
            .filter((x) => this.props.thisUserReviews.indexOf(x) % 2 === 1)
            .map((review) => this.cardMaker(review));

        return (
            <div className="ProfileDetail">
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
                                <h5 id="followerCount">{this.props.thisUser.followersCount}</h5>
                                <h5 id="followerText">Follower</h5>
                            </Link>
                            <Link id="followingStat" to={`/profile/${this.props.thisUser.id}/followings`}>
                                <h5 id="followingCount">{this.props.thisUser.followingsCount}</h5>
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
        followersCount: PropTypes.number,
        followingsCount: PropTypes.number,
        doIFollow: false,
    }),
    // thisUserCollections: PropTypes.arrayOf(PropTypes.instanceOf(Collection))
    thisUserCollections: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.string,
        id: PropTypes.number,
        user: PropTypes.string,
        title: PropTypes.string,
        paperCount: PropTypes.number,
        replyCount: PropTypes.number,
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
        likeCount: PropTypes.number,
        replyCount: PropTypes.number,
        headerExists: PropTypes.bool,
    })),
};

ProfileDetail.defaultProps = {
    currentUserID: 1,
    thisUser: {
        id: 1,
        name: "Girin",
        description: "Kneel before me human, as I am the mighty and cute cat!",
        followersCount: 12,
        followingsCount: 47,
        doIFollow: false,
    },
    thisUserCollections: [
        {
            source: "tested",
            id: 1,
            type: "Collection",
            user: "Girin",
            title: "Girin's Paper Collection",
            paperCount: 32,
            replyCount: 13,
        },
        {
            source: "tasted",
            id: 2,
            type: "Collection",
            user: "Girin",
            title: "Papers for tasty cat cans",
            paperCount: 4,
            replyCount: 1,
        },
        {
            source: "hated",
            id: 3,
            type: "Collection",
            user: "Girin",
            title: "Butler's Bad joke collection",
            paperCount: 62,
            replyCount: 23,
        },
    ],
    thisUserReviews: [
        {
            author: "Girin",
            paperId: 1,
            type: "Review",
            source: "loved",
            id: 1,
            user: "Girin",
            title: "Ciao Churu is my favorite snack!",
            date: "Jan 24th, 2019",
            replyCount: 6,
            likeCount: 56,
            headerExists: false,
        },
        {
            author: "Girin",
            paperId: 12,
            source: "liked",
            type: "Review",
            id: 2,
            user: "Kamui",
            title: "Kamui is my brother!",
            date: "Feb 14, 2018",
            replyCount: 7,
            likeCount: 84,
            headerExists: false,
        },
        {
            author: "Girin",
            paperId: 100,
            type: "Review",
            source: "reluctantly accepted",
            id: 3,
            user: "Butler",
            title: "Bring me tasty food Ningen!",
            date: "March 7, 2018",
            replyCount: 8,
            likeCount: 35,
            headerExists: false,
        },
    ],
};

export default ProfileDetail;
