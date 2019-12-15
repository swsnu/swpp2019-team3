import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tabs, Tab, Button } from "react-bootstrap";

import { CreateNewCollectionModal, CollectionCard } from "../../../components";
import { collectionActions } from "../../../store/actions";

import "./CollectionList.css";

class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
            sharedCollections: [],
        };

        this.getCollectionsTrigger = this.getCollectionsTrigger.bind(this);
        this.getSharedCollectionsTrigger = this.getSharedCollectionsTrigger.bind(this);
        this.cardsMaker = this.cardsMaker.bind(this);
    }

    componentDidMount() {
        if (Object.keys(this.props.me).length !== 0) {
            this.getCollectionsTrigger(0);
            this.getSharedCollectionsTrigger(0);
        }
    }

    /* eslint-disable react/no-did-update-set-state */
    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.me).length !== 0 && this.props.me !== prevProps.me) {
            this.setState({ collections: [] });
            this.getCollectionsTrigger(0);
            this.getSharedCollectionsTrigger(0);
        }
    }
    /* eslint-enable react/no-did-update-set-state */

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

    getSharedCollectionsTrigger(pageNum) {
        this.props.onGetSharedCollections({
            id: this.props.me.id,
            page_number: pageNum + 1,
        })
            .then(() => {
                const { sharedCollections } = this.state;
                this.setState({
                    sharedCollections:
                    sharedCollections.concat(this.props.sharedCollections),
                });
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
          owner={collection.owner}
          type={collection.type}
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

        const sharedCollectionCardsLeft = this.state.sharedCollections
            .filter((x) => this.state.sharedCollections.indexOf(x) % 2 === 0)
            .map((collection) => this.cardsMaker(collection));

        const sharedCollectionCardsRight = this.state.sharedCollections
            .filter((x) => this.state.sharedCollections.indexOf(x) % 2 === 1)
            .map((collection) => this.cardsMaker(collection));

        return (
            <div className="CollectionList">
                <div id="collectionListText">My Collections</div>
                <div id="collectionNewButtonDiv">
                    <CreateNewCollectionModal
                      whatActionWillFollow={() => {
                          this.setState({ collections: [] });
                          this.getCollectionsTrigger(0);
                      }}
                    />
                </div>
                <Tabs defaultActiveKey="all-tab" className="collection-tabs">
                    <Tab className="all-tab" eventKey="all-tab" title={`All(${this.props.collectionTotalCount})`}>
                        <div className="CollectionListContent">
                            <div id="colletionCards">
                                <div id="collectionCardsLeft">{collectionCardsLeft}</div>
                                <div id="collectionCardsRight">{collectionCardsRight}</div>
                            </div>
                            { this.props.collectionFinished ? null
                                : (
                                    <Button
                                      variant="outline-info"
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
                    </Tab>
                    <Tab className="shared-tab" eventKey="shared-tab" title={`Shared(${this.props.sharedTotalCount})`}>
                        <div className="SharedCollectionListContent">
                            <div id="sharedColletionCards">
                                <div id="sharedCollectionCardsLeft">{sharedCollectionCardsLeft}</div>
                                <div id="sharedCollectionCardsRight">{sharedCollectionCardsRight}</div>
                            </div>
                            { this.props.sharedFinished ? null
                                : (
                                    <Button
                                      variant="outline-info"
                                      className="shared-collection-more-button"
                                      onClick={() => this.getSharedCollectionsTrigger(
                                          this.props.sharedPageNum,
                                      )}
                                      size="lg"
                                      block
                                    >
                            View More
                                    </Button>
                                )}

                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    me: state.auth.me,
    storedCollections: state.collection.list.list,
    sharedCollections: state.collection.sharedList.list,
    collectionPageNum: state.collection.list.pageNum,
    sharedPageNum: state.collection.sharedList.pageNum,
    collectionFinished: state.collection.list.finished,
    sharedFinished: state.collection.sharedList.finished,
    makeNewCollectionStatus: state.collection.make.status,
    getCollectionsStatus: state.collection.list.status,
    getSharedCollectionsStatus: state.collection.sharedList.status,
    collectionTotalCount: state.collection.list.totalCount,
    sharedTotalCount: state.collection.sharedList.totalCount,
});

const mapDispatchToProps = (dispatch) => ({
    onGetCollections: (userId) => dispatch(collectionActions.getCollectionsByUserId(userId)),
    onGetSharedCollections: (userId) => dispatch(
        collectionActions.getSharedCollectionsByUserId(userId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList);

CollectionList.propTypes = {
    me: PropTypes.objectOf(PropTypes.any),
    onGetCollections: PropTypes.func,
    onGetSharedCollections: PropTypes.func,
    storedCollections: PropTypes.arrayOf(PropTypes.any),
    sharedCollections: PropTypes.arrayOf(PropTypes.any),
    collectionPageNum: PropTypes.number,
    sharedPageNum: PropTypes.number,
    collectionFinished: PropTypes.bool,
    sharedFinished: PropTypes.bool,
    collectionTotalCount: PropTypes.number,
    sharedTotalCount: PropTypes.number,
};

CollectionList.defaultProps = {
    me: {},
    storedCollections: [],
    sharedCollections: [],
    onGetCollections: () => {},
    onGetSharedCollections: () => {},
    collectionPageNum: 0,
    sharedPageNum: 0,
    collectionFinished: true,
    sharedFinished: true,
    collectionTotalCount: 0,
    sharedTotalCount: 0,
};
