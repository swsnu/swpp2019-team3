import React from "react";
import { Image } from "react-bootstrap";
import PropTypes from "prop-types";

import * as photo from "../../../resource/photo/index";

const PhotoDisplayer = (props) => {
    let picture = null;
    switch (props.index) {
    case 0:
        picture = photo.samplePic0;
        break;
    case 1:
        picture = photo.samplePic1;
        break;
    case 2:
        picture = photo.samplePic2;
        break;
    case 3:
        picture = photo.samplePic3;
        break;
    case 4:
        picture = photo.samplePic4;
        break;
    case 5:
        picture = photo.samplePic5;
        break;
    case 6:
        picture = photo.samplePic6;
        break;
    case 7:
        picture = photo.samplePic7;
        break;
    case 8:
        picture = photo.samplePic8;
        break;
    case 9:
        picture = photo.samplePic9;
        break;
    case 10:
        picture = photo.samplePic10;
        break;
    case 11:
        picture = photo.samplePic11;
        break;
    case 12:
        picture = photo.samplePic12;
        break;
    case 13:
        picture = photo.samplePic13;
        break;
    case 14:
        picture = photo.samplePic14;
        break;
    default:
    }
    return (
        <Image
          id="userPhoto"
          src={picture}
          width={props.width}
          height={props.height}
          roundedCircle={props.roundedCircle}
        />
    );
};

export default PhotoDisplayer;

PhotoDisplayer.propTypes = {
    index: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
    roundedCircle: PropTypes.bool,
};

PhotoDisplayer.defaultProps = {
    index: 0,
    width: "150px",
    height: "150px",
    roundedCircle: false,
};
