import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";

import { PaperCard, CollectionCard, UserCard } from "../../components";
import { paperActions, collectionActions, userActions } from "../../store/actions";
import { paperStatus, collectionStatus, userStatus } from "../../constants/constants";
import "./SearchResult.css";

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchPaperStatus: paperStatus.NONE,
            searchCollectionStatus: collectionStatus.NONE,
            searchUserStatus: userStatus.NONE,
            papers: [],
            collections: [],
            users: [],
        };

        this.paperCardsMaker = this.paperCardsMaker.bind(this);
    }

    componentDidMount() {
        this.props.onSearchPaper({ text: this.props.location.pathname.split("=")[1] })
            .then(() => {
                this.setState({ papers: this.props.searchedPapers });
            });
        this.props.onSearchCollection({ text: this.props.location.pathname.split("=")[1] })
            .then(() => {
                this.setState({ collections: this.props.searchedCollections });
            });
        this.props.onSearchUser({ text: this.props.location.pathname.split("=")[1] })
            .then(() => {
                this.setState({ users: this.props.searchedUsers });
            });
    }

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
        const paperCardsLeft = this.state.papers.filter((x) => this.state.papers.indexOf(x) % 2 === 0)
            .map((paper) => this.paperCardsMaker(paper));
        const paperCardsRight = this.state.papers.filter((x) => this.state.papers.indexOf(x) % 2 === 1)
            .map((paper) => this.paperCardsMaker(paper));

        const collectionCardsLeft = this.state.collections.filter((x) => this.state.collections.indexOf(x) % 2 === 0)
            .map((collection) => this.collectionCardsMaker(collection));
        const collectionCardsRight = this.state.collections.filter((x) => this.state.collections.indexOf(x) % 2 === 1)
            .map((collection) => this.collectionCardsMaker(collection));

        const userCardsLeft = this.state.users.filter((x) => this.state.users.indexOf(x) % 2 === 0)
            .map((user) => this.userCardsMaker(user));
        const userCardsRight = this.state.users.filter((x) => this.state.users.indexOf(x) % 2 === 1)
            .map((user) => this.userCardsMaker(user));

        return (
            <div className="search-result">
                <div className="item-list">
                    <Tabs defaultActiveKey="paper-tab" className="item-tabs">
                        <Tab className="paper-tab" eventKey="paper-tab" title="Paper">
                            <div id="paper-cards">
                                <div id="paper-cards-left">{paperCardsLeft}</div>
                                <div id="paper-cards-right">{paperCardsRight}</div>
                            </div>
                        </Tab>
                        <Tab className="collection-tab" eventKey="collection-tab" title="Collection">
                            <div id="collection-cards">
                                <div id="collection-cards-left">{collectionCardsLeft}</div>
                                <div id="collection-cards-right">{collectionCardsRight}</div>
                            </div>
                        </Tab>
                        <Tab className="user-tab" eventKey="user-tab" title="People">
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
    searchPaperStatus: state.paper.searchPaperStatus,
    searchCollectionStatus: state.collection.list.status,
    searchUserStatus: state.user.status,
    searchedPapers: state.paper.searchedPapers,
    searchedCollections: state.collection.list.list,
    searchedUsers: state.user.searchedUsers,
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
};
