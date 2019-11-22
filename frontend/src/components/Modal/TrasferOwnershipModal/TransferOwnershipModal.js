import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

// import { collectionActions } from "../../../store/actions";
import WarningModal from "../WarningModal/WarningModal";

class TransferOwnershipModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };
    }

    clickOpenHandler = () => {
        this.setState({ isModalOpen: true });
    }

    clickCancelHandler = () => {
        this.setState({ isModalOpen: false });
    }

    clickWarningConfirmAction = () => {
        // this.props.onTransferOwnership();

        // Currently, there is no api for get a list of members of the collection
        // and change ownership of it. Once they are implemented, this function can
        // also be implemented and it should work.
    }

    render() {
        return (
            <div className="TransferOwnership">
                <div id="openButtonDiv">
                    <Button id="modalOpenButton" onClick={this.clickOpenHandler}>
                        Transfer Ownership
                    </Button>
                </div>
                <Modal id="transferModal" show={this.state.isModalOpen} centered>
                    <Modal.Header>
                        <h5 id="transferHeaderText">Transfer ownership of {this.collectionName}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 id="temp">temp content: the list of collection members should be here</h5>
                        {/* the list of collection members should be here */}
                    </Modal.Body>
                    <Modal.Footer>
                        <WarningModal
                          openButtonText="Transfer to ..."
                          whatToWarnText={`Trnasfer "${this.props.collectionName}" to "${"Test User"}"`}
                          whatActionWillBeDone={this.clickWarningConfirmAction}
                          whereToGoAfterConfirm={`/collection_id=${this.props.collectionId}`}
                          history={this.props.history}
                        />
                        <Button id="cancelButton" onClick={this.clickCancelHandler}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

// const mapStateToProps = (state) => ({
//     collectionMembers: state.collection.selected.members,
// });

// const mapDispatchToProps = (dispatch) => ({
//     onGetCollectionMembers,
//     onTransferOwnership: (collectionId, targetUserId) =>
//         dispatch(collectionActions.setOwner(collectionId, targetUserId)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(TransferOwnershipModal);
export default TransferOwnershipModal;

TransferOwnershipModal.propTypes = {
    collectionId: PropTypes.number,
    collectionName: PropTypes.string,
    history: PropTypes.objectOf(PropTypes.any),
};

TransferOwnershipModal.defaultProps = {
    collectionId: -1,
    collectionName: "",
    history: null,
};
