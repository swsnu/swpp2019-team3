import React, { Component } from "react";
import PropTypes from "prop-types";

import { CollectionCard, Header, SideBar } from "../../../components";

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
                  numPapers={collection.numPapers}
                  numReplies={collection.numReplies}
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
                  numPapers={collection.numPapers}
                  numReplies={collection.numReplies}
                />
            ));

        return (
            <div className="CollectionList">
                <Header />
                <SideBar />
                <div className="CollectionListContent">
                    <div className="CollectinonListText"><h>Your Colletion List</h></div>
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
        numPapers: PropTypes.number,
        numReplies: PropTypes.number,
    })),
};

CollectionList.defaultProps = {
    collections: [
        {
            source: "testing",
            id: 1,
            user: "Ash",
            title: "test collection 1",
            numPapers: 13,
            numReplies: 25,
        },
        {
            source: "testing",
            id: 2,
            user: "Ash",
            title: "test collection 2",
            numPapers: 66,
            numReplies: 25,
        },
        {
            source: "testing",
            id: 3,
            user: "Ash",
            title: "test collection 3",
            numPapers: 6,
            numReplies: 38,
        },
        {
            source: "testing",
            id: 4,
            user: "Ash",
            title: "test collection 4",
            numPapers: 25,
            numReplies: 47,
        },
    ],
};

export default CollectionList;
