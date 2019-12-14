import React from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import SVG from "../../svg";
import "./SubItemButton.css";

const SubItemButton = (props) => (
    <Button
      className="SubItemButton"
      variant="light"
      width={props.width}
      height={props.height}
      href={props.href}
    >
        <span>
            <SVG name="zoom" height="25px" width="25px" />
            {` ${props.count}`}
        </span>
    </Button>
);

export default SubItemButton;

SubItemButton.propTypes = {
    href: PropTypes.string,
    count: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
};

SubItemButton.defaultProps = {
    href: "/main",
    count: 0,
    width: "auto",
    height: "auto",
};
