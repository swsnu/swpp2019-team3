import React from "react";
import PropTypes from "prop-types";

import PhotoDisplayer from "../PhotoDisplayer/PhotoDisplayer";
import "./PhotoCheckBox.css";

const PhotoCheckBox = (props) => {
    const checkBoxPhoto = (
        <PhotoDisplayer
          index={props.index}
          width={props.size}
          height={props.size}
        />
    );
    return (
        <li className="PhotoCheckBox">
            <input
              className="PhotoCheck"
              id={`checked${props.index}`}
              type="radio"
              name="photoCheckBox"
              value={props.index}
              checked={props.checked}
              onChange={props.checkHandler}
            />
            <label htmlFor={`checked${props.index}`}>
                {checkBoxPhoto}
            </label>
        </li>
    );
};

export default PhotoCheckBox;

PhotoCheckBox.propTypes = {
    index: PropTypes.number,
    checked: PropTypes.bool,
    size: PropTypes.string,
    checkHandler: PropTypes.func,
};

PhotoCheckBox.defaultProps = {
    index: 0,
    checked: false,
    size: "150px",
    checkHandler: () => {},
};
