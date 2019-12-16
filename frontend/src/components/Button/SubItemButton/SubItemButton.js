import React from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import SVG from "../../svg";
import "./SubItemButton.css";

const SubItemButton = (props) => (
    <Button
      className="SubItemButton"
      variant="outline-secondary"
      width={props.width}
      height={props.height}
      onClick={props.click}
      href={props.tab ? null : props.href}
    >
        <span>
            <SVG name={props.svgName} height="25px" width="25px" />
            {` ${props.count}`}
        </span>
    </Button>
);

export default SubItemButton;

SubItemButton.propTypes = {
    svgName: PropTypes.string,
    href: PropTypes.string,
    count: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
    click: PropTypes.func,
    tab: PropTypes.bool,
};

SubItemButton.defaultProps = {
    svgName: "zoom",
    href: "/main",
    count: 0,
    width: "auto",
    height: "auto",
    click: () => {},
    tab: false,
};
