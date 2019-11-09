import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CollectionCard } from "../../../components";
import { collectionActions } from "../../../store/actions";
// import { collectionStatus } from "../../../constants/constants";

import "./CollectionList.css";

class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // makeNewCollectionStatus: collectionStatus.NONE,
            collections: [],
        };
    }

    componentDidMount() {
        this.props.onGetCollections({ id: 1 })
            .then(() => {
                this.setState({ collections: this.props.storedCollections });
            });
    }

    cardsMaker = (collection) => (
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
    )

    render() {
        const collectionCardsLeft = this.state.collections
            .filter((x) => this.state.collections.indexOf(x) % 2 === 0)
            .map((collection) => this.cardsMaker(collection));

        const collectionCardsRight = this.state.collections
            .filter((x) => this.state.collections.indexOf(x) % 2 === 1)
            .map((collection) => this.cardsMaker(collection));

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

const mapStateToProps = (state) => ({
    me: state.auth.me,
    makeNewCollectionStatus: state.collection.make.status,
    getCollectionsStatus: state.collection.list.status,
    storedCollections: state.collection.list.list,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewCollection: (newCollection) => dispatch(
        collectionActions.makeNewCollection(newCollection),
    ),
    onGetCollections: (userId) => dispatch(collectionActions.getCollectionsByUserId(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList);

CollectionList.propTypes = {
    // me: PropTypes.objectOf(PropTypes.any),
    // onMakeNewCollection: PropTypes.func,
    onGetCollections: PropTypes.func,
    // makeNewCollectionStatus: PropTypes.string,
    storedCollections: PropTypes.arrayOf(PropTypes.any),
};

CollectionList.defaultProps = {
    // me: null,
    // onMakeNewCollection: null,
    onGetCollections: null,
    // makeNewCollectionStatus: collectionStatus.NONE,
    storedCollections: [],
};
