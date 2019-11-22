import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CreateNewCollectionModal, CollectionCard } from "../../../components";
import { collectionActions, authActions } from "../../../store/actions";

import "./CollectionList.css";

class CollectionList extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         collections: [],
    //         me: null,
    //     };
    // }

    // this code is implemented to update props, but not works as expected
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.storedCollections !== prevState.collections) {
    //         return { collections: nextProps.storedCollections };
    //     }
    //     return null;
    // }

    componentDidMount() {
        this.props.onGetMe()
            .then(() => {
                this.props.onGetCollections({ id: this.props.me.id });
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
    makeNewCollectionStatus: state.collection.make.status,
    getCollectionsStatus: state.collection.list.status,
    storedCollections: state.collection.list.list,
});

const mapDispatchToProps = (dispatch) => ({
    onMakeNewCollection: (newCollection) => dispatch(
        collectionActions.makeNewCollection(newCollection),
    ),
    onGetCollections: (userId) => dispatch(collectionActions.getCollectionsByUserId(userId)),
    onGetMe: () => dispatch(authActions.getMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList);

CollectionList.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    onGetCollections: PropTypes.func,
    storedCollections: PropTypes.arrayOf(PropTypes.any),
    onGetMe: PropTypes.func,
};

CollectionList.defaultProps = {
    me: null,
    onGetCollections: null,
    storedCollections: [],
    onGetMe: () => {},
};
