import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs, Tab, Button } from "react-bootstrap";

import { PaperCard, CollectionCard, UserCard } from "../../components";
import { paperStatus } from "../../constants/constants";
import { paperActions, collectionActions, userActions } from "../../store/actions";
import "./SearchResult.css";

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWord: "",
            paperHeadMessage: "please wait...",
            paperIds: [],
            paperCardsLeft: [],
            paperCardsRight: [],
            paperCardsLeftPushed: false,
            collections: [],
            users: [],
            searchPaperStatus: paperStatus.WAITING,
        };

        this.searchTrigger = this.searchTrigger.bind(this);
        this.clickPaperMoreHandler = this.clickPaperMoreHandler.bind(this);
        this.paperCardsMaker = this.paperCardsMaker.bind(this);
        this.paperCardsDistributor = this.paperCardsDistributor.bind(this);
        this.collectionCardsMaker = this.collectionCardsMaker.bind(this);
        this.userCardsMaker = this.userCardsMaker.bind(this);
    }

    componentDidMount() {
        this.searchTrigger();
    }

    // when users search another keyword on SearchResult
    /* eslint-disable react/no-did-update-set-state */
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({
                searchPaperStatus: paperStatus.WAITING,
                paperHeadMessage: "please wait...",
                paperIds: [],
                paperCardsLeft: [],
                paperCardsRight: [],
                paperCardsLeftPushed: false,
            });
            this.searchTrigger();
        }
    }
    /* eslint-enable react/no-did-update-set-state */

    searchTrigger = () => {
        const searchWord = this.props.location.pathname.split("=")[1];
        this.setState({ searchWord });
        this.props.onSearchPaper({ text: searchWord })
            .then(() => {
                // if searchWord is changed while waiting promise, don't update state
                if (this.state.searchWord === searchWord) {
                    this.setState({
                        searchPaperStatus: paperStatus.NONE,
                    });
                    if (this.props.searchedPapers.length > 0) {
                        this.setState({ paperHeadMessage: null });
                    } else {
                        this.setState({ paperHeadMessage: "no papers" });
                    }
                    this.paperCardsDistributor(this.props.searchedPapers);
                }
            });
        this.props.onSearchCollection(searchWord, this.props.collectionPageNum + 1)
            .then(() => {
                // if searchWord is changed while waiting promise, don't update state
                if (this.state.searchWord === searchWord) {
                    this.setState({ collections: this.props.searchedCollections });
                }
            });
        this.props.onSearchUser(searchWord, this.props.userPageNum + 1)
            .then(() => {
                // if searchWord is changed while waiting promise, don't update state
                if (this.state.searchWord === searchWord) {
                    this.setState({ users: this.props.searchedUsers });
                }
            });
    }

    clickPaperMoreHandler = () => {
        this.setState({ searchPaperStatus: paperStatus.WAITING });
        this.props.onSearchPaper({
            text: this.state.searchWord,
            page_number: this.props.paperPageNum + 1,
        })
            .then(() => {
                this.setState({
                    searchPaperStatus: paperStatus.NONE,
                });
                this.paperCardsDistributor(this.props.searchedPapers);
            });
    };

    paperCardsMaker = (paper) => (
        <PaperCard
          key={paper.id}
          id={paper.id}
          title={paper.title}
          date={paper.date}
          authors={paper.authors}
          keywords={paper.keywords}
          likeCount={paper.count.likes}
          reviewCount={paper.count.reviews}
          isLiked={paper.liked}
          paperSource={paper.source}
          addButtonExists
          history={this.props.history}
        />
    );

    paperCardsDistributor = (searchedPapers) => {
        const { paperIds } = this.state;
        const { paperCardsLeft } = this.state;
        const { paperCardsRight } = this.state;

        const arxiv = searchedPapers.filter((x) => x.source === "arxiv"
        && !paperIds.includes(x.id));
        const crossref = searchedPapers.filter((x) => x.source === "crossref"
        && !paperIds.includes(x.id));

        let i = 0;
        /* eslint-disable react/no-access-state-in-setstate */
        let leftPushed = this.state.paperCardsLeftPushed;
        /* eslint-enable react/no-access-state-in-setstate */

        while (i < arxiv.length || i < crossref.length) {
            if (i < arxiv.length && i < crossref.length) {
                if (leftPushed) {
                    paperCardsRight.push(arxiv[i]);
                    paperCardsLeft.push(crossref[i]);
                } else {
                    paperCardsLeft.push(arxiv[i]);
                    paperCardsRight.push(crossref[i]);
                }
                paperIds.push(arxiv[i].id);
                paperIds.push(crossref[i].id);
            } else if (i < arxiv.length) {
                if (leftPushed) {
                    paperCardsRight.push(arxiv[i]);
                } else {
                    paperCardsLeft.push(arxiv[i]);
                }
                paperIds.push(arxiv[i].id);
                leftPushed = !leftPushed;
            } else {
                if (leftPushed) {
                    paperCardsRight.push(crossref[i]);
                } else {
                    paperCardsLeft.push(crossref[i]);
                }
                paperIds.push(crossref[i].id);
                leftPushed = !leftPushed;
            }
            i += 1;
        }
        this.setState({
            paperIds,
            paperCardsLeft,
            paperCardsRight,
            paperCardsLeftPushed: leftPushed,
        });
    }

    collectionCardsMaker = (collection) => (
        <CollectionCard
          key={collection.id}
          id={collection.id}
          user={collection.user}
          title={collection.title}
          memberCount={collection.count.users}
          paperCount={collection.count.papers}
          replyCount={collection.count.replies}
          likeCount={collection.count.likes}
          isLiked={collection.liked}
          headerExists={false}
        />
    );

    userCardsMaker = (user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.username}
          email={user.email}
          description={user.description}
          doIFollow={user.is_following}
          followerCount={user.count.follower}
          followingCount={user.count.following}
        />
    )

    render() {
        const paperEmpty = this.state.paperCardsLeft.length === 0
            && this.state.paperCardsRight.length === 0;
        const paperCardsLeft = this.state.paperCardsLeft.map(
            (paper) => this.paperCardsMaker(paper),
        );
        const paperCardsRight = this.state.paperCardsRight.map(
            (paper) => this.paperCardsMaker(paper),
        );
        let collectionCardsLeft = null;
        let collectionCardsRight = null;
        let userCardsLeft = null;
        let userCardsRight = null;
        let collectionMessage = "no collections";
        let userMessage = "no users";
        let paperPlus = "";
        let collectionPlus = "";
        let userPlus = "";

        if (this.state.collections.length > 0) {
            collectionCardsLeft = this.state.collections
                .filter((x) => this.state.collections.indexOf(x) % 2 === 0)
                .map((collection) => this.collectionCardsMaker(collection));
            collectionCardsRight = this.state.collections
                .filter((x) => this.state.collections.indexOf(x) % 2 === 1)
                .map((collection) => this.collectionCardsMaker(collection));
            collectionMessage = null;
        }

        if (this.state.users.length > 0) {
            userCardsLeft = this.state.users
                .filter((x) => this.state.users.indexOf(x) % 2 === 0)
                .map((user) => this.userCardsMaker(user));
            userCardsRight = this.state.users
                .filter((x) => this.state.users.indexOf(x) % 2 === 1)
                .map((user) => this.userCardsMaker(user));
            userMessage = null;
        }

        let paperMoreButton = null;
        if (this.state.searchPaperStatus !== paperStatus.WAITING
            && !this.props.paperFinished) {
            paperMoreButton = (
                <Button
                  className="paper-more-button"
                  onClick={this.clickPaperMoreHandler}
                  size="lg"
                  block
                >View More
                </Button>
            );
            paperPlus = "+";
        } else if (this.state.searchPaperStatus === paperStatus.WAITING
            && !paperEmpty) {
            paperMoreButton = (
                <h3 id="paper-more-waiting-message">please wait...</h3>
            );
        }

        if (!this.props.collectionFinished) {
            collectionPlus = "+";
        }
        if (!this.props.userFinished) {
            userPlus = "+";
        }

        return (
            <div className="search-result">
                <div className="item-list">
                    <Tabs defaultActiveKey="paper-tab" className="item-tabs">
                        <Tab className="paper-tab" eventKey="paper-tab" title={`Paper(${this.state.paperIds.length + paperPlus})`}>
                            <div id="paper-cards">
                                <h3 id="paper-message">{this.state.paperHeadMessage}</h3>
                                <div id="paper-cards-left">{paperCardsLeft}</div>
                                <div id="paper-cards-right">{paperCardsRight}</div>
                            </div>
                            {paperMoreButton}
                        </Tab>
                        <Tab className="collection-tab" eventKey="collection-tab" title={`Collection(${this.state.collections.length + collectionPlus})`}>
                            <div id="collection-cards">
                                <h3 id="collection-message">{collectionMessage}</h3>
                                <div id="collection-cards-left">{collectionCardsLeft}</div>
                                <div id="collection-cards-right">{collectionCardsRight}</div>
                            </div>
                            { this.props.collectionFinished ? null
                                : (
                                    <Button
                                      className="collection-more-button"
                                      onClick={() => {
                                          this.props.onSearchCollection(
                                              this.state.searchWord, this.props.collectionPageNum + 1,
                                          )
                                              .then(() => {
                                                  const { collections } = this.state;
                                                  this.setState({
                                                      collections: collections.concat(this.props.searchedCollections),
                                                  });
                                              });
                                      }}
                                      size="lg"
                                      block
                                    >
                            View More
                                    </Button>
                                )}
                        </Tab>
                        <Tab className="user-tab" eventKey="user-tab" title={`People(${this.state.users.length + userPlus})`}>
                            <div id="user-cards">
                                <h3 id="user-message">{userMessage}</h3>
                                <div id="user-cards-left">{userCardsLeft}</div>
                                <div id="user-cards-right">{userCardsRight}</div>
                            </div>
                            { this.props.userFinished ? null
                                : (
                                    <Button
                                      className="user-more-button"
                                      onClick={() => {
                                          this.props.onSearchUser(
                                              this.state.searchWord, this.props.userPageNum + 1,
                                          )
                                              .then(() => {
                                                  const { users } = this.state;
                                                  this.setState({
                                                      users: users.concat(this.props.searchedUsers),
                                                  });
                                              });
                                      }}
                                      size="lg"
                                      block
                                    >
                            View More
                                    </Button>
                                )}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    searchPaperStatus: state.paper.search.status,
    searchCollectionStatus: state.collection.list.status,
    searchUserStatus: state.user.search.status,
    searchedPapers: state.paper.search.papers,
    searchedCollections: state.collection.list.list,
    searchedUsers: state.user.search.users,
    paperPageNum: state.paper.search.pageNum,
    paperFinished: state.paper.search.finished,
    collectionPageNum: state.collection.list.pageNum,
    collectionFinished: state.collection.list.finished,
    userPageNum: state.user.search.pageNum,
    userFinished: state.user.search.finished,
});

