// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * profile.js
 * 
 * This exports the profile page, which is the user's personal profile page.
 * When a user views another user's profile page, they see user.js not profile.js.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+

/**
 * The page is made up of the following parts:
 *    --UserInfo
 *        | Profile Image + user information
 *        | IconsBar: # of pictures, likes, badges, challenges
 *    --Profile Nav (ProfileNavigation.js)
 *        | images: calls displayImages.js
 *        | albums: album cards; albums view
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect } from "react";
import ProfileNavigation from "./ProfileNavigation";
import "./../design/styleSheets/profile.css";
import "./../design/styleSheets/generalStyles.css";
import { Button, Container, Col, Form, Nav, Row, OverlayTrigger, Popover } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from "./components/MISTImageGallery"
/* icons */
import {
  AiOutlinePicture,
  AiOutlineStar,
  AiOutlineSetting,
} from "react-icons/ai";
import { GiAchievement } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";

// +-------------------+----------------------------------------------------------------------
// | profile.js        |
// +-------------------+
// returns the user info on the profile page
export default function Profile() {

  /**
   * These are seperate because of how the db is organized
   * users only store the id's of their images, so finding a user
   * and retrieving their images are seperate queries in the back-end,
   * same applies for albums
   */
  const [user, setUser] = useState({
    id: "",
    forename: "",
    surname: "",
    username: "",
    createdAt: "",
    about: "",
    profilepic: ""
  });
  const [userImages, setUserImages] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]);

  // grab user's information, images, and albums
  useEffect(() => {
    fetch('/api/?action=getAuthenticatedCompletePersonalProfile')
      .then(async function (res) {
        if (!res.ok) throw await res.text();
        else return await res.json();
      })
      .then(function ({ user }) {
        var date = new Date(parseInt(user.createdAt))

        setUser(
          {
            id: user._id,
            forename: user.forename,
            surname: user.surname,
            username: user.username,
            createdAt: date.toDateString(),
            about: user.about,
            profilepic: user.profilepic
          }
        );
        setUserImages(user.images.map(image => ({ ...image, userId: { username: image.username } })))
        setUserAlbums(user.albums);
      })
      .catch(alert)
  }, [])

  return (
    <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
      {/* Title */}
      <Container>
        <h1> Profile </h1>
      </Container>

      {/* UserInfo: Profile Picture + information */}
      <Container style={{ marginTop: "3vh", marginBottom: "3vh" }}>
        <UserInfo name={user.forename + " " + user.surname}
          userid={user.id}
          username={user.username}
          date={user.createdAt}
          bio={user.about}
          code={user.profilepic}
          firstname={user.forename}
          lastname={user.surname}
        />
      </Container>

      {/* Tabs for images, albums */}
      <ProfileNavigation images={userImages} albums={userAlbums} />
    </Container>
  );
}

