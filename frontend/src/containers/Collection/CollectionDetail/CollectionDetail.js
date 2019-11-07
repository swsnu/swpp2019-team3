import React, { Component } from "react";
import {
    Button, Tabs, Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
    PaperCard, Reply,
} from "../../../components";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";

import "./CollectionDetail.css";

class CollectionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getCollectionStatus: collectionStatus.NONE,
            papers: [],
            replies: [],
            isLiked: false,
            members: [],
            likeCount: 0,
            paperCount: 0,
            userCount: 0,
            replyCount: 0,
            description: "",
            newReplyContent: "",
            thisCollection: {
                id: 2,
                name: "Papers for tasty cat cans",
                description: "Girin the Intelligent Cat's Paper Collection!",
                creationDate: "2019-11-07",
                lastUpdateDate: "2019-11-07",
                papers: [
                    {
                        source: "recently added",
                        id: 1,
                        user: "Girin",
                        title: "CERTIFIED LATTICE REDUCTION",
                        date: "2020-02-01",
                        authors: "Espitau Thomas, Joux Antoine",
                        keywords: "Combinational optimization Problems, Facility Layout Problem, Quadratic Assignment Problem",
                        likeCount: 3,
                        reviewCount: 6,
                        isLiked: false,
                    },
                    // {
                    //     source: "added",
                    //     id: 1,
                    //     user: "Testing Module",
                    //     title: "title:test",
                    //     date: "2020",
                    //     authors: "author:test",
                    //     keywords: "keywords:test",
                    //     likeCount: 3,
                    //     reviewCount: 6,
                    //     isLiked: false,
                    // },
                    // {
                    //     source: "added",
                    //     id: 2,
                    //     user: "Testing Module",
                    //     title: "title:test2",
                    //     date: "date:111111",
                    //     authors: "author:test",
                    //     keywords: "keywords:test",
                    //     likeCount: 3,
                    //     reviewCount: 6,
                    //     isLiked: false,
                    // },
                    // {
                    //     source: "added",
                    //     id: 3,
                    //     user: "Testing Module",
                    //     title: "title:test3",
                    //     date: "date:111111",
                    //     authors: "author:test",
                    //     keywords: "keywords:test",
                    //     likeCount: 3,
                    //     reviewCount: 6,
                    //     isLiked: false,
                    // },
                    // {
                    //     source: "added",
                    //     id: 4,
                    //     user: "Testing Module",
                    //     title: "title:test4",
                    //     date: "date:111111",
                    //     authors: "author:test",
                    //     keywords: "keywords:test",
                    //     likeCount: 3,
                    //     reviewCount: 6,
                    //     isLiked: false,
                    // },
                ],
                members: [
                    // "Anna",
                    // "Betty",
                    // "Charlie",
                    // "Dophio",
                    // "Emily",
                ],
                replies: [
                    // {
                    //     content: "asdf",
                    //     author: "qwer",
                    //     authorId: 1,
                    //     isLiked: false,
                    //     likeCount: 3,
                    // },
                    // {
                    //     content: "dsaf",
                    //     author: "zvcx",
                    //     authorId: 2,
                    //     isLiked: false,
                    //     likeCount: 7,
                    // },
                    // {
                    //     content: "rtyui",
                    //     author: "asfd",
                    //     authorId: 3,
                    //     isLiked: false,
                    //     likeCount: 9,
                    // },
                ],
                likesCount: 15,
                isLiked: false,
                amIMember: true,
            },
        };
    }

    componentDidMount() {
        this.props.onGetCollection({ id: this.props.location.pathname.split("=")[1] })
            .then(() => {
                if (this.props.selectedCollection.count) {
                    this.setState({ userCount: this.props.selectedCollection.count.users });
                    /* eslint-disable react/no-unused-state */
                    this.setState({ paperCount: this.props.selectedCollection.count.papers });
                    /* eslint-enable react/no-unused-state */
                }

                // FIXME: Please uncomment this block if onGetPaper can get keywords
                /* if (this.props.selectedPaper.keywords) {
                    this.setState({ keywords: this.props.selectedPaper.keywords.join(", ") });
                } */
            });
        this.props.onGetCollectionPapers({ id: this.props.location.pathname.split("=")[1] })
            .then(() => {
                this.setState({ papers: this.props.storedPapers });
            });
    }

    // clickInviteButtonHandler(): Open ‘Invite to the collection’ popup.

    // clickRemovePaperButtonHandler(collection_id: number, paper_id: number)
    // : Call onRemoveCollectionPaper of CollectionDetail to remove the paper from the collection.

    // clickLikeButtonHandler(collection_id: number, user_id: number)
    // : Call onAddCollectionLike of CollectionDetail to change the like status
    // between the user and the collection.
    clickLikeButtonHandler = () => {
        this.setState({ isLiked: true });
    }

    // clickUnlikeButtonHandler(collection_id: number, user_id: number)
    // : Call onRemoveCollectionLike of CollectionDetail to change the like status
    // between the user and the collection.
    clickUnlikeButtonHandler = () => {
        this.setState({ isLiked: false });
    }

    addNewReplyHandler = () => {
        // should be fixed
        const newReply = {
            content: this.state.newReplyContent,
            author: this.props.currentUserName,
            authorId: this.props.currentUserID,
            isLiked: false,
            likeCount: 0,
        };
        this.state.replies.concat(newReply);
    }

    paperCardMaker = (paper) => (
        <PaperCard
          key={paper.id}
          source={paper.source}
          id={paper.id}
          user={paper.user}
          title={paper.title}
          date={paper.date}
          authors={paper.authors}
          keywords={paper.keywords}
          likeCount={paper.likeCount}
          reviewCount={paper.reviewCount}
          isLiked={paper.isLiked}
          headerExists={false}
        />
    )

    render() {
        const likeButton = <Button id="likeButton" onClick={() => this.clickLikeButtonHandler()}>Like</Button>;
        const unlikeButton = <Button id="unlikeButton" onClick={() => this.clickUnlikeButtonHandler()}>Unlike</Button>;
        const likeOrUnlike = this.state.isLiked ? unlikeButton : likeButton;
        const inviteButton = <Button id="inviteButton">Invite</Button>;
        const editButton = (
            <Link id="editButtonLink" to={`/collection_id=${this.state.id}/edit/`}>
                <Button id="editButton">Edit</Button>
            </Link>
        );

        const paperCardsLeft = this.state.papers
            .filter((x) => this.state.papers.indexOf(x) % 2 === 0)
            .map((paper) => this.paperCardMaker(paper));

        const paperCardsRight = this.state.papers
            .filter((x) => this.state.papers.indexOf(x) % 2 === 1)
            .map((paper) => this.paperCardMaker(paper));

        const replies = this.state.replies.map((reply) => (
            <Reply
              key={reply.content} // shoud be fixed
              content={reply.content}
              author={reply.author}
              authorId={reply.authorId}
              isLiked={reply.isLiked}
              likeCount={reply.likeCount}
            />
        ));

        return (
            <div className="CollectionDetail">
                <div className="CollectionDetailContent">
                    <div className="head">COLLECTION</div>
                    <div className="CollectionInfo">
                        <div id="collectionName">
                            <h2 id="collectionName">{this.props.selectedCollection.title}</h2>
                        </div>
                        <div id="collectionInfoMid">
                            <div id="likeStat">
                                <h5 id="likeCount">{this.state.likeCount}</h5>
                                <h5 id="likeText">Likes</h5>
                            </div>
                            <div id="memberStat">
                                <h5 id="memberCount">{this.state.userCount}</h5>
                                <h5 id="memberText">Members</h5>
                            </div>
                            <div id="collectionButtons">
                                {likeOrUnlike}
                                {inviteButton}
                                {editButton}
                            </div>
                        </div>
                        <div id="collectionDescription">
                            <div id="date">
                                <div id="creationDate">Created: {this.state.thisCollection.creationDate}</div>
                                <div id="lastUpdateDate">Last Update: {this.state.thisCollection.lastUpdateDate}</div>
                            </div>
                            <p id="descriptionBox">{this.props.selectedCollection.text}</p>
                        </div>
                    </div>
                    <div className="itemList">
                        <Tabs defaultActiveKey="paperTab" id="itemTabs">
                            <Tab eventKey="paperTab" title="Papers">
                                <div id="paperCards">
                                    <div id="paperCardsLeft">{paperCardsLeft}</div>
                                    <div id="paperCardsRight">{paperCardsRight}</div>
                                </div>
                            </Tab>
                            <Tab className="reply-tab" eventKey="replyTab" title="Replies">
                                <div id="replies">
                                    <div id="createNewReply">
                                        <textarea
                                          id="newReplyContentInput"
                                          type="text"
                                          value={this.state.newReplyContent}
                                          onChange={(event) => this.setState({
                                              newReplyContent: event.target.value,
                                          })}
                                        />
                                        <Button onClick={this.addNewReplyHandler()}>Add</Button>
                                    </div>
                                    <div id="replyList">
                                        {replies}
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    getCollectionStatus: state.paper.getPaperStatus,
    selectedCollection: state.collection.selected.collection,
    storedPapers: state.collection.selected.papers,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollection: (collectionId) => dispatch(collectionActions.getCollection(collectionId)),
    onGetCollectionPapers: (collectionId) => dispatch(collectionActions.getCollectionPapers(collectionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetail);

CollectionDetail.propTypes = {
    currentUserID: PropTypes.number,
    currentUserName: PropTypes.string,
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    onGetCollection: PropTypes.func,
    onGetCollectionPapers: PropTypes.func,
    getCollectionStatus: PropTypes.string,
    selectedCollection: PropTypes.objectOf(PropTypes.any),
    storedPapers: PropTypes.array,
};

CollectionDetail.defaultProps = {
    currentUserID: 1,
    currentUserName: "Girin",
    history: null,
    location: null,
    onGetCollection: null,
    onGetCollectionPapers: null,
    getCollectionStatus: collectionStatus.NONE,
    selectedCollection: {},
    storedPapers: [],
};