const mapDispatchToProps = (dispatch) => ({
    onSearchPaper: (searchWord) => dispatch(paperActions.searchPaper(searchWord)),
    onSearchCollection: (searchWord, pageNum) => dispatch(
        collectionActions.searchCollection(searchWord, pageNum),
    ),
    onSearchUser: (searchWord, pageNum) => dispatch(userActions.searchUser(searchWord, pageNum)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);

SearchResult.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    onSearchPaper: PropTypes.func,
    onSearchCollection: PropTypes.func,
    onSearchUser: PropTypes.func,
    searchedPapers: PropTypes.arrayOf(PropTypes.any),
    searchedCollections: PropTypes.arrayOf(PropTypes.any),
    searchedUsers: PropTypes.arrayOf(PropTypes.any),
    paperPageNum: PropTypes.number,
    paperFinished: PropTypes.bool,
    collectionPageNum: PropTypes.number,
    collectionFinished: PropTypes.bool,
    userPageNum: PropTypes.number,
    userFinished: PropTypes.bool,
};

SearchResult.defaultProps = {
    history: null,
    location: null,
    onSearchPaper: () => {},
    onSearchCollection: () => {},
    onSearchUser: () => {},
    searchedPapers: [],
    searchedCollections: [],
    searchedUsers: [],
    paperPageNum: 0,
    paperFinished: true,
    collectionPageNum: 0,
    collectionFinished: true,
    userPageNum: 0,
    userFinished: true,
};
