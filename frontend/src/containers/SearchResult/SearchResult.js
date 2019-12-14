import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";

import { PaperCard, CollectionCard, UserCard } from "../../components";
import { paperStatus } from "../../constants/constants";
import { paperActions, collectionActions, userActions } from "../../store/actions";
import "./SearchResult.css";

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWord: "",
            paperHeadMessage: "wait",
            paperIds: [],
            paperCardsLeft: [],
            paperCardsRight: [],
            paperCardsLeftPushed: false,
            collections: [],
            users: [],
            searchPaperStatus: paperStatus.WAITING,
            activeTab: 0, // default tab is 'Paper'
            paperLoading: true,
            collectionLoading: true,
            peopleLoading: true,
        };

        this.searchTrigger = this.searchTrigger.bind(this);
        this.viewPaperMoreHandler = this.viewPaperMoreHandler.bind(this);
        this.paperCardsMaker = this.paperCardsMaker.bind(this);
        this.paperCardsDistributor = this.paperCardsDistributor.bind(this);
        this.collectionCardsMaker = this.collectionCardsMaker.bind(this);
        this.userCardsMaker = this.userCardsMaker.bind(this);
    }

    componentDidMount() {
        this.searchTrigger();
        window.addEventListener("scroll", this.handleScroll);
    }

    // when users search another word on SearchResult
    /* eslint-disable react/no-did-update-set-state */
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
            this.setState({
                searchPaperStatus: paperStatus.WAITING,
                paperHeadMessage: "wait",
                paperIds: [],
                paperCardsLeft: [],
                paperCardsRight: [],
                paperCardsLeftPushed: false,
                paperLoading: true,
                collectionLoading: true,
                peopleLoading: true,
            });
            this.searchTrigger();
        }
    }
    /* eslint-enable react/no-did-update-set-state */

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        const { scrollHeight } = document.documentElement;
        const { scrollTop } = document.documentElement;
        const { clientHeight } = document.documentElement;

        if (this.state.activeTab === 0) {
            if (!this.state.paperLoading
            && !this.props.paperFinished
            && ((scrollTop + clientHeight + 2000)
            > scrollHeight)) {
                this.setState({ paperLoading: true });
                this.viewPaperMoreHandler();
            }
        } else if (this.state.activeTab === 1) {
            if (!this.state.collectionLoading
                && !this.props.collectionFinished
                && ((scrollTop + clientHeight + 1000)
                > scrollHeight)) {
                this.setState({ collectionLoading: true });

                this.props.onSearchCollection(
                    this.state.searchWord,
                    this.props.collectionPageNum + 1,
                )
                    .then(() => {
                        const { collections } = this.state;
                        this.setState({
                            collections: collections.concat(
                                this.props.searchedCollections,
                            ),
                            collectionLoading: false,
                        });
                    });
            }
        } else if (!this.state.peopleLoading
                && !this.props.userFinished
                && ((scrollTop + clientHeight + 1000)
                > scrollHeight)) {
            this.setState({ peopleLoading: true });

            this.props.onSearchUser(
                this.state.searchWord, this.props.userPageNum + 1,
            )
                .then(() => {
                    const { users } = this.state;
                    this.setState({
                        users: users.concat(this.props.searchedUsers),
                        peopleLoading: false,
                    });
                });
        }
    }

    searchTrigger = () => {
        const searchWord = this.props.location.pathname.split("=")[1];
        this.setState({ searchWord });
        this.props.onSearchPaper({ text: searchWord })
            .then(() => {
                // if searchWord is changed while waiting promise, don't update state
                if (this.state.searchWord === searchWord) {
                    if (this.props.searchedPapers.length > 0) {
                        this.setState({ paperHeadMessage: null });
                    } else {
                        this.setState({ paperHeadMessage: "no papers" });
                    }
                    this.paperCardsDistributor(this.props.searchedPapers);
                    this.setState({
                        searchPaperStatus: paperStatus.NONE,
                        paperLoading: false,
                    });
                }
            });
        this.props.onSearchCollection(searchWord, 1)
            .then(() => {
                // if searchWord is changed while waiting promise, don't update state
                if (this.state.searchWord === searchWord) {
                    this.setState({
                        collections: this.props.searchedCollections, collectionLoading: false,
                    });
                }
            });
        this.props.onSearchUser(searchWord, 1)
            .then(() => {
                // if searchWord is changed while waiting promise, don't update state
                if (this.state.searchWord === searchWord) {
                    this.setState({ users: this.props.searchedUsers, peopleLoading: false });
                }
            });
    }

    viewPaperMoreHandler = () => {
        this.setState({ searchPaperStatus: paperStatus.WAITING });
        this.props.onSearchPaper({
            text: this.state.searchWord,
            page_number: this.props.paperPageNum + 1,
        })
            .then(() => {
                this.paperCardsDistributor(this.props.searchedPapers);
                this.setState({
                    searchPaperStatus: paperStatus.NONE,
                    paperLoading: false,
                });
            });
    };

    paperCardsMaker = (paper) => (
        <PaperCard
          key={paper.id}
          id={paper.id}
          title={paper.title}
          date={paper.date}
          authors={paper.authors}
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
          owner={collection.owner}
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
        let paperMessage = null;
        if (this.state.paperHeadMessage === "wait") {
            paperMessage = (
                <div className="alert alert-info" role="alert">
                    Please wait...
                </div>
            );
        } else if (this.state.paperHeadMessage === "no papers") {
            paperMessage = (
                <div className="alert alert-warning" role="alert">
                No papers.
                </div>
            );
        }
        let collectionMessage = (
            <div className="alert alert-warning" role="alert">
                No collections.
            </div>
        );
        let userMessage = (
            <div className="alert alert-warning" role="alert">
                No users.
            </div>
        );

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
        if (this.state.searchPaperStatus === paperStatus.WAITING
            && !paperEmpty) {
            paperMoreButton = (
                <div className="alert alert-info" role="alert">
                    Please wait...
                </div>
            );
        }

        return (
            <div className="search-result">
                <div className="item-list">
                    <Tabs
                      defaultActiveKey="paper-tab"
                      className="item-tabs"
                      onSelect={(key) => {
                          if (key === "paper-tab") {
                              this.setState({ activeTab: 0 });
                          } else if (key === "collection-tab") {
                              this.setState({ activeTab: 1 });
                          } else {
                              this.setState({ activeTab: 2 });
                          }
                      }}
                    >
                        <Tab
                          className="paper-tab"
                          eventKey="paper-tab"
                          title={`Paper`}
                        >
                            {paperMessage}
                            <div id="paper-cards">
                                <div id="paper-cards-left">{paperCardsLeft}</div>
                                <div id="paper-cards-right">{paperCardsRight}</div>
                            </div>
                            {paperMoreButton}
                        </Tab>
                        <Tab
                          className="collection-tab"
                          eventKey="collection-tab"
                          title={`Collection(${this.props.collectionTotalCount})`}
                        >
                            {collectionMessage}
                            <div id="collection-cards">
                                <div id="collection-cards-left">{collectionCardsLeft}</div>
                                <div id="collection-cards-right">{collectionCardsRight}</div>
                            </div>
                        </Tab>
                        <Tab
                          className="user-tab"
                          eventKey="user-tab"
                          title={`People(${this.props.userTotalCount})`}
                        >
                            {userMessage}
                            <div id="user-cards">
                                <div id="user-cards-left">{userCardsLeft}</div>
                                <div id="user-cards-right">{userCardsRight}</div>
                            </div>
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
    collectionTotalCount: state.collection.list.totalCount,
    userTotalCount: state.user.search.totalCount,
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
    collectionTotalCount: PropTypes.number,
    userTotalCount: PropTypes.number,
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
    collectionTotalCount: 0,
    userTotalCount: 0,
};
