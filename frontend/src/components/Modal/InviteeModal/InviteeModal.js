import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

import "./InviteeModal.css";

class InviteeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };

        this.clickUpdateButtonHandler = this.clickUpdateButtonHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
        this.clickGotoButtonHandler = this.clickGotoButtonHandler.bind(this);
    }

    clickUpdateButtonHandler = () => {
        this.props.whatActionWillBeDone();
        // NOTE: this modal will be open even though updating fails
        this.setState({ isModalOpen: true });
    }

    clickGotoButtonHandler() {
        this.setState({ isModalOpen: false });
        this.props.history.push("/collections");
    }

    clickCancelHandler() {
        this.setState({ isModalOpen: false });
    }

    render() {
        return (
            <div className="gotomycollectionsmodal">
                <Button
                  className="update-button"
                  onClick={this.clickUpdateButtonHandler}
                  disabled={this.props.disableCondition}
                >
                    Update
                </Button>
                <Modal
                  show={this.state.isModalOpen}
                  onHide={this.clickCancelHandler}
                  className="modal"
                  centered
                >
                    <Modal.Header>
                        <h2 id="updated-paper-to-collections">Updated collections!</h2>

                    </Modal.Header>
                    <Modal.Body>
                        <div className="buttons">
                            <Button
                              className="go-button"
                              onClick={this.clickGotoButtonHandler}
                            >My Collection
                            </Button>
                            <Button className="cancel-button" onClick={this.clickCancelHandler}>Cancel</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default InviteeModal;

InviteeModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    whatActionWillBeDone: PropTypes.func,
    disableCondition: PropTypes.bool,
};

InviteeModal.defaultProps = {
    history: null,
    whatActionWillBeDone: () => {},
    disableCondition: true,
};
