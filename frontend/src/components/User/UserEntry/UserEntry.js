import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import "./UserEntry.css";

const UserEntry = (props) => (
    <Form.Row className="UserEntry">
        {props.showCheck
            ? (
                <Form.Check
                  className="entryItem"
                  id={`check-${props.userName}`}
                  type={props.type}
                  checked={props.isChecked}
                  onChange={props.checkhandler}
                />
            )
            : <div /> }
        <h5 className="userName">{props.userName}</h5>
    </Form.Row>
);

UserEntry.propTypes = {
    userName: PropTypes.string,
    /* eslint-disable react/no-unused-prop-types */
    userDesc: PropTypes.string,
    /* eslint-enable react/no-unused-prop-types */
    type: PropTypes.string,
    isChecked: PropTypes.bool,
    checkhandler: PropTypes.func,
    showCheck: PropTypes.bool,
};

UserEntry.defaultProps = {
    userName: "",
    userDesc: "",
    type: "checkbox",
    isChecked: false,
    checkhandler: null,
    showCheck: true,
};

export default UserEntry;
