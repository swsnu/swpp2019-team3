import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

class WarningModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };
    }

    clickOpenHandler = () => {
        this.setState({ isModalOpen: true });
    }

    clickConfirmHandler = () => {
        this.props.whatActionWillBeDone();
        this.setState({ isModalOpen: false });
        // after the job is done, should not return, so use replace
        this.props.history.replace(this.props.whereToGoAfterConfirm);
    }

    clickCancelHandler = () => {
        this.setState({ isModalOpen: false });
    }

    render() {
        return (
            <div className="WarningModal">
                <div id="openButtonDiv">
                    <Button id="modalOpenButton" onClick={this.clickOpenHandler}>
                        {this.props.openButtonText}
                    </Button>
                </div>
                <Modal id="warningModal" show={this.state.isModalOpen} centered>
                    <Modal.Header>
                        <h5 id="warningHeaderText">Warning</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="texts">
                            <h5 id="warningContentText">The following action will be done, however it cannot be undone after you press Confirm:</h5>
                            <h5 id="warningWhatWillBeDone">{this.props.whatToWarnText}</h5>
                            <h5 id="continueText">Continue?</h5>
                        </div>
                        <div id="buttons">
                            <Button id="confirmButton" onClick={this.clickConfirmHandler}>
                                Confirm
                            </Button>
                            <Button id="cancelButton" onClick={this.clickCancelHandler}>
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
    openButtonText: PropTypes.string,
    whatToWarnText: PropTypes.string,
    whatActionWillBeDone: PropTypes.func,
    whereToGoAfterConfirm: PropTypes.string,
    history: PropTypes.objectOf(PropTypes.any),
};

WarningModal.defaultProps = {
    openButtonText: "",
    whatToWarnText: "",
    whatActionWillBeDone: null,
    whereToGoAfterConfirm: "",
    history: null,
};
