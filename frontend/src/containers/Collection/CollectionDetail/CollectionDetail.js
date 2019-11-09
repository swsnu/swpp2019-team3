import React, { Component } from "react";
import {
    Button, Tabs, Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
    PaperCard, Reply,
} from "../../../components";

import "./CollectionDetail.css";

class CollectionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newReplyContent: "",
            replies: this.props.thisCollection.replies,
            isLiked: this.props.thisCollection.isLiked,
        };
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
        />
    )

    render() {
        const likeButton = <Button id="likeButton" onClick={() => this.clickLikeButtonHandler()}>Like</Button>;
        const unlikeButton = <Button id="unlikeButton" onClick={() => this.clickUnlikeButtonHandler()}>Unlike</Button>;
        const likeOrUnlike = this.state.isLiked ? unlikeButton : likeButton;
        const inviteButton = <Button id="inviteButton">Invite</Button>;
        const editButton = (
            <Link id="editButtonLink" to={`/collections/${this.props.thisCollection.id}/edit/`}>
                <Button id="editButton">Edit</Button>
            </Link>
        );

        const paperCardsLeft = this.props.thisCollection.papers
            .filter((x) => this.props.thisCollection.papers.indexOf(x) % 2 === 0)
            .map((paper) => this.paperCardMaker(paper));

        const paperCardsRight = this.props.thisCollection.papers
            .filter((x) => this.props.thisCollection.papers.indexOf(x) % 2 === 1)
            .map((paper) => this.paperCardMaker(paper));

        const replies = this.props.thisCollection.replies.map((reply) => (
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
                    <div className="CollectionInfo">
                        <div id="collectionName">
                            <h2 id="collectionName">{this.props.thisCollection.name}</h2>
                        </div>
                        <div id="collectionInfoMid">
                            <div id="likeStat">
                                <h5 id="likeCount">{this.props.thisCollection.likesCount}</h5>
                                <h5 id="likeText">Likes</h5>
                            </div>
                            <div id="memberStat">
                                <h5 id="memberCount">{this.props.thisCollection.members.length}</h5>
                                <h5 id="memberText">Members</h5>
                            </div>
                            <div id="collectionButtons">
                                {likeOrUnlike}
                                {inviteButton}
                                {this.props.thisCollection.amIMember ? editButton : <div />}
                            </div>
                        </div>
                        <div id="collectionDescription">
                            <div id="date">
                                <div id="creationDate"><p>Created: {this.props.thisCollection.creationDate}</p></div>
                                <div id="lastUpdateDate"><p>Last Update: {this.props.thisCollection.lastUpdateDate}</p></div>
                            </div>
                            <p id="descriptionBox">{this.props.thisCollection.description}</p>
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
                            <Tab eventKey="replyTab" title="Replies">
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

CollectionDetail.propTypes = {
    currentUserID: PropTypes.number,
    currentUserName: PropTypes.string,
    thisCollection: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        creationDate: PropTypes.string,
        lastUpdateDate: PropTypes.string,
        papers: PropTypes.arrayOf(PropTypes.shape({
            source: PropTypes.string,
            id: PropTypes.number,
            user: PropTypes.string,
            title: PropTypes.string,
            date: PropTypes.string,
            authors: PropTypes.array,
            keywords: PropTypes.array,
            likeCount: PropTypes.number,
            reviewCount: PropTypes.number,
            isLiked: PropTypes.bool,
        })),
        members: PropTypes.arrayOf(PropTypes.string),
        replies: PropTypes.arrayOf(PropTypes.shape({
            content: PropTypes.string,
            author: PropTypes.string,
            authorId: PropTypes.number,
            isLiked: PropTypes.bool,
            likeCount: PropTypes.number,
        })),
        likesCount: PropTypes.number,
        isLiked: PropTypes.bool,
        amIMember: PropTypes.bool,
    }),
};

CollectionDetail.defaultProps = {
    currentUserID: 1,
    currentUserName: "Girin",
    thisCollection: {
        id: 1,
        name: "Papers for tasty cat cans",
        description: "asdf",
        creationDate: "180102",
        lastUpdateDate: "191031",
        papers: [
            {
                source: "added",
                id: 1,
                user: "Testing Module",
                title: "title:test",
                date: "date:111111",
                authors: [{ first_name: "first", last_name: "last" }],
                keywords: ["keywords:test"],
                likeCount: 3,
                reviewCount: 6,
                isLiked: false,
            },
            {
                source: "added",
                id: 2,
                user: "Testing Module",
                title: "title:test2",
                date: "date:111111",
                authors: [{ first_name: "first", last_name: "last" }],
                keywords: ["keywords:test"],
                likeCount: 3,
                reviewCount: 6,
                isLiked: false,
            },
            {
                source: "added",
                id: 3,
                user: "Testing Module",
                title: "title:test3",
                date: "date:111111",
                authors: [{ first_name: "first", last_name: "last" }],
                keywords: ["keywords:test"],
                likeCount: 3,
                reviewCount: 6,
                isLiked: false,
            },
            {
                source: "added",
                id: 4,
                user: "Testing Module",
                title: "title:test4",
                date: "date:111111",
                authors: [{ first_name: "first", last_name: "last" }],
                keywords: ["keywords:test"],
                likeCount: 3,
                reviewCount: 6,
                isLiked: false,
            },
        ],
        members: [
            "Anna",
            "Betty",
            "Charlie",
            "Dophio",
            "Emily",
        ],
        replies: [
            {
                content: "asdf",
                author: "qwer",
                authorId: 1,
                isLiked: false,
                likeCount: 3,
            },
            {
                content: "dsaf",
                author: "zvcx",
                authorId: 2,
                isLiked: false,
                likeCount: 7,
            },
            {
                content: "rtyui",
                author: "asfd",
                authorId: 3,
                isLiked: false,
                likeCount: 9,
            },
        ],
        likesCount: 15,
        isLiked: false,
        amIMember: true,
    },
};

export default CollectionDetail;
