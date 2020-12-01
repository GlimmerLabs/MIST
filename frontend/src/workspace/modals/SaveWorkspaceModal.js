import React, { useState, useContext } from "react";
import { UserContext } from "../../pages/components/Contexts/UserContext";
import { Button, Form, Modal } from "react-bootstrap";
import { workspaceExists, saveWorkspace } from "../http.workspace";
import PropTypes from "prop-types";

function SaveWorkspaceModal(props) {
  const [workspaceName, setWorkspaceName] = useState("");

  const { updateAuthenticatedUser } = useContext(UserContext);

  function save(workspaceName, workspaceData) {
    function resolveSave() {
      alert(`Successfully saved workspace with name ${workspaceName}`);
      updateAuthenticatedUser();
      setWorkspaceName("");
    };
    function resolve(exists) {
      if (exists) {
        props.openConfirmationPopup(`You are about to overwrite the workspace '${workspaceName}'`, () => saveWorkspace(workspaceName, workspaceData, resolveSave));
      } else {
        saveWorkspace(workspaceName, workspaceData, resolveSave);
      }
    };
    workspaceExists(workspaceName, resolve);
  }

  function onSubmit(e) {
    // prevent reload
    e.preventDefault();
    save(workspaceName, props.workspaceData);
  }

  return (
    <Modal centered show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save you workspace</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group controlId="workspace">
            <Form.Label>Workspace</Form.Label>
            <Form.Control
              pattern="\S(.*\S)?"
              placeholder="Name your workspace"
              required
              title="No whitespace characters at the beginning or end and at least one non-whitespace character"
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={props.handleClose} variant='secondary'>
            Exit
        </Button>
          <Button type="submit">
            Save
        </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

SaveWorkspaceModal.propTypes = {	
    handleClose: PropTypes.func.isRequired,
    openConfirmationPopup: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    workspaceData: PropTypes.shape({
        nodes: PropTypes.array.isRequired,
        lines: PropTypes.array.isRequired
    }).isRequired
}

export default SaveWorkspaceModal;