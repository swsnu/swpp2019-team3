import React, { Component } from "react";
import { Button, Image, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CollectionCard.css";
import heart from "../../heart.png";
import talk from "../../talk.png";

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
        return (
            <div className="wrapper">
                <Card className="collection">
                    <Card.Header>{`${this.props.user} ${this.props.source} this collection.`}</Card.Header>
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link className="text" href={`/collections/${this.props.id}`}>{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>Number of papers: {this.props.paperCount}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="footer">

                        <Button variant="light" id="like-button" className="like-button" onClick={this.state.isLiked ? this.clickCollectionCardUnlikeHandler : this.clickCollectionCardLikeHandler}>
                            <Image src={heart} width={20} height={20} className="heart-image" />
                            {this.state.likeCount}
                        </Button>

                        <Button variant="light" className="reply-button" href={`/collections/${this.props.id}`}><Image src={talk} width={20} height={20} className="talk-image" />{this.props.replyCount}</Button>
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
    paperCount: PropTypes.number,
    replyCount: PropTypes.number,
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
};

CollectionCard.defaultProps = {
    source: "",
    id: 0,
    user: "",
    title: "",
    paperCount: 0,
    replyCount: 0,
    likeCount: 0,
    isLiked: false,
};

export default CollectionCard;
