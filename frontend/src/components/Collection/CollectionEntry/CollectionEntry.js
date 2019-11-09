import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CollectionEntry.css";

const CollectionEntry = (props) => (
    <Form.Row className="collection-entry">
        <Form.Check
          className="check-entry"
          id="check"
          type="checkbox"
          checked={props.ischecked}
          onChange={props.checkhandler}
          label={props.title}
        />
    </Form.Row>
);

CollectionEntry.propTypes = {
    title: PropTypes.string,
    ischecked: PropTypes.bool,
    checkhandler: PropTypes.func,
};

CollectionEntry.defaultProps = {
    title: "",
    ischecked: false,
    checkhandler: null,
};

export default CollectionEntry;
