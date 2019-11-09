import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CollectionCard.css";
import SVG from "../../svg";

class CollectionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
        };
        this.clickCollectionCardUnlikeHandler = this.clickCollectionCardUnlikeHandler.bind(this);
        this.clickCollectionCardLikeHandler = this.clickCollectionCardLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickCollectionCardLikeHandler() {
        const nextState = {
            isLiked: true,
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    // handle click 'Unlike' button
    clickCollectionCardUnlikeHandler() {
        const nextState = {
            isLiked: false,
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    render() {
        let header = null;
        if (this.props.headerExists) {
            header = <Card.Header>{`${this.props.user} ${this.props.source} this collection.`}</Card.Header>;
        }
        return (
            <div className="wrapper">
                <Card className="collection">
                    {header}
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link className="text" href={`/collection_id=${this.props.id}`}>{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>papers: {this.props.paperCount}</Card.Text>
                        <Card.Text>members: {this.props.memberCount}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="footer">

                        <Button variant="light" id="like-button" className="like-button" onClick={this.state.isLiked ? this.clickCollectionCardUnlikeHandler : this.clickCollectionCardLikeHandler}>
                            <div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>
                            {this.state.likeCount}
                        </Button>

                        <Button variant="light" className="reply-button" href={`/collection_id=${this.props.id}`}><div className="reply-image"><SVG name="zoom" height="70%" width="70%" /></div>{this.props.replyCount}</Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

CollectionCard.propTypes = {
    source: PropTypes.string,
    id: PropTypes.number,
    user: PropTypes.string,
    title: PropTypes.string,
    memberCount: PropTypes.number,
    paperCount: PropTypes.number,
    replyCount: PropTypes.number,
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
};

CollectionCard.defaultProps = {
    source: "",
    id: 0,
    user: "",
    title: "",
    memberCount: 1,
    paperCount: 0,
    replyCount: 0,
    likeCount: 0,
    isLiked: false,
    headerExists: true,
};

export default CollectionCard;
