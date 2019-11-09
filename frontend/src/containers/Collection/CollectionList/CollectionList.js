import React, { Component } from "react";
import PropTypes from "prop-types";

import { CollectionCard } from "../../../components";

import "./CollectionList.css";

class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const collectionCardsLeft = this.props.collections
            .filter((x) => this.props.collections.indexOf(x) % 2 === 0)
            .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  source={collection.source}
                  id={collection.id}
                  user={collection.user}
                  title={collection.title}
                  paperCount={collection.paperCount}
                  replyCount={collection.replyCount}
                  likeCount={collection.likeCount}
                  isLiked={collection.isLiked}
                />
            ));

        const collectionCardsRight = this.props.collections
            .filter((x) => this.props.collections.indexOf(x) % 2 === 1)
            .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  source={collection.source}
                  id={collection.id}
                  user={collection.user}
                  title={collection.title}
                  paperCount={collection.paperCount}
                  replyCount={collection.replyCount}
                  likeCount={collection.likeCount}
                  isLiked={collection.isLiked}
                />
            ));

        return (
            <div className="CollectionList">
                <div className="CollectionListContent">
                    <div id="collectionListText"><h2>Your Colletion List</h2></div>
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

export default CollectionList;
