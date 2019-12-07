import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { collectionActions } from "../../../store/actions";
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
        this.props.onLikeCollection({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterLikeCount });
                this.setState({ isLiked: true });
            });
    }

    // handle click 'Unlike' button
    clickCollectionCardUnlikeHandler() {
        this.props.onUnlikeCollection({ id: this.props.id })
            .then(() => {
                this.setState({ likeCount: this.props.afterUnlikeCount });
                this.setState({ isLiked: false });
            });
    }

    render() {
        let header = null;
        if (this.props.headerExists && this.props.subscription) {
            header = (
                <Card.Header id="headerSubscription">
                    <div className="CardHeader">
                        <a className="actorLink" href={`/profile_id=${this.props.actor.id}`}>{this.props.actor.username}</a>
                        <h5 className="verb">{` ${this.props.verb} this collection`}</h5>
                    </div>
                </Card.Header>
            );
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
                        <Button
                          variant="light"
                          className="like-button"
                          onClick={this.state.isLiked
                              ? this.clickCollectionCardUnlikeHandler
                              : this.clickCollectionCardLikeHandler}
                        >
                            <div className="heart-image">
                                <SVG name="heart" height="70%" width="70%" />
                            </div>
                            {this.state.likeCount}
                        </Button>
                        <Button
                          variant="light"
                          className="reply-button"
                          href={`/collection_id=${this.props.id}`}
                        >
                            <div className="reply-image">
                                <SVG name="zoom" height="70%" width="70%" />
                            </div>
                            {this.props.replyCount}
                        </Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    likeCollectionStatus: state.collection.like.status,
    afterLikeCount: state.collection.like.count,
    unlikeCollectionStatus: state.collection.unlike.status,
    afterUnlikeCount: state.collection.unlike.count,
});

const mapDispatchToProps = (dispatch) => ({
    onLikeCollection: (collectionId) => dispatch(
        collectionActions.likeCollection(collectionId),
    ),
    onUnlikeCollection: (collectionId) => dispatch(
        collectionActions.unlikeCollection(collectionId),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionCard);

CollectionCard.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    memberCount: PropTypes.number,
    paperCount: PropTypes.number,
    replyCount: PropTypes.number,
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    onLikeCollection: PropTypes.func,
    onUnlikeCollection: PropTypes.func,
    subscription: PropTypes.bool,
    actor: PropTypes.objectOf(PropTypes.any),
    verb: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    target: PropTypes.objectOf(PropTypes.any),
};

CollectionCard.defaultProps = {
    id: 0,
    title: "",
    memberCount: 1,
    paperCount: 0,
    replyCount: 0,
    likeCount: 0,
    isLiked: false,
    headerExists: true,
    afterLikeCount: 0,
    afterUnlikeCount: 0,
    onLikeCollection: () => {},
    onUnlikeCollection: () => {},
    subscription: false,
    actor: {},
    verb: "",
    target: {},
};
