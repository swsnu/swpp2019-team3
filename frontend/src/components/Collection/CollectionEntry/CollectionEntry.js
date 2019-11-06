import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CollectionEntry.css";

const CollectionEntry = (props) => (
    <Form className="collection-entry">
        <Form.Row>
            <Form.Check
              id="check"
              type="checkbox"
              className="checkButton"
              checked={props.isChecked}
              onChange={props.checkHandler}
            />
            <h3 id="collection-title">{props.title}</h3>
        </Form.Row>
    </Form>
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
