import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

class WarningModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };

        this.clickOpenHandler = this.clickOpenHandler.bind(this);
        this.clickConfirmHandler = this.clickConfirmHandler.bind(this);
        this.clickCancelHandler = this.clickCancelHandler.bind(this);
    }

    clickOpenHandler = () => {
        this.setState({ isModalOpen: true });
    }

    clickConfirmHandler = () => {
        this.props.whatActionWillBeDone()
            .then(() => {
                this.setState({ isModalOpen: false });
                if (this.props.whatActionWillFollow) {
                    this.props.whatActionWillFollow();
                }
            })
            .catch(() => {});
    }

    clickCancelHandler = () => {
        this.setState({ isModalOpen: false });
    }

    render() {
        const disableMessage = this.props.disableCondition
            ? (
                <div>
                    <h5 id="disableMessage">{this.props.disableMessage}</h5>
                </div>
            )
            : <div />;
        return (
            <div className="WarningModal">
                <div id="openButtonDiv">
                    {disableMessage}
                    <Button
                      variant={this.props.variant}
                      id="modalOpenButton"
                      onClick={this.clickOpenHandler}
                      disabled={this.props.disableCondition}
                    >
                        {this.props.openButtonText}
                    </Button>
                </div>
                <Modal id="warningModal" show={this.state.isModalOpen} onHide={this.clickCancelHandler} centered>
                    <Modal.Header className="ModalHeader">
                        <h5 id="warningHeaderText">Warning</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="texts">
                            <h5 id="warningContentText">The following action will be done, however it cannot be undone after you press Confirm:</h5>
                            <h5 id="warningWhatWillBeDone">{this.props.whatToWarnText}</h5>
                            <h5 id="continueText">Continue?</h5>
                        </div>
                        <div id="buttons">
                            <Button variant="danger" id="confirmButton" onClick={this.clickConfirmHandler}>
                                Confirm
                            </Button>
                            <Button variant="secondary" id="cancelButton" onClick={this.clickCancelHandler}>
                                Cancel
                            </Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer />
                </Modal>
            </div>
        );
    }
}

export default WarningModal;

WarningModal.propTypes = {
    // the following props should be given by a calling component
    openButtonText: PropTypes.string,
    whatToWarnText: PropTypes.string,
    whatActionWillBeDone: PropTypes.func,
    whatActionWillFollow: PropTypes.func,
    disableCondition: PropTypes.bool,
    disableMessage: PropTypes.string,
    variant: PropTypes.string,
};

WarningModal.defaultProps = {
    openButtonText: "",
    whatToWarnText: "",
    whatActionWillBeDone: () => {},
    whatActionWillFollow: () => {},
    disableCondition: false,
    disableMessage: "",
    variant: "primary",
};
