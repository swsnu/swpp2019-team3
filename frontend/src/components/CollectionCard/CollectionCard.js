import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import "./CollectionCard.css";

class CollectionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            numLikes: 0,
        };
        this.clickCollectionCardUnlikeHandler = this.clickCollectionCardUnlikeHandler.bind(this);
        this.clickCollectionCardLikeHandler = this.clickCollectionCardLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickCollectionCardLikeHandler(collection_id, user_id) {
        const nextState = {
            isLiked: true,
            numLikes: this.state.numLikes + 1,
        };
        this.setState(nextState);
    }

    // handle click 'Unlike' button
    clickCollectionCardUnlikeHandler(collection_id, user_id) {
        const nextState = {
            isLiked: false,
            numLikes: this.state.numLikes - 1,
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
                        <Card.Text>{this.props.numPapers}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button id="like-button" className="like-button" onClick={this.state.isLiked ? this.clickCollectionCardUnlikeHandler : this.clickCollectionCardLikeHandler}>{this.state.numLikes}</Button>
                        <Button href={`/collections/${this.props.id}`}>{this.props.numReplies}</Button>
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
    numPapers: PropTypes.number,
    numReplies: PropTypes.number,
};

CollectionCard.defaultProps = {
    source: "",
    id: 0,
    user: "",
    title: "",
    numPapers: 0,
    numReplies: 0,
};

export default CollectionCard;
