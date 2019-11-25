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
                if (this.props.moveAfterDone) {
                    // after the job is done, should not return, so use replace
                    this.props.history.replace(this.props.whereToGoAfterConfirm);
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
                      id="modalOpenButton"
                      onClick={this.clickOpenHandler}
                      disabled={this.props.disableCondition}
                    >
                        {this.props.openButtonText}
                    </Button>
                </div>
                <Modal id="warningModal" show={this.state.isModalOpen} onHide={this.clickCancelHandler} centered>
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
    history: PropTypes.objectOf(PropTypes.any),

    // the following props should be given by a calling component
    openButtonText: PropTypes.string,
    whatToWarnText: PropTypes.string,
    whatActionWillBeDone: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    moveAfterDone: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    whereToGoAfterConfirm: PropTypes.string,
    disableCondition: PropTypes.bool,
    disableMessage: PropTypes.string,
};

WarningModal.defaultProps = {
    history: null,
    openButtonText: "",
    whatToWarnText: "",
    whatActionWillBeDone: () => {},
    moveAfterDone: true,
    whereToGoAfterConfirm: "",
    disableCondition: false,
    disableMessage: "",
};
