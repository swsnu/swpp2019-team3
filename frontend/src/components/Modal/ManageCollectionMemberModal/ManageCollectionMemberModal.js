import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

// import { collectionActions } from "../../../store/actions";
import InviteToCollectionModal from "../InviteToCollectionModal/InviteToCollectionModal";

class ManageCollectionMemberModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };
    }

    clickOpenHandler = () => {
        this.setState({ isModalOpen: true });
    }

    clickCloseHandler = () => {
        this.setState({
            isModalOpen: false,
        });
    }

    render() {
        return (
            <div className="ManageCollectionMemberModal">
                <div id="openButtonDiv">
                    <Button id="modalOpenButton" onClick={this.clickOpenHandler}>
                        Manage Members
                    </Button>
                </div>
                <Modal id="memberModal" show={this.state.isModalOpen} centered>
                    <Modal.Header>
                        <h5 id="createHeaderText">Manage members of {this.props.thisCollection.title}</h5>
                        <Button id="closeButton" onClick={this.clickCloseHandler}>Close</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <InviteToCollectionModal openButtonName="Invite New Users" />
                        <h5 id="temp">a list of members should be here</h5>
                    </Modal.Body>
                    <Modal.Footer />
                </Modal>
            </div>

        );
    }
}

const mapStateToProps = (state) => ({
    thisCollection: state.collection.selected.collection,
    members: state.collection.selected.members,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch) => ({
    // onGetMembers: (collectionId) => dispatch(collectionActions.)
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCollectionMemberModal);

ManageCollectionMemberModal.propTypes = {
    thisCollection: PropTypes.objectOf(PropTypes.any),
};

ManageCollectionMemberModal.defaultProps = {
    thisCollection: {},
};
