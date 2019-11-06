import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CollectionEntry.css";

const CollectionEntry = (props) => (
    <div className="collection-entry">
        <h3 id="collection-title">{props.title}</h3>
        <Form.Check
          type="checkbox"
          className="checkButton"
          checked={props.isChecked}
          onChange={props.checkHandler}
        />
    </div>
);

CollectionEntry.propTypes = {
    title: PropTypes.string,
    isChecked: PropTypes.bool,
    checkHandler: PropTypes.func,
};

CollectionEntry.defaultProps = {
    title: "",
    isChecked: false,
    checkHandler: null,
};

export default CollectionEntry;
