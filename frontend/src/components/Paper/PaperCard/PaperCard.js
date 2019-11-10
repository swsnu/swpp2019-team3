import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./PaperCard.css";
import AddPaperModal from "../../Modal/AddPaperModal/AddPaperModal";
import SVG from "../../svg";

class PaperCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: this.props.isLiked,
            likeCount: this.props.likeCount,
            authorNames: "",
            keywords: "",
        };
        this.clickPaperCardUnlikeHandler = this.clickPaperCardUnlikeHandler.bind(this);
        this.clickPaperCardLikeHandler = this.clickPaperCardLikeHandler.bind(this);
    }

    componentDidMount() {
        if (this.props.authors.length > 0) {
            const authorNames = this.props.authors.map((author) => `${author.first_name} ${author.last_name}`);
            this.setState({ authorNames: authorNames.join(", ") });
        }
        if (this.props.keywords.length > 0) {
            this.setState({ keywords: this.props.keywords.join(", ") });
        }
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
        let addButton = null;
        if (this.props.addButtonExists) {
            addButton = <AddPaperModal className="add-button" id={this.props.id} history={this.props.history} />;
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
                        <Card.Text>{this.state.authorNames}</Card.Text>
                        <Card.Text>{this.state.keywords}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="footer">

                        <Button variant="light" className="like-button" onClick={this.state.isLiked ? this.clickPaperCardUnlikeHandler : this.clickPaperCardLikeHandler}><div className="heart-image"><SVG name="heart" height="70%" width="70%" /></div>{this.state.likeCount}</Button>

                        <Button variant="light" className="review-button" href={`/paper_id=${this.props.id}`}>
                            <div className="review-image"><SVG name="zoom" height="70%" width="70%" /></div>{this.props.reviewCount}
                        </Button>
                        {addButton}
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

PaperCard.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    source: PropTypes.string,
    id: PropTypes.number,
    user: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    keywords: PropTypes.arrayOf(PropTypes.string),
    likeCount: PropTypes.number,
    reviewCount: PropTypes.number,
    isLiked: PropTypes.bool,
    headerExists: PropTypes.bool,
    addButtonExists: PropTypes.bool,
};

PaperCard.defaultProps = {
    history: null,
    source: "",
    id: 0,
    user: "",
    title: "",
    date: "",
    authors: [],
    keywords: [],
    likeCount: 0,
    reviewCount: 0,
    isLiked: false,
    headerExists: true,
    addButtonExists: false,
};

export default PaperCard;
