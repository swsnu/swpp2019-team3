import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import "./LikeButton.css";
import SVG from "../../svg";


// eslint-disable-next-line react/prefer-stateless-function
class LikeButton extends Component {
    render() {
        const heartImage = this.props.isLiked
            ? (<SVG id="heartFillSVG" name="heart-fill" width="75%" height="75%" />)
            : (<SVG id="heartBlankSVG" name="heart-blank" width="75%" height="75%" />);
        return (
            <Button
              className="LikeButton"
              variant="light"
              //   width={this.props.width}
              //   height={this.props.height}
              onClick={this.props.isLiked ? this.props.unlikeFn : this.props.likeFn}
            >
                <span>
                    {heartImage}
                    {` ${this.props.likeCount}`}
                </span>
            </Button>
        );
    }
}

export default LikeButton;

LikeButton.propTypes = {
    isLiked: PropTypes.bool,
    likeFn: PropTypes.func,
    unlikeFn: PropTypes.func,
    likeCount: PropTypes.number,
    // width: PropTypes.string,
    // height: PropTypes.string,
};

LikeButton.defaultProps = {
    isLiked: false,
    likeFn: () => {},
    unlikeFn: () => {},
    likeCount: 0,
    // width: "80px",
    // height: "40px",
};
