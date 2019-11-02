import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

import {Header, SideBar} from "../../../components";
import PaperCard from  "../../../components/Paper/PaperCard/PaperCard"

class CollectionDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            isPaperTab: true,
            newReplyContent: "",
            replies: this.props.thisCollection.replies,
        };
    };

// clickInviteButtonHandler(): Open ‘Invite to the collection’ popup.
// clickRemovePaperButtonHandler(collection_id: number, paper_id: number)
// : Call onRemoveCollectionPaper of CollectionDetail to remove the paper from the collection.
// clickLikeButtonHandler(collection_id: number, user_id: number)
// : Call onAddCollectionLike of CollectionDetail to change the like status between the user and the collection.
// clickUnlikeButtonHandler(collection_id: number, user_id: number)
// : Call onRemoveCollectionLike of CollectionDetail to change the like status between the user and the collection.
    
    // addNewReplyHandler = () => {

    // }

    render(){
        let likeButton = <Button id="likeButton">Like</Button>;
        let unlikeButton = <Button id="unlikeButton">Unlike</Button>;
        let inviteButton = <Button id="inviteButton" onClick={() => alert("will be implemented soon!")}>Invite</Button>;
        let editButton = <Link to={'/collections/'+this.props.thisCollection.id+'/edit/'}>
            <Button id="editButton">Edit</Button>
        </Link>;

        let paperCards = this.props.thisCollection.papers.map(paper => {
            return(
                <PaperCard
                    source={paper.source}
                    id={paper.id}
                    user={paper.user}
                    title={paper.title}
                    date={paper.date}
                    authors={paper.authors}
                    keywords={paper.keywords}
                    numReplies={paper.numReplies}
                />
            );
        });

        let replies = this.props.thisCollection.replies.map(reply => {
            //reply will be added soon
        });

        let itemTab = this.state.isPaperTab
            ? <div id="paperTab">{paperCards}</div> 
            : <div id="replyTab">
                <div id="createNewReply">
                    <textarea id='newReplyContentInput' type='text' value={this.state.newReplyContent}
                        onChange={(event) => this.setState({newReplyContent: event.target.value})}/>
                    <Button onClick={this.addNewReplyHandler()}>Add</Button>
                </div>
                <div id="replyList">
                    {replies}
                </div>
            </div>;
        return(
            <div className="CollectionDetail">
                <Header/>
                <SideBar/>
                <div className="CollectionDetailContent">
                    <div className="collectionInfo">
                        <div className="collectionName">
                            <h2 id="collectionName">{this.props.thisCollection.name}</h2>
                        </div>
                        <div className="collectionStat">
                            <div id="likeStat">
                                <h5 id="likeCount">{this.props.thisCollection.likesCount}</h5>
                                <h5 id="likeText">Likes</h5>
                            </div>
                            <div id="memberStat">
                                <h5 id="memberCount">{this.props.thisCollection.members.length}</h5>
                                <h5 id="memberText">Members</h5>   
                            </div>
                        </div>
                        <div className="collectionButtons">                            
                            {likeButton}
                            {inviteButton}
                            {this.props.thisCollection.amIMember ? editButton : <div/>}
                        </div>
                        <div className="collectionDescription">
                            <h5 id="creationDate">{this.props.thisCollection.creationDate}</h5>
                            <h5 id="lastUpdateDate">{this.props.thisCollection.lastUpdateDate}</h5>
                            <p id="collectionDescription">{this.props.thisCollection.description}</p>
                        </div>
                    </div>
                    <div className="itemList">
                        <h3 id="paperTabButton" onClick={() => this.setState({isPaperTab:true})}>Papers</h3>
                        <h3 id="replyTabButton" onClick={() => this.setState({isPaperTab:false})}>Replies</h3>
                        {itemTab}
                    </div>
                </div>
            </div>
        );
    };
};

CollectionDetail.defaultProps = {
    currentUserID: 1,
    thisCollection: {
        id: 1,
        name: "qwer collection",
        description: "asdf",
        creationDate: "180102",
        lastUpdateDate: "191031",
        papers: [
            {
                source: "added",
                id : 1,
                user : "Testing Module",
                title : "title:test",
                date : "date:111111",
                authors : "author:test",
                keywords : "keywords:test",
                numReplies : 3,
            },
            {
                source: "added",
                id : 2,
                user : "Testing Module",
                title : "title:test2",
                date : "date:111111",
                authors : "author:test",
                keywords : "keywords:test",
                numReplies : 3,
            },
            {
                source: "added",
                id : 3,
                user : "Testing Module",
                title : "title:test3",
                date : "date:111111",
                authors : "author:test",
                keywords : "keywords:test",
                numReplies : 3,
            },
            {
                source: "added",
                id : 4,
                user : "Testing Module",
                title : "title:test4",
                date : "date:111111",
                authors : "author:test",
                keywords : "keywords:test",
                numReplies : 3,
            },
        ],
        members: [
            "Anna",
            "Betty",
            "Charlie",
            "Dophio",
            "Emily",
        ],
        replies: [],
        likesCount: 0,
        isLiked: false,
        amIMember: true
    },
}

export default CollectionDetail;