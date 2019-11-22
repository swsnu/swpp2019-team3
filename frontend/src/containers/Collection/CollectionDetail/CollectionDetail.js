import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Tabs, Tab } from "react-bootstrap";
import { PaperCard, Reply, InviteToCollectionModal } from "../../../components";

import { collectionActions, replyActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";
import SVG from "../../../components/svg";

import "./CollectionDetail.css";


class CollectionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // getCollectionStatus: collectionStatus.NONE,
            userCount: 0,
            likeCount: 0,
            // eslint-disable-next-line react/no-unused-state
            paperCount: 0,
            newReplyContent: "",
            isLiked: false,
            // members: [],
            replies: [],
            papers: [],
            thisCollection: {},
        };
        this.clickLikeButtonHandler = this.clickLikeButtonHandler.bind(this);
        this.clickUnlikeButtonHandler = this.clickUnlikeButtonHandler.bind(this);
        this.handleReplies = this.handleReplies.bind(this);
    }

    componentDidMount() {
        this.props.onGetCollection({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                if (this.props.getCollectionStatus === collectionStatus.COLLECTION_NOT_EXIST) {
                    this.props.history.push("/main");
                    return;
                }
                if (this.props.getCollectionStatus === collectionStatus.SUCCESS) {
                    this.setState({
                        thisCollection: this.props.selectedCollection,
                        isLiked: this.props.selectedCollection.liked,
                        likeCount: this.props.selectedCollection.count.likes,
                    });
                }
            });
        this.props.onGetCollectionPapers({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                this.setState({ papers: this.props.storedPapers });
            });
        this.props.onGetReplies({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                this.setState({
                    replies: this.props.replyList.list,
                });
            }).catch(() => {});
    }

    // clickRemovePaperButtonHandler(collection_id: number, paper_id: number)
    // : Call onRemoveCollectionPaper of CollectionDetail to remove the paper from the collection.

    addNewReplyHandler = () => {
        this.props.onMakeNewReply({ id: Number(this.props.location.pathname.split("=")[1]), text: this.state.newReplyContent })
            .then(() => {
                this.setState({
                    newReplyContent: "",
                });
                this.handleReplies();
            }).catch(() => {});
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
          likeCount={paper.count.likes}
          reviewCount={paper.reviewCount}
          isLiked={paper.liked}
          headerExists={false}
        />
    )

    handleReplies() {
        this.props.onGetReplies({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                this.setState({
                    replies: this.props.replyList.list,
                });
            }).catch(() => {});
    }

    // handle click 'Like' button
    clickLikeButtonHandler() {
        this.props.onLikeCollection({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                this.setState({ likeCount: this.props.afterLikeCount });
                this.setState({ isLiked: true });
            });
    }

    // handle click 'Unlike' button
    clickUnlikeButtonHandler() {
        this.props.onUnlikeCollection({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                this.setState({ likeCount: this.props.afterUnlikeCount });
                this.setState({ isLiked: false });
            });
    }

    render() {
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
              key={reply.id}
              id={reply.id}
              author={reply.user.username}
              content={reply.text}
              authorId={reply.user.id}
              likeCount={reply.count.likes}
              isLiked={reply.liked}
              onChange={this.handleReplies}
              userId={this.props.me.id}
              type="collection"
            />
        ));

        return (
            <div className="CollectionDetail">
                <div className="CollectionDetailContent">
                    <div className="head">COLLECTION</div>
                    <div className="CollectionInfo">
                        <div id="collectionName">
                            <h2 id="collectionName">{this.state.thisCollection.title}</h2>
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
                                <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}>
                                    <div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>
                                    {this.state.likeCount}
                                </Button>
                                <InviteToCollectionModal openButtonName="Invite to ..." />
                                {this.state.thisCollection.amIMember ? editButton : <div />}
                            </div>
                        </div>
                        <div id="collectionDescription">
                            <div id="date">
                                <div id="creationDate">Created: {this.state.thisCollection.creationDate}</div>
                                <div id="lastUpdateDate">Last Update: {this.state.thisCollection.lastUpdateDate}</div>
                            </div>
                            <p id="descriptionBox">{this.state.thisCollection.text}</p>
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
                                        <Button
                                          onClick={this.addNewReplyHandler}
                                          disabled={this.state.newReplyContent.length === 0}
                                        >
                                            Add
                                        </Button>
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
    me: state.auth.me,
    getCollectionStatus: state.collection.selected.status,
    selectedCollection: state.collection.selected.collection,
    storedPapers: state.collection.selected.papers,
    likeCollectionStatus: state.collection.like.status,
    afterLikeCount: state.collection.like.count,
    unlikeCollectionStatus: state.collection.unlike.status,
    afterUnlikeCount: state.collection.unlike.count,
    replyList: state.reply.list,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollection: (collectionId) => dispatch(collectionActions.getCollection(collectionId)),
    onGetCollectionPapers: (collectionId) => dispatch(
        collectionActions.getCollectionPapers(collectionId),
    ),
    onLikeCollection: (collectionId) => dispatch(
        collectionActions.likeCollection(collectionId),
    ),
    onUnlikeCollection: (collectionId) => dispatch(
        collectionActions.unlikeCollection(collectionId),
    ),
    onGetReplies: (collectionId) => dispatch(
        replyActions.getRepliesByCollection(collectionId),
    ),
    onMakeNewReply: (reply) => dispatch(
        replyActions.makeNewReplyCollection(reply),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetail);

CollectionDetail.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    onGetCollection: PropTypes.func,
    onGetCollectionPapers: PropTypes.func,
    getCollectionStatus: PropTypes.string,
    selectedCollection: PropTypes.objectOf(PropTypes.any),
    storedPapers: PropTypes.arrayOf(PropTypes.any),
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikeCollection: PropTypes.func,
    onUnlikeCollection: PropTypes.func,
    onGetReplies: PropTypes.func,
    onMakeNewReply: PropTypes.func,
    replyList: PropTypes.objectOf(PropTypes.any),
};

CollectionDetail.defaultProps = {
    me: null,
    history: null,
    location: null,
    onGetCollection: null,
    onGetCollectionPapers: null,
    getCollectionStatus: collectionStatus.NONE,
    selectedCollection: {},
    storedPapers: [],
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikeCollection: () => {},
    onUnlikeCollection: () => {},
    onGetReplies: () => {},
    onMakeNewReply: () => {},
    replyList: {},
};
