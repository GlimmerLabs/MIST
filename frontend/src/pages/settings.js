// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * settings.js
 *
 * This exports the settings page.
 * To be developed:
 * changing user info updates database
 * accessibility options work
 * unhiding/blocking content
 *   commented out is the interface for doing this, but it
 *   has not been incorporated into the refactored settings yet
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect } from "react";
import "./../design/styleSheets/tutorial.css";

import {
  Accordion,
  Button,
  ButtonGroup,
  Card,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row,
  Collapse
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

//included only for testing purposes 
import MISTImage from "./components/MISTImageGallery";

// +-------------------+----------------------------------------------------------------------
// | settings.js        |
// +-------------------+
//Page Header
function Settings() {
  return (
    <Container
      fluid
      style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}
    >
      {/* Title */}
      <Container>
        <h1>Account Settings</h1>
      </Container>
      {/* settings */}
      <Container>
        <SettingsTable />
      </Container>
    </Container>
  );
}

//Tables with all setting options
function SettingsTable() {
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api?action=getUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        if (user) {
          setUser(user);
        }
      });
  }, []);

  function changeEmail(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeEmail",
        newEmail: newEmail,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  function changeUsername(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeUsername",
        newUsername: newUsername,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  function changePassword(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changePassword",
        currentPassword: currentPassword,
        newPassword: newPassword,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  function deleteAccount(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "deleteAccount",
        currentPassword: currentPassword,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => {
        if (message === "Deleted. Please Sign Out.") {
          window.location.href = "/";
          alert(message);
        }
      })
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Email</Popover.Title>
      <Popover.Content>
        <Form onSubmit={changeEmail}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const usernamePopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Username</Popover.Title>

      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="username"
              placeholder="Enter new username"
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick={changeUsername}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const password = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Password</Popover.Title>
      <Popover.Content>
        <Form onSubmit={changePassword}>
          <Form.Group controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Enter old password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Form.Control
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick={changePassword}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const deletePopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Delete Account</Popover.Title>
      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick={deleteAccount}>Confirm</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        {/* User Settings */}
        <Accordion.Toggle as={Card.Header} eventKey="0">
          User Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ButtonGroup vertical>
              {/* Privacy */}
              <Button>Privacy</Button>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button>Change Email</Button>
              </OverlayTrigger>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={password}
              >
                <Button>Change Password</Button>
              </OverlayTrigger>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={usernamePopover}
              >
                <Button>Change Username</Button>
              </OverlayTrigger>

              <Button>Blocked Content</Button>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={deletePopover}
              >
                <Button>Delete Account</Button>
              </OverlayTrigger>
            </ButtonGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Accessibility */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
          Accessibility
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <ButtonGroup vertical>
              <Button>Text Size </Button>
              <Button>Magnifier </Button>
              <Button>Animations </Button>
            </ButtonGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Message Settings */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
          Message Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            {" "}
            Recieve Messages From:
            <Form>
              {["radio"].map((type) => (
                <div key={`default-${type}`} className="mb-3">
                  <Form.Check
                    name="radio"
                    type={type}
                    id={`default-${type}`}
                    label={`Anyone`}
                  />

                  <Form.Check
                    name="radio"
                    type={type}
                    id={`default-${type}`}
                    label={`Friends`}
                  />

                  <Form.Check
                    name="radio"
                    type={type}
                    id={`default-${type}`}
                    label={`No Messages`}
                  />
                </div>
              ))}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Notifications */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
          Notifications
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
          <Card.Body>
            Recieve Notifications for:
            <Form>
              {["checkbox"].map((type) => (
                <div key={`default-${type}`} className="mb-3">
                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`Someone Liking Your Image`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`New Badge`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`New Follower`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`Someone You Follow Made a New Image`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`inline`}
                    label={`New MIST Updates`}
                    defaultChecked
                  />
                </div>
              ))}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Blocking/Unhiding Settings */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="4">
          Blocked Users and Hidden Content
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="4">
          <Card.Body>
            <HiddenAndBlockedSettings />
          </Card.Body>
        </Accordion.Collapse>
      </Card>

    </Accordion>
  );
}


/**
  * Gives users the option to unblock/unhide any image, album, comment, and user
  * Displays (in this order) 
  * Hidden Content
      * hidden images
      * hidden albums
      * hidden comments
  * Blocked Users
 */
