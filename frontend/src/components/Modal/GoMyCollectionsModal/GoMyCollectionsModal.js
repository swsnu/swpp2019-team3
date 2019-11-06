import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import "./GoMyCollectionsModal.css";

class GoMyCollectionsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: this.props.openTrigger,
        };
        this.openModalHandler = this.openModalHandler.bind(this);
        this.clickCancelButtonHandler = this.clickCancelButtonHandler.bind(this);
        this.clickGotoButtonHandler = this.clickGotoButtonHandler.bind(this);
    }

    openModalHandler() {
        this.setState({ isModalOpen: true });
    }

    clickGotoButtonHandler() {
        this.setState({ isModalOpen: false });
        this.props.history.push("/collections");
    }

    clickCancelButtonHandler() {
        this.setState({ isModalOpen: false });
    }

    render() {
        return (
            <div className="gotomodal">
                <div className="trigger" />
                <Modal
                  show={this.state.isModalOpen}
                  className="addpaper-modal"
                  centered
                >
                    <Modal.Header>
                        <h2 id="added-paper-to-collections">Added paper to collections!</h2>

                    </Modal.Header>
                    <Modal.Body>
                        <div className="buttons">
                            <Button
                              className="go-button"
                              onClick={this.clickGotoButtonHandler}
                            >Go
                            </Button>
                            <Button className="cancel-button" onClick={this.clickCancelButtonHandler}>Cancel</Button>
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

export default GoMyCollectionsModal;

GoMyCollectionsModal.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    openTrigger: PropTypes.bool,
};

GoMyCollectionsModal.defaultProps = {
    history: null,
    openTrigger: false,
};
