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
            papers: [],
            collections: [],
            users: [],
            searchPaperStatus: paperStatus.WAITING,
        };

        this.paperCardsMaker = this.paperCardsMaker.bind(this);
        this.collectionCardsMaker = this.collectionCardsMaker.bind(this);
        this.userCardsMaker = this.userCardsMaker.bind(this);
    }

    componentDidMount() {
        const searchWord = this.props.location.pathname.split("=")[1];
        this.setState({ searchWord });
        this.props.onSearchPaper({ text: searchWord })
            .then(() => {
                this.setState({
                    papers: this.props.searchedPapers,
                    searchPaperStatus: paperStatus.NONE,
                });
            });
        this.props.onSearchCollection({ text: searchWord })
            .then(() => {
                this.setState({ collections: this.props.searchedCollections });
            });
        this.props.onSearchUser({ text: searchWord })
            .then(() => {
                this.setState({ users: this.props.searchedUsers });
            });
    }

    clickPaperMoreHandler = () => {
        this.setState({ searchPaperStatus: paperStatus.WAITING });
        this.props.onSearchPaper({
            text: this.state.searchWord,
            page_number: this.props.paperPageNum + 1,
        })
            .then(() => {
                const { papers } = this.state;
                this.setState({
                    papers: papers.concat(this.props.searchedPapers),
                    searchPaperStatus: paperStatus.NONE,
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
          keywords={paper.keywords}
          likeCount={paper.count.likes}
          reviewCount={paper.reviewCount}
          isLiked={paper.liked}
          addButtonExists
          headerExists={false}
          history={this.props.history}
        />
    );

    collectionCardsMaker = (collection) => (
        <CollectionCard
          key={collection.id}
          id={collection.id}
          user={collection.user}
          title={collection.title}
          memberCount={collection.count.users}
          paperCount={collection.count.papers}
          replyCount={collection.replyCount}
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
        let paperCardsLeft = null;
        let paperCardsRight = null;
        let collectionCardsLeft = null;
        let collectionCardsRight = null;
        let userCardsLeft = null;
        let userCardsRight = null;
        let paperMessage = "please wait...";
        let collectionMessage = "no collections";
        let userMessage = "no users";

        if (this.state.searchPaperStatus === paperStatus.NONE) {
            paperMessage = "no papers";
        }

        if (this.state.papers.length > 0) {
            paperCardsLeft = this.state.papers
                .filter((x) => this.state.papers.indexOf(x) % 2 === 0)
                .map((paper) => this.paperCardsMaker(paper));
            paperCardsRight = this.state.papers
                .filter((x) => this.state.papers.indexOf(x) % 2 === 1)
                .map((paper) => this.paperCardsMaker(paper));
            paperMessage = null;
        }

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
        } else if (this.state.searchPaperStatus === paperStatus.WAITING
            && this.state.papers.length > 0) {
            paperMoreButton = (
                <h3 id="paper-more-waiting-message">please wait...</h3>
            );
        }

        return (
            <div className="search-result">
                <div className="item-list">
                    <Tabs defaultActiveKey="paper-tab" className="item-tabs">
                        <Tab className="paper-tab" eventKey="paper-tab" title={`Paper(${this.state.papers.length})`}>
                            <div id="paper-cards">
                                <h3 id="paper-message">{paperMessage}</h3>
                                <div id="paper-cards-left">{paperCardsLeft}</div>
                                <div id="paper-cards-right">{paperCardsRight}</div>
                            </div>
                            {paperMoreButton}
                        </Tab>
                        <Tab className="collection-tab" eventKey="collection-tab" title={`Collection(${this.state.collections.length})`}>
                            <div id="collection-cards">
                                <h3 id="collection-message">{collectionMessage}</h3>
                                <div id="collection-cards-left">{collectionCardsLeft}</div>
                                <div id="collection-cards-right">{collectionCardsRight}</div>
                            </div>
                        </Tab>
                        <Tab className="user-tab" eventKey="user-tab" title={`People(${this.state.users.length})`}>
                            <div id="user-cards">
                                <h3 id="user-message">{userMessage}</h3>
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
    searchUserStatus: state.user.status,
    searchedPapers: state.paper.search.papers,
    searchedCollections: state.collection.list.list,
    searchedUsers: state.user.searchedUsers,
    paperPageNum: state.paper.search.pageNum,
    paperFinished: state.paper.search.finished,
});

const mapDispatchToProps = (dispatch) => ({
    onSearchPaper: (searchWord) => dispatch(paperActions.searchPaper(searchWord)),
    onSearchCollection: (searchWord) => dispatch(collectionActions.searchCollection(searchWord)),
    onSearchUser: (searchWord) => dispatch(userActions.searchUser(searchWord)),
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
};