// user information: profile pic, username, name, email, member since
function UserInfo(props) {
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");

  function changeName(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeName",
        newFirstName: newFirstName ? newFirstName : props.firstname,
        newLastName: newLastName ? newLastName : props.lastname
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message))
      .catch((error) => {
        console.error('Error in changeName:', error)
        alert("Uh-oh, an error occured. Please try again later.")
      });
  }

  const namePopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Name </Popover.Title>

      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="firstname"
              placeholder="Enter new firstname"
              onChange={(e) => setNewFirstName(e.target.value)}
            />
            <Form.Control
              type="lastname"
              placeholder="Enter new lastname"
              onChange={(e) => setNewLastName(e.target.value)}
            />
            <Button onClick={changeName}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

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
        newUsername: newUsername
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message))
      .catch((error) => {
        console.error('Error in changeUsername:', error)
        alert("Uh-oh, an error occured. Please try again later.")
      });
  }

  const usernamePopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Username </Popover.Title>

      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="username"
              placeholder="Enter new username"
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Button onClick={changeUsername}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  function changeBio(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeBio",
        newBio: newBio
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message))
      .catch((error) => {
        console.error('Error in changeBio:', error)
        alert("Uh-oh, an error occured. Please try again later.")
      });
  }

  const bioPopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Bio </Popover.Title>

      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="bio"
              placeholder="Enter new bio"
              as="textarea"
              rows="4"
              onChange={(e) => setNewBio(e.target.value)}
            />
            <Button onClick={changeBio}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  function changeProfilePic() {
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeProfilePic",
        newProfilePic: newProfilePic,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message))
      .catch((error) => {
        console.error('Error in changeProfilePic:', error)
        alert("Uh-oh, an error occured. Please try again later.")
      });
  }

  const profilePicPopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Profile Picture </Popover.Title>

      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="firstname"
              placeholder="Enter code"
              onChange={(e) => setNewProfilePic(e.target.value)}
            />
            <Form.Text>
              Copy and paste code from one of your favorite images!
              Or select "make my profile image" from an image!
            </Form.Text>
            <Button onClick={changeProfilePic}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );


  return (
    <Container style={{ width: "90%" }}>
      <Row style={{ justifyContent: "flex-start" }}>
        {" "}
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        {/* Displays profile picture + option to change it + settings */}
        <Container style={{ width: "25%", justifyContent: "center" }}>
          <MISTImage code={props.code} resolution="275" />
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={profilePicPopover}
          >
            <Button variant='light'>Change Image</Button>
          </OverlayTrigger>
          <Nav.Link href="/settings">
            <AiOutlineSetting size={28} /> Account Settings
          </Nav.Link>
        </Container>

        {/** User informations + icon bar*/}
        <Container style={{ width: "50%", alignItems: "center" }}>
          <Form>
            <Form.Group as={Row} controlId="formPlaintextEmail">
              {/* name */}
              <Form.Label column sm="4">
                Name
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  plaintext
                  readOnly
                  value={props.name}
                />
              </Col>
              <Col sm="1">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={namePopover}
                >
                  <Button variant='light'>Change</Button>
                </OverlayTrigger>
              </Col>

              {/* username */}
              <Form.Label column sm="4">
                Username
              </Form.Label>
              <Col sm="7">
                <Form.Control plaintext readOnly value={"@" + props.username} />
              </Col>
              <Col sm="1">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={usernamePopover}
                >
                  <Button variant='light'>Change</Button>
                </OverlayTrigger>
              </Col>

              {/* member since */}
              <Form.Label column sm="4">
                Member since
              </Form.Label>
              <Col sm="6">
                <Form.Control plaintext readOnly value={props.date} />
              </Col>

              {/* bio */}
              <Form.Label column sm="4">
                Bio
              </Form.Label>
              <Col sm="7">
                <Form.Control as="textarea" readOnly rows="3" value={props.bio} />
              </Col>
              <Col sm="1">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={bioPopover}
                >
                  <Button variant='light'>Change</Button>
                </OverlayTrigger>
              </Col>
            </Form.Group>
          </Form>

          {/* icons bar */}
          <hr />
          <IconsBar />
          <hr />

        </Container>
      </Row>
    </Container>
  );
}

/* # of pictures, likes, badges, challenges and their icons */
function IconsBar() {
  const icons = [
    { iconName: <AiOutlinePicture size={28} />, num: 8, category: "images" },
    { iconName: <AiOutlineStar size={28} />, num: 2, category: "likes" },
    { iconName: <GiAchievement size={28} />, num: 4, category: "badges" },
    { iconName: <GrAchievement size={28} />, num: 6, category: "challenges" },
  ];
  return (
    <Row>
      {icons.map((iconBlock, idx) => (
        <Col key={idx}>
          <Container style={{ textAlign: "center" }}>
            {iconBlock.iconName}
          </Container>
          <Container style={{ textAlign: "center" }}>
            {" "}
            {iconBlock.num} <br />
            {iconBlock.category}{" "}
          </Container>
        </Col>
      ))}
    </Row>
  );
}


