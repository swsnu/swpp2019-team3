import React, {Component} from 'react';
import { CollectionCard, Header, SideBar } from '../../../components';

class CollectionList extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };

    render(){
        let collectionCards = this.props.collections.map(collection => {
            return(
                <CollectionCard
                    source={collection.source}
                    id={collection.id}
                    user={collection.user}
                    title={collection.title}
                    numPapers={collection.numPapers}
                    numReplies={collection.numReplies}
                />
            );
        });

        return(
            <div className="CollectionList">
                <Header/>
                <SideBar/>
                <div className="CollectionListContent">
                    <h>Your Colletion List</h>
                    {collectionCards}
                </div>
            </div>
        );
    };
};

CollectionList.defaultProps = {
    collections : [
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
}

export default CollectionList;