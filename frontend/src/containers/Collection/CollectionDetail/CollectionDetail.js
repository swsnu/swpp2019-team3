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
            userCount: 0,
            likeCount: 0,
            paperCount: 0,
            newReplyContent: "",
            isLiked: false,
            replies: [],
            papers: [],
            thisCollection: {},
            owner: {},
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
                        userCount: this.props.selectedCollection.count.users,
                        paperCount: this.props.selectedCollection.count.papers,
                    });
                }
            });
        this.props.onGetMembers(this.props.location.pathname.split("=")[1])
            .then(() => {
                this.props.members.forEach((x) => {
                    if (x.collection_user_type === "owner") {
                        this.setState({ owner: x });
                    }
                });
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
          reviewCount={paper.count.reviews}
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
              date={reply.modification_date}
              type="collection"
            />
        ));

        let inviteModal = null;
        if (this.props.selectedCollection.owned
            || (this.props.me && this.props.members.map((x) => x.id).includes(this.props.me.id))) {
            inviteModal = (
                <InviteToCollectionModal
                  openButtonName="Invite to ..."
                  members={this.props.members}
                  whatActionWillFollow={
                      () => {
                          this.props.onGetMembers()
                              .then(() => {
                                  this.setState({
                                      userCount: this.props.memberCount,
                                  });
                              });
                      }
                  }
                />
            );
        }
        let manageButton = null;
        if (this.props.selectedCollection.owned) {
            manageButton = (
                <Button
                  id="manageButton"
                  href={`/collection_id=${this.props.selectedCollection.id}/manage`}
                >Manage
                </Button>
            );
        }

        let creationDate = "";
        let modificationDate = "";
        if (Object.keys(this.props.selectedCollection).length > 0) {
            /* eslint-disable prefer-destructuring */
            creationDate = this.props.selectedCollection.creation_date.split("T")[0];
            modificationDate = this.props.selectedCollection.modification_date.split("T")[0];
            /* eslint-enable prefer-destructuring */
        }

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
                            <Link id="memberStat" to={`${this.props.location.pathname}/members`}>
                                <h5 id="memberCount">{this.state.userCount}</h5>
                                <h5 id="memberText">Members</h5>
                            </Link>
                            <div id="collectionButtons">
                                <Button className="like-button" variant="light" onClick={this.state.isLiked ? this.clickUnlikeButtonHandler : this.clickLikeButtonHandler}>
                                    <div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>
                                    {this.state.likeCount}
                                </Button>
                                {inviteModal}
                                {manageButton}
                            </div>
                        </div>
                        <div id="collectionDescription">
                            <div id="owner">Owner: {this.state.owner.username}</div>
                            <div id="date">
                                <div id="creationDate">Created: {creationDate}</div>
                                <div id="lastUpdateDate">Last Update: {modificationDate}</div>
                            </div>
                            <p id="descriptionBox">{this.state.thisCollection.text}</p>
                        </div>
                    </div>
                    <div className="itemList">
                        <Tabs defaultActiveKey="paperTab" id="itemTabs">
                            <Tab eventKey="paperTab" title={`Papers(${this.state.paperCount})`}>
                                <div id="paperCards">
                                    <div id="paperCardsLeft">{paperCardsLeft}</div>
                                    <div id="paperCardsRight">{paperCardsRight}</div>
                                </div>
                            </Tab>
                            <Tab className="reply-tab" eventKey="replyTab" title={`Replies(${this.state.replies.length})`}>
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
    members: state.collection.getMembers.members,
    memberCount: state.collection.selected.memberCount,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollection: (collectionId) => dispatch(collectionActions.getCollection(collectionId)),
    onGetCollectionPapers: (collectionId) => dispatch(
        collectionActions.getCollectionPapers(collectionId),
    ),
    onGetReplies: (collectionId) => dispatch(
        replyActions.getRepliesByCollection(collectionId),
    ),
    onGetMembers: (collectionId) => dispatch(
        collectionActions.getCollectionMembers(collectionId),
    ),
    onLikeCollection: (collectionId) => dispatch(
        collectionActions.likeCollection(collectionId),
    ),
    onUnlikeCollection: (collectionId) => dispatch(
        collectionActions.unlikeCollection(collectionId),
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
    onGetMembers: PropTypes.func,
    onMakeNewReply: PropTypes.func,
    replyList: PropTypes.objectOf(PropTypes.any),
    members: PropTypes.arrayOf(PropTypes.any),
    memberCount: PropTypes.number,
};

CollectionDetail.defaultProps = {
    me: {},
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
    onGetMembers: () => {},
    onMakeNewReply: () => {},
    replyList: {},
    members: [],
    memberCount: 0,
};
