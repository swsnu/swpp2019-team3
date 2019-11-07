import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CollectionEntry.css";

const CollectionEntry = (props) => (
    <Form.Row className="collection-entry">
        <Form.Check className = "check"
          id="check"
          type="checkbox"
          className="checkButton"
          checked={props.isChecked}
          onChange={props.checkHandler}
          label = {props.title}
        />
    </Form.Row>
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
