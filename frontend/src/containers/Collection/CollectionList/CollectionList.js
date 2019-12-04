import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CreateNewCollectionModal, CollectionCard } from "../../../components";
import { collectionActions } from "../../../store/actions";

import "./CollectionList.css";

class CollectionList extends Component {
    componentDidMount() {
        if (this.props.me) {
            this.props.onGetCollections({ id: this.props.me.id })
                .catch(() => {});
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.me !== prevProps.me) {
            this.props.onGetCollections({ id: this.props.me.id })
                .catch(() => {});
        }
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
          replyCount={collection.count.replies}
          likeCount={collection.count.likes}
          isLiked={collection.liked}
          headerExists={false}
        />
    )

    render() {
        const collectionCardsLeft = this.props.storedCollections
            .filter((x) => this.props.storedCollections.indexOf(x) % 2 === 0)
            .map((collection) => this.cardsMaker(collection));

        const collectionCardsRight = this.props.storedCollections
            .filter((x) => this.props.storedCollections.indexOf(x) % 2 === 1)
            .map((collection) => this.cardsMaker(collection));

        return (
            <div className="CollectionList">
                <div className="CollectionListContent">
                    <div id="collectionListText">My Collections</div>
                    <div id="collectionNewButtonDiv">
                        <CreateNewCollectionModal />
                    </div>
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
    storedCollections: state.collection.list.list,
    makeNewCollectionStatus: state.collection.make.status,
    getCollectionsStatus: state.collection.list.status,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollections: (userId) => dispatch(collectionActions.getCollectionsByUserId(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList);

CollectionList.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    onGetCollections: PropTypes.func,
    storedCollections: PropTypes.arrayOf(PropTypes.any),
};

CollectionList.defaultProps = {
    me: null,
    storedCollections: [],
    onGetCollections: () => {},
};
