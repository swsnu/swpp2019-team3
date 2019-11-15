import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const InviteUserEntry = (props) => (
    <Form.Row className="InviteUserEntry">
        <Form.Check
          className="checkEntry"
          id="check"
          type="checkbox"
          checked={props.isMember}
          onChange={props.checkhandler}
          label={props.name}
        />
    </Form.Row>
);

InviteUserEntry.propTypes = {
    name: PropTypes.string,
    isMember: PropTypes.bool,
    checkhandler: PropTypes.func,
};

InviteUserEntry.defaultProps = {
    name: "",
    isMember: false,
    checkhandler: null,
};

export default InviteUserEntry;
