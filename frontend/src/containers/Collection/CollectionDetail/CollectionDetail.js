/* eslint-disable no-await-in-loop */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
    Button, Tabs, Tab,
} from "react-bootstrap";
import {
    PaperCard, Reply, InviteToCollectionModal, LikeButton,
} from "../../../components";

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
            thisCollection: { owner: {} },
            newCollectionReplies: [],
            replyCollectionPageCount: 1,
            replyCollectionFinished: true,
        };

        this.getPapersTrigger = this.getPapersTrigger.bind(this);
        this.clickLikeButtonHandler = this.clickLikeButtonHandler.bind(this);
        this.clickUnlikeButtonHandler = this.clickUnlikeButtonHandler.bind(this);
        this.clickMoreButtonHandler = this.clickMoreButtonHandler.bind(this);
        this.handleReplies = this.handleReplies.bind(this);
    }

    componentDidMount() {
        this.props.onGetCollection({ id: Number(this.props.location.pathname.split("=")[1]) })
            .then(() => {
                if (this.props.getCollectionStatus === collectionStatus.COLLECTION_NOT_EXIST) {
                    this.props.history.push("/main");
                }
            });
        this.props.onGetMembers(this.props.location.pathname.split("=")[1]);
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedCollection !== prevProps.selectedCollection) {
            this.getAuthorizedInfo();
        }
    }

    getAuthorizedInfo() {
        // if this collection is private and the user is not a member, redirect
        // NOTE: 'pending' users can see this page although the collection is 'private',
        if (this.props.selectedCollection.type === "private"
                    && !this.props.selectedCollection.collection_user_type) {
            this.props.history.push("/main");
        }

        this.setState({
            thisCollection: this.props.selectedCollection,
            isLiked: this.props.selectedCollection.liked,
            likeCount: this.props.selectedCollection.count.likes,
            userCount: this.props.selectedCollection.count.users,
            paperCount: this.props.selectedCollection.count.papers,
        });

        // if the collection is 'private',
        // only owner and members can see its papers and replies (excluding 'pending' users)
        // NOTE: collection_user_type: 'owner' > 'member' > 'pending' > null
        if (this.props.selectedCollection.type !== "private"
        || (this.props.selectedCollection.collection_user_type && this.props.selectedCollection.collection_user_type !== "pending")) {
            this.props.onGetReplies({ id: Number(this.props.location.pathname.split("=")[1]) })
                .then(() => {
                    this.setState({
                        replies: this.props.replyList.list,
                        replyCollectionPageCount: 1,
                        replyCollectionFinished: this.props.replyList.finished,
                    });
                }).catch(() => {});
            this.getPapersTrigger(0);
        }
    }

    getPapersTrigger(pageNum) {
        this.props.onGetCollectionPapers({
            id: Number(this.props.location.pathname.split("=")[1]),
            page_number: pageNum + 1,
        })
            .then(() => {
                const { papers } = this.state;
                this.setState({ papers: papers.concat(this.props.storedPapers.papers) });
            })
            .catch(() => {});
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
            });
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

    clickMoreButtonHandler = () => {
        this.props.onGetReplies({
            id: Number(this.props.location.pathname.split("=")[1]),
            page_number: this.state.replyCollectionPageCount + 1,
        })
            .then(() => {
                const { replies } = this.state;
                this.setState({
                    replies: replies.concat(this.props.replyList.list),
                    replyCollectionPageCount: this.props.replyList.pageNum,
                    replyCollectionFinished: this.props.replyList.finished,
                });
            });
    }


    async handleReplies() {
        const end = this.state.replyCollectionPageCount;
        this.setState({
            newCollectionReplies: [],
        });
        for (let i = 1; (i === 1) || (i < end + 1); i += 1) {
            await this.forEachHandleReply(i, end)
                .catch(() => {});
            if (i === end || this.props.replyList.finished === true) {
                this.setState((prevState) => ({
                    newCollectionReplies: [],
                    replyCollectionFinished: this.props.replyList.finished,
                    replyCollectionPageCount: this.props.replyList.pageNum,
                    replies: prevState.newCollectionReplies.concat(this.props.replyList.list),
                }));
                break;
            }
            this.setState((prevState) => ({
                newCollectionReplies:
                prevState.newCollectionReplies.concat(this.props.replyList.list),
            }));
        }
    }

    forEachHandleReply(i) {
        return this.props.onGetReplies({
            id: Number(this.props.location.pathname.split("=")[1]),
            page_number: Number(i),
        });
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
        let paperCards = null;
        let replies = null;

        const paperCardsLeft = this.state.papers
            .filter((x) => this.state.papers.indexOf(x) % 2 === 0)
            .map((paper) => this.paperCardMaker(paper));

        const paperCardsRight = this.state.papers
            .filter((x) => this.state.papers.indexOf(x) % 2 === 1)
            .map((paper) => this.paperCardMaker(paper));

        // if the collection is 'private',
        // 'pending' users cannot see its papers and replies
        if (this.props.selectedCollection.type === "private"
            && this.props.selectedCollection.collection_user_type === "pending") {
            paperCards = (
                <div className="alert alert-warning" role="alert">
                    Only members of this private collection can see papers.
                </div>
            );

            replies = (
                <div className="alert alert-warning" role="alert">
                    Only members of this private collection can add or see replies.
                </div>
            );
        } else {
            paperCards = this.state.papers.length !== 0
                ? (
                    <div id="paperCards">
                        <div id="paperCardsLeft">{paperCardsLeft}</div>
                        <div id="paperCardsRight">{paperCardsRight}</div>
                    </div>
                )
                : (<h5 id="noPapersText">There is no paper in this collection for now.</h5>);

            replies = this.state.replies.length !== 0
                ? (this.state.replies.map((reply) => (
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
                )))
                : (<h5 id="noRepliesText">There is no reply in this collection for now.</h5>);
        }

        const replyCount = (this.state.replyCollectionPageCount > 1
            || (this.state.replyCollectionPageCount === 1
                && this.state.replyCollectionFinished === false))
            ? "10+" : this.state.replies.length;

        // 'pending' users cannot see 'Invite' or 'Manage' button
        // and are not included in member list/count
        // instead, they can see accept/dismiss buttons about invitation
        let inviteModal = null;
        if (this.props.selectedCollection.owned
            || this.props.selectedCollection.collection_user_type === "member") {
            inviteModal = (
                <InviteToCollectionModal
                  openButtonName="Invite to ..."
                  members={this.props.members}
                  whatActionWillFollow={
                      () => {
                          this.props.onGetMembers(this.props.selectedCollection.id)
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

        let inviteeAlert = null;
        let inviteeButtons = null;
        if (this.props.selectedCollection.collection_user_type === "pending") {
            inviteeAlert = (
                <div className="alert alert-info" role="alert">
                    You were invited to this collection.
                </div>
            );
            inviteeButtons = (
                <div className="inviteButtons">
                    <Button
                      id="acceptButton"
                      variant="success"
                      onClick={() => this.props.onAcceptInvitation(
                          this.props.selectedCollection.id,
                      )
                          .then(() => this.props.onGetCollection(
                              { id: this.props.selectedCollection.id },
                          ))}
                    >
                        Accept
                    </Button>
                    <Button
                      id="dismissButton"
                      variant="danger"
                      onClick={() => this.props.onDismissInvitation(
                          this.props.selectedCollection.id,
                      )
                          .then(() => this.props.onGetCollection(
                              { id: this.props.selectedCollection.id },
                          ))}
                    >
                        Dismiss
                    </Button>
                </div>
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
                    {inviteeAlert}
                    <div id="header">
                        <LikeButton
                          id="likeButton"
                          isLiked={this.state.isLiked}
                          likeFn={this.clickLikeButtonHandler}
                          unlikeFn={this.clickUnlikeButtonHandler}
                          likeCount={this.state.likeCount}
                        />
                        <Button
                          id="memberButton"
                          variant="light"
                          href={`/collection_id=${this.props.selectedCollection.id}/members`}
                        >
                            <div className="people-image">
                                <SVG name="people" height="70%" width="70%" />
                            </div>
                            {this.state.userCount}
                        </Button>
                        {inviteModal}
                        {manageButton}
                        {inviteeButtons}
                    </div>
                    <div className="CollectionInfo">
                        <div id="collectionBasicInfo">
                            <h1 id="collectionName">{this.state.thisCollection.title}</h1>
                            <p id="descriptionBox">
                                {this.state.thisCollection.text !== ""
                                    ? this.state.thisCollection.text
                                    : "No description for this collection."}
                            </p>
                            <div id="owner">
                                Owned by&nbsp;
                                <a href={`/profile_id=${this.state.thisCollection.owner.id}`}>{this.state.thisCollection.owner.username}</a>
                            </div>
                        </div>
                        <div id="collectionDates">
                            <div id="creationDate">Created: {creationDate}</div>
                            <div id="lastUpdateDate">Last Update: {modificationDate}</div>
                        </div>
                    </div>
                    <div className="itemList">
                        <Tabs defaultActiveKey="paperTab" id="itemTabs">
                            <Tab eventKey="paperTab" title={`Papers(${this.state.paperCount})`}>
                                {paperCards}
                                { this.props.storedPapers.is_finished ? null
                                    : (
                                        <Button
                                          className="paper-more-button"
                                          onClick={() => this.getPapersTrigger(
                                              this.props.storedPapers.page_number,
                                          )}
                                          size="lg"
                                          block
                                        >
                                            View More
                                        </Button>
                                    )}
                            </Tab>
                            <Tab className="reply-tab" eventKey="replyTab" title={`Replies(${replyCount})`}>
                                <div id="replies">
                                    <div id="createNewReply">
                                        <textarea
                                          id="newReplyContentInput"
                                          type="text"
                                          value={this.state.newReplyContent}
                                          onChange={(event) => this.setState({
                                              newReplyContent: event.target.value,
                                          })}
                                          disabled={
                                              this.props.selectedCollection.type === "private"
                                            && this.props.selectedCollection.collection_user_type === "pending"
                                          }
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
                                        {this.state.replyCollectionFinished ? null
                                            : (
                                                <Button
                                                  className="reply-more-button"
                                                  onClick={this.clickMoreButtonHandler}
                                                  size="lg"
                                                  block
                                                >
                                                    View More
                                                </Button>
                                            ) }
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
    onAcceptInvitation: (collectionId) => dispatch(
        collectionActions.acceptInvitation(collectionId),
    ),
    onDismissInvitation: (collectionId) => dispatch(
        collectionActions.dismissInvitation(collectionId),
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
    storedPapers: PropTypes.objectOf(PropTypes.any),
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikeCollection: PropTypes.func,
    onUnlikeCollection: PropTypes.func,
    onGetReplies: PropTypes.func,
    onGetMembers: PropTypes.func,
    onMakeNewReply: PropTypes.func,
    onAcceptInvitation: PropTypes.func,
    onDismissInvitation: PropTypes.func,
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
    selectedCollection: {
        creation_date: "", modification_date: "", type: "private", collection_user_type: null,
    },
    storedPapers: { papers: [], page_number: 0, is_finished: true },
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikeCollection: () => {},
    onUnlikeCollection: () => {},
    onGetReplies: () => {},
    onGetMembers: () => {},
    onMakeNewReply: () => {},
    onAcceptInvitation: () => {},
    onDismissInvitation: () => {},
    replyList: {},
    members: [],
    memberCount: 0,
};