function HiddenAndBlockedSettings() {
  const [hidden, setHidden] = useState(false);
  const [blocked, setBlocked] = useState(false);

  return (
    <Container>
      <Button
        onClick={() => setHidden(!hidden)}
        aria-controls="hiddenContent"
        aria-expanded={hidden}
        style={{
          marginTop: "1em",
          marginBottom: "1em"
        }}
      >
        Hidden Content
      </Button>
      <Collapse in={hidden}>
        <div id="hiddenContent">
          <HiddenContent />
        </div>
      </Collapse>
      <br />
      <Button
        onClick={() => setBlocked(!blocked)}
        aria-controls="blockedUsers"
        aria-expanded={blocked}
        style={{
          marginBottom: "1em"
        }}
      >
        Blocked Users
      </Button>
      <Collapse in={blocked}>
        <div id="blockedUsers">
          <BlockedUsers />
        </div>
      </Collapse>
    </Container>
  );
}

// the hidden images, albums, and comments
// all have collapsable tabs so the user doesn't have to look at everything 
function HiddenContent() {

  // keep track if the collapsable tab is open
  const [hiddenImages, sethiddenImages] = useState(false);
  const [hiddenAlbums, sethiddenAlbums] = useState(false);
  const [hiddenComments, sethiddenComments] = useState(false);

  //we can change these to use real comments, albums, and images
  let exampleListOfComments = ["bad comment", "star wars stinks", "another bad comment"];
  let exampleListOfAlbums = ["bad album", "bad album 2", "bad album 3"];
  let exampleListOfImages = [<MISTImage code="sin(x)" resolution="250" />,
  <MISTImage code="sum(sin(x), y)" resolution="250" />,
  <MISTImage code="cos(x)" resolution="250" />,
<MISTImage code="rgb(0.1, sin(x), -0.7)" resolution="250" />];

  /**
   * Displays (in this order):
   * hidden images
   * hidden albums
   * hidden comments
   */
  return (
    <Container>
      <Button
        onClick={() => sethiddenImages(!hiddenImages)}
        aria-controls="hiddenImages"
        aria-expanded={hiddenImages}
        style={{
          marginTop: "1em",
          marginBottom: "1em"
        }}
        size="sm"
      >
        Hidden Images
      </Button>
      <Collapse in={hiddenImages}>
        <div id="hiddenImages"
          style={{
            display: "flex", flexFlow:"row wrap"
          }}>
          {exampleListOfImages.map((image) => (
            <div style={{padding: "10px"}}>
              {image} <br />
              <BlockAndHideButton name="hide" />
            </div>
          ))}
        </div>
      </Collapse>
      <br />
      <Button
        onClick={() => sethiddenAlbums(!hiddenAlbums)}
        aria-controls="hiddenAlbums"
        aria-expanded={hiddenAlbums}
        style={{
          marginBottom: "1em"
        }}
        size="sm"
      >
        Hidden Albums
      </Button>
      <Collapse in={hiddenAlbums}>
        <div id="hiddenAlbums">
          {exampleListOfAlbums.map((album) => (
            <Row style={{ padding: "10px" }}>
              <text style={{ padding: "10px" }}>{album}</text>
              <BlockAndHideButton name="hide" />
            </Row>
          ))}
        </div>
      </Collapse>
      <br />
      <Button
        onClick={() => sethiddenComments(!hiddenComments)}
        aria-controls="hiddenComments"
        aria-expanded={hiddenComments}
        style={{
          marginBottom: "1em"
        }}
        size="sm"
      >
        Hidden Comments
      </Button>
      <Collapse in={hiddenComments}>
        <div id="hiddenComments">
          {exampleListOfComments.map((comment) => (
            <Row style={{ padding: "10px" }}>
              <text style={{ padding: "10px" }}>{comment}</text>
              <BlockAndHideButton name="hide" />
            </Row>
          ))}
        </div>
      </Collapse>
    </Container>
  );
}

//creates button for both hiding and blocking content
//we can seperate this into two functions if needed
function BlockAndHideButton(props) {
  let [unblocked, setUnblocked] = useState(false);
  let name = props.name;

  function unblock() {
    setUnblocked(!unblocked)
  }

  return (
    <Button onClick={() => unblock()} size="sm" >
      {unblocked ? name : "un" + name}
    </Button>
  )
}

// returns blocked users
function BlockedUsers() {
  let exampleListOfUsers = ["DarthPlagiarism", "MasterYogurt", "AnakinWideWalker"];
  return (
    <>
      {exampleListOfUsers.map((user) => (
        <Row style={{ padding: "10px" }}>
          <text style={{ padding: "10px" }}>{user}</text>
          <BlockAndHideButton name="block" />
        </Row>
      ))}
    </>
  )
}

export default Settings;
