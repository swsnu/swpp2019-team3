import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const UserEntry = (props) => (
    <Form.Row className="UserEntry">
        {props.showCheck
            ? (
                <Form.Check
                  className="entryItem"
                  id="check"
                  //   label={props.userName}
                  type={props.type}
                  checked={props.isChecked}
                  onChange={props.checkhandler}
                />
            )
            : <div /> }
        <h5>{props.userName}</h5>
        <h5>{props.userDesc}</h5>
    </Form.Row>
);

UserEntry.propTypes = {
    userName: PropTypes.string,
    userDesc: PropTypes.string,
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
