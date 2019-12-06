import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import { CreateNewCollectionModal, CollectionCard } from "../../../components";
import { collectionActions } from "../../../store/actions";

import "./CollectionList.css";

class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
        };

        this.getCollectionsTrigger = this.getCollectionsTrigger.bind(this);
        this.cardsMaker = this.cardsMaker.bind(this);
    }

    componentDidMount() {
        if (this.props.me) {
            this.getCollectionsTrigger(0);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.me !== prevProps.me) {
            this.getCollectionsTrigger(0);
        }
    }

    getCollectionsTrigger(pageNum) {
        this.props.onGetCollections({
            id: this.props.me.id,
            page_number: pageNum + 1,
        })
            .then(() => {
                const { collections } = this.state;
                this.setState({ collections: collections.concat(this.props.storedCollections) });
            })
            .catch(() => {});
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
                    <div id="collectionNewButtonDiv">
                        <CreateNewCollectionModal
                          whatActionWillFollow={() => {
                              this.setState({ collections: [] });
                              this.getCollectionsTrigger(0);
                          }}
                        />
                    </div>
                    <div id="colletionCards">
                        <div id="collectionCardsLeft">{collectionCardsLeft}</div>
                        <div id="collectionCardsRight">{collectionCardsRight}</div>
                    </div>
                    { this.props.collectionFinished ? null
                        : (
                            <Button
                              className="collection-more-button"
                              onClick={() => this.getCollectionsTrigger(
                                  this.props.collectionPageNum,
                              )}
                              size="lg"
                              block
                            >
                            View More
                            </Button>
                        )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
    storedCollections: state.collection.list.list,
    collectionPageNum: state.collection.list.pageNum,
    collectionFinished: state.collection.list.finished,
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
    collectionPageNum: PropTypes.number,
    collectionFinished: PropTypes.bool,
};

CollectionList.defaultProps = {
    me: null,
    storedCollections: [],
    onGetCollections: () => {},
    collectionPageNum: 0,
    collectionFinished: true,
};
