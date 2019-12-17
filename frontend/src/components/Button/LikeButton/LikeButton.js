import React from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import "./LikeButton.css";
import SVG from "../../svg";


const LikeButton = (props) => {
    const heartImage = props.isLiked
        ? (<SVG id="heartFillSVG" name="heart-fill" width="25px" height="25px" />)
        : (<SVG id="heartBlankSVG" name="heart-blank" width="25px" height="25px" />);
    return (
        <Button
          className="LikeButton"
          variant="light"
          width={props.width}
          height={props.height}
          onClick={props.isLiked ? props.unlikeFn : props.likeFn}
        >
            <span>
                {heartImage}
                {` ${props.likeCount}`}
            </span>
        </Button>
    );
};


export default LikeButton;

LikeButton.propTypes = {
    isLiked: PropTypes.bool,
    likeFn: PropTypes.func,
    unlikeFn: PropTypes.func,
    likeCount: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
};

LikeButton.defaultProps = {
    isLiked: false,
    likeFn: () => {},
    unlikeFn: () => {},
    likeCount: 0,
    width: "auto",
    height: "auto",
};
