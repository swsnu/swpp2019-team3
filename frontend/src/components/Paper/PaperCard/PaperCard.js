import React, { Component } from "react";
import { Card, Button, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import "./PaperCard.css";
import heart from "../../heart.png";
import talk from "../../talk.png";

class PaperCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
        };
        this.clickPaperCardUnlikeHandler = this.clickPaperCardUnlikeHandler.bind(this);
        this.clickPaperCardLikeHandler = this.clickPaperCardLikeHandler.bind(this);
    }

    // handle click 'Like' button
    clickPaperCardLikeHandler() {
        const nextState = {
            isLiked: true,
            likeCount: this.state.likeCount + 1,
        };
        this.setState(nextState);
    }

    // handle click 'Unlike' button
    clickPaperCardUnlikeHandler() {
        const nextState = {
            isLiked: false,
            likeCount: this.state.likeCount - 1,
        };
        this.setState(nextState);
    }

    render() {
        let header = null;
        if (this.props.headerExists) {
            header = <Card.Header>{`${this.props.user} ${this.props.source} this paper.`}</Card.Header>;
        }
        return (
            <div className="wrapper">
                <Card className="paper">
                    {header}
                    <Card.Body className="body">
                        <div className="title">
                            <Card.Link href={`/paper_id=${this.props.id}`} className="text">{this.props.title}</Card.Link>
                        </div>
                        <Card.Text>{this.props.date}</Card.Text>
                        <Card.Text>{this.props.authors}</Card.Text>
                        <Card.Text>{this.props.keywords}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="footer">

                        <Button variant="light" className="like-button" onClick={this.state.isLiked ? this.clickPaperCardUnlikeHandler : this.clickPaperCardLikeHandler}><Image src={heart} width={20} height={20} className="heart-image" />{this.state.likeCount}</Button>

                        <Button variant="light" className="review-button" href={`/paper_id=${this.props.id}`}>
                            <Image src={talk} width={20} height={20} className="talk-image" />{this.props.reviewCount}
                        </Button>
                        <Button className="add-button">Add</Button>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

PaperCard.propTypes = {
    source: PropTypes.string,
    id: PropTypes.number,
    user: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.string,
    keywords: PropTypes.string,
    likeCount: PropTypes.number,
    reviewCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
};

PaperCard.defaultProps = {
    source: "",
    id: 0,
    user: "",
    title: "",
    date: "",
    authors: "",
    keywords: "",
    likeCount: 0,
    reviewCount: 0,
    isLiked: false,
    headerExists: true,
};

export default PaperCard;
