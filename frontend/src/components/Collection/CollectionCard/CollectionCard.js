import React, { Component } from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { collectionActions } from "../../../store/actions";
import "./CollectionCard.css";
import { LikeButton, SubItemButton } from "../../Button/index";
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
                <Card.Header id="headerCollectionSubscription">
                    <span className="CardHeaderText">
                        <a className="actorLink" href={`/profile_id=${this.props.actor.id}`}>{this.props.actor.username}</a>
                        {` ${this.props.verb} this collection`}
                    </span>
                </Card.Header>
            );
        }

        let typeIcon = null;
        if (this.props.type === "private") {
            typeIcon = (
                <SVG name="lock" height="8%" width="8%" />
            );
        }

        return (
            <div className="wrapper">
                <Card className="collection">
                    {header}
                    <Card.Body className="body">
                        <div className="title">
                            {typeIcon}&nbsp;
                            <Card.Link className="text" href={`/collection_id=${this.props.id}`}>{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>papers: {this.props.paperCount}</Card.Text>
                        <Card.Text>members: {this.props.memberCount}</Card.Text>
                        <div className="owner">
                        owner:&nbsp;
                            <Card.Link href={`/profile_id=${this.props.owner.id}`} className="text">{this.props.owner.username}</Card.Link>
                        </div>
                    </Card.Body>
                    <Card.Footer className="footer">
                        <LikeButton
                          id="likeButton"
                          isLiked={this.state.isLiked}
                          likeFn={this.clickCollectionCardLikeHandler}
                          unlikeFn={this.clickCollectionCardUnlikeHandler}
                          likeCount={this.state.likeCount}
                        />
                        <SubItemButton
                          id="replyButton"
                          onClick={() => { this.props.history.push({ pathname: `/collection_id=${this.props.id}`, state: "replyTab" }); }}
                          count={this.props.replyCount}
                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CollectionCard));

CollectionCard.propTypes = {
    id: PropTypes.number,
    history: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    memberCount: PropTypes.number,
    paperCount: PropTypes.number,
    replyCount: PropTypes.number,
    likeCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
    afterLikeCount: PropTypes.number,
    afterUnlikeCount: PropTypes.number,
    owner: PropTypes.objectOf(PropTypes.any),
    onLikeCollection: PropTypes.func,
    onUnlikeCollection: PropTypes.func,
    subscription: PropTypes.bool,
    actor: PropTypes.objectOf(PropTypes.any),
    verb: PropTypes.string,
    type: PropTypes.string,
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
    owner: {},
    onLikeCollection: () => {},
    onUnlikeCollection: () => {},
    subscription: false,
    actor: {},
    verb: "",
    type: "public",
    target: {},
    history: null,
};
