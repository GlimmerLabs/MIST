import React, { useState, useContext } from "react";
import { UserContext } from "../../pages/components/Contexts/UserContext";
import { Button, Form, Modal } from "react-bootstrap";
import { deleteWorkspace } from "../http.workspace";
import PropTypes from "prop-types";

function DeleteWorkspaceModal(props) {
    const { user, updateAuthenticatedUser } = useContext(UserContext);
    const workspaces = user.workspaces || [];
    const [chosenWorkspace, changeChosenWorkspace] = useState("");
    const onSubmit = (e) => {
        // prevent reload
        e.preventDefault();
        props.openConfirmationPopup(`You are about to delete the workspace: '${chosenWorkspace}'`,
            () => deleteWorkspace(chosenWorkspace, updateAuthenticatedUser));
    }
    return (
        <Modal centered show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete a workspace</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group controlId="DeleteSelect">
                        <Form.Label>Select a workspace to delete</Form.Label>
                        <Form.Control
                            as="select"
                            custom
                            onChange={(e) => changeChosenWorkspace(e.target.value)}
                            required>
                            <option value=""> Select a workspace </option>
                            {workspaces.map(workspace => (
                                <option>
                                    {workspace.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}> Cancel </Button>
                    <Button type="submit" variant="danger">Delete</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

DeleteWorkspaceModal.propTypes = {
	openConfirmationPopup: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
}
export default DeleteWorkspaceModal;
