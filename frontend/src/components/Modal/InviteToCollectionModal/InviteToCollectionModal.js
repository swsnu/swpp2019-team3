import React, { Component } from "react";
import {
    Modal, Button, FormControl, Form,
} from "react-bootstrap";

class InviteToCollectionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKeyWord: "",
            isModalDisplaying: false,
            isSearchResult: false,
        };
    }

    openModalHandler= () => {

    }

    render() {
        const userList = null;


        return (
            <div className="InviteToCollectionModal">
                <div className="OpenButton">
                    <Button id="openButton" onClick={this.openModalHandler()}>Invite</Button>
                </div>
                <div className="InviteModalArea">
                    <Modal
                      className="InviteModal"
                      show={this.state.isModalDisplaying}
                      centered
                    >
                        <Modal.Header className="ModalHeader">
                            <div className="HeaderContent" />
                        </Modal.Header>
                        <Modal.Body className="ModalBody">
                            <FormControl
                              className=""
                              type="text"
                              placeholder="Browse user to invite"
                              value={this.state.searchKeyWord}
                              onChange={(event) => this.setState({
                                  searchKeyWord: event.target.value,
                              })}
                            />
                            <Form><Form.Group controlId="A" id="userList">{userList}</Form.Group></Form>
                        </Modal.Body>
                    </Modal>
                </div>
                asdf
            </div>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(InviteToCollectionModal);
