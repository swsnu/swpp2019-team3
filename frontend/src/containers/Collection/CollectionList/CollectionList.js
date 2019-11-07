import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CollectionCard } from "../../../components";
import { collectionActions } from "../../../store/actions";
import { collectionStatus } from "../../../constants/constants";

import "./CollectionList.css";

class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            makeNewCollectionStatus: collectionStatus.NONE,
            collections: [],
        };
    }

    componentDidMount() {
        this.props.onGetCollections({ id: 1 })
            .then(() => {
                this.setState({ collections: this.props.storedCollections });
            });
    }

    render() {
        const collectionCardsLeft = this.state.collections
            .filter((x) => this.state.collections.indexOf(x) % 2 === 0)
            .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  source={collection.source}
                  id={collection.id}
                  user={collection.user}
                  title={collection.title}
                  memberCount={collection.count.users}
                  paperCount={collection.count.papers}
                  replyCount={collection.replyCount}
                  likeCount={collection.likeCount}
                  isLiked={collection.isLiked}
                  headerExists={false}
                />
            ));

        const collectionCardsRight = this.state.collections
            .filter((x) => this.state.collections.indexOf(x) % 2 === 1)
            .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  source={collection.source}
                  id={collection.id}
                  user={collection.user}
                  title={collection.title}
                  memberCount={collection.count.users}
                  paperCount={collection.count.papers}
                  replyCount={collection.replyCount}
                  likeCount={collection.likeCount}
                  isLiked={collection.isLiked}
                  headerExists={false}
                />
            ));

        return (
            <div className="CollectionList">
                <div className="CollectionListContent">
                    <div id="collectionListText">My Collections</div>
                    <div id="colletionCards">
                        <div id="collectionCardsLeft">{collectionCardsLeft}</div>
                        <div id="collectionCardsRight">{collectionCardsRight}</div>
                    </div>
                </div>
            </div>
        );
    }
}

CollectionList.propTypes = {
    collections: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.string,
        id: PropTypes.number,
        user: PropTypes.string,
        title: PropTypes.string,
        paperCount: PropTypes.number,
        replyCount: PropTypes.number,
        likeCount: PropTypes.number,
        isLiked: PropTypes.bool,
    })),
};

CollectionList.defaultProps = {
    collections: [
        {
            source: "testing",
            id: 1,
            user: "Ash",
            title: "test collection 1",
            paperCount: 13,
            replyCount: 25,
            likeCount: 7,
            isLiked: true,
        },
        {
            source: "testing",
            id: 2,
            user: "Ash",
            title: "test collection 2",
            paperCount: 66,
            replyCount: 25,
            likeCount: 4,
            isLiked: false,
        },
        {
            source: "testing",
            id: 3,
            user: "Ash",
            title: "test collection 3",
            paperCount: 6,
            replyCount: 38,
            likeCount: 12,
            isLiked: false,
        },
        {
            source: "testing",
            id: 4,
            user: "Ash",
            title: "test collection 4",
            paperCount: 25,
            replyCount: 47,
            likeCount: 5,
            isLiked: false,
        },
    ],
};

const mapStateToProps = (state) => ({
    me: state.auth.me,
    makeNewCollectionStatus: state.collection.make.status,
    getCollectionsStatus: state.collection.list.status,
    storedCollections: state.collection.list.list,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewCollection: (newCollection) => dispatch(collectionActions.makeNewCollection(newCollection)),
    onGetCollections: (userId) => dispatch(collectionActions.getCollectionsByUserId(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList);

CollectionList.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    onMakeNewCollection: PropTypes.func,
    onGetCollections: PropTypes.func,
    makeNewCollectionStatus: PropTypes.string,
};

CollectionList.defaultProps = {
    me: null,
    onMakeNewCollection: null,
    onGetCollections: null,
    makeNewCollectionStatus: collectionStatus.NONE,
};
