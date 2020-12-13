// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * ProfileNavigation.js
 * 
 * This exports the navigation bar on a profile page. It has two tabs: Images and Albums.
 * It shows the images and albums created by the user
 
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licensed under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+
/**
 * The page is made up of the following parts and functions:
 *    1. Routers (and contents)
 *          + ProfileNavigation
 *              | calls one of the functions in 2. and 
 *              | either 3., 4., or 5. based on the URL
 * 
 *    2. Profile Navigation tabs
 *          + ActiveImages
 *              | Returns a Navigation bar where the Images tab is active
 *          + ActiveAlbums
 *              | Returns a Navigation bar where the Albums tab is active
 * 
 *    3. Images View
 *          +Images
 *              | Returns a header: "Images" + Create Image Button
 *              | and displays the images created by the user in a grid
 *              | by using displayImages.js
 * 
 *    4. Albums View
 *          + Albums
 *              | Returns a header: "Albums" + Create Album Button,
 *              | which calls AddAlbumModal
 *              | It also displays a grid of the Albums and 
 *              | and its information by calling displayAlbums,js
 *          + AddAlbumModal
 *              | Opens a modal in which user can create new album
 *          + PrivacySettingToggle
 *              | Toggle between private and public icon
 *              | Called bt AddAlbumsModal
 * 
 *    5. Opened Album View
 *          + OpenedAlbum
 *              | Returns a header: "Back" button, Album title, Delete, Settings, Add Icons
 *              | Grid of the images in the album (calling displayImages)
 *          + AlbumSettings
 *              | modal in which user can change the settings of an album
 */

// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useContext } from "react";
import { BrowserRouter as Switch, Route, Link, useParams } from "react-router-dom";
import { Button, ButtonGroup, Container, Col, Form, Modal, Nav, Row, ToggleButton } from "react-bootstrap";

import EdiText from 'react-editext'
import { UserContext } from './components/Contexts/UserContext';
import DisplayImages from "./components/displayImages";
import { DisplayAlbums } from './components/displayAlbums';

import "./../design/styleSheets/profile.css";
import "./../design/styleSheets/generalStyles.css";
import "bootstrap/dist/css/bootstrap.css";
/* icons */
import { AiOutlineSetting } from "react-icons/ai";
import { DeleteAlbumIcon } from "./components/icons.js"
import { IoIosArrowBack, IoMdAdd } from "react-icons/io"
import { FiLock } from "react-icons/fi";
import { MdPublic } from "react-icons/md";
import { AddImagesIcon } from "./components/icons";


// +-------------------+----------------------------------------------------------------------
// | profile.js        |
// +-------------------+

// +-------------+----------------------------------------------------------------------
// | 1. Routes   |
// +-------------+
/** Returns images, albums, or an opened album view -- also changes the URL based on the routes */

export default function ProfileNavigation() {
  const [activeTab, setActiveTab] = useState(true);
  function ActivateImages() {
    setActiveTab(true)
  }
  function ActivateAlbums() {
    setActiveTab(false)
  }
  return (
    <Container>
      <div className="tabs">
        <Switch>
          {/* URL: /profile  --> default; it shows the images tab*/}
          <Route path={'/profile'} exact
            component={() => <><ActiveImages onClick={ActivateAlbums} />
              <Images /></>} />

          {/* URL: /profile/images --> to view someone's images; shows the images tab*/}
          <Route path={'/profile/images'} exact
            component={() => <><ActiveImages onClick={ActivateAlbums} />
              <Images /></>} />

          {/* URL: /profile/albums --> to view someone's albums; shows the albums tab*/}
          <Route path={'/profile/albums'}
            component={() => <><ActiveAlbums onClick={ActivateAlbums} />
              <Albums /></>} />

          {/* URL: /profile/album.id --> to view a specific album; shows the albums tab, with the album content*/}
          <Route path={'/profile/:id'}
            component={() => <><ActiveAlbums onClick={ActivateAlbums} />
              <OpenedAlbum /></>} />
        </Switch>
      </div>
    </Container>
  );
}

// +----------------------------+----------------------------------------------------------------------
// | 2. Profile Navigation tabs |
// +----------------------------+
/** Navigation Bar looks like this when Images is clicked
 *  Called by ProfileNavigation
 *   props: onClick
 */
function ActiveImages(props) {
  return (
    <div className="links">
      <Nav fill variant="tabs" defaultActiveKey="images">
        {/* Active Images Tab */}
        <Nav.Item>
          <Link to={'/profile/images'} className="link">
            <Button variant="light" style={{ width: "100%" }} active>
              Images
            </Button>
          </Link>
        </Nav.Item>

        {/* Inactive Albums Tab */}
        <Nav.Item>
          <Link to={'/profile/albums'} className="link"><Button variant="light" style={{ width: "100%" }}
            onClick={() => {
              props.onClick();
            }}>
            Albums </Button></Link>
        </Nav.Item>

        {/* Invisible OpenedAlbum tab */}
        <Nav.Item style={{ visibility: "hidden", maxWidth: "0%" }}>
          <Link to={'/profile/:id'} className="link">OpenedAlbum</Link>
        </Nav.Item>
      </Nav>
    </div>
  )
}

/** Navigation Bar looks like this when Albums is clicked 
 *  Called by ProfileNavigation
 *   props: onClick
 */
function ActiveAlbums(props) {
  return (
    <div className="links">
      <Nav fill variant="tabs" defaultActiveKey="images">
        {/* Inactive Images Tab */}
        <Nav.Item>
          <Link to={'/profile/images'} className="link">
            <Button variant="light" style={{ width: "100%" }}
              onClick={() => {
                props.onClick();
              }}>
              Images
              </Button>
          </Link>
        </Nav.Item>

        {/* Active Albums Tab */}
        <Nav.Item>
          <Link to={'/profile/albums'} className="link">
            <Button variant="light" style={{ width: "100%" }} active>
              Albums
            </Button>
          </Link>
        </Nav.Item>

        {/* Invisible OpenedAlbum tab */}
        <Nav.Item style={{ visibility: "hidden", maxWidth: "0%" }}>
          <Link to={'/profile/:id'} className="link">OpenedAlbum</Link>
        </Nav.Item>
      </Nav>
    </div>
  )
}

// +-------------+----------------------------------------------------------------------
// | Images View |
// +-------------+
/** Displays images if Images is called 
*   Returns a header: "Images" + Create Image Button
*   and displays the images created by the user in a grid by using displayImages.js
*   Called by ProfileNavigation
*/
function Images() {
  const { user } = useContext(UserContext);
  return (
    <Col>
      {/* Images + Create Image header */}
      <Row style={{ justifyContent: "space-between", marginTop: "1em" }}>
        <h3> Images</h3>
        <Button variant="light" href="/createWorkspace">
          <IoMdAdd /> Create Image
        </Button>
      </Row>

      {/* Displays the Images in a grid by calling DisplayImages*/}
      <DisplayImages cards={user.images} cardsLoaded={true} albums={user.albums} />
    </Col>
  )
}

// +----------------+----------------------------------------------------------------------
// | 3. Albums View |
// +----------------+
/** Displays albums view when Albums is called
 *  Returns a header: "Albums" + Create Album Button, which calls AddAlbumModal
 *  It also displays a grid of the Albums and 
 *  and its information by calling displayAlbums,js
 *  Called by ProfileNavigation
 * */
function Albums() {
  const [images, setImages] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const { user } = useContext(UserContext);
  return (
    <Col style={{ marginTop: "1em" }}>
      {/* Header: Albums + Create Album */}
      <Row style={{ justifyContent: "space-between", marginTop: "1em" }}>
        <h3> Albums</h3>
        <Button variant="light" onClick={() => setModalShow(true)}>
          <IoMdAdd /> Create Album
        </Button>
      </Row>
      {/* displays the albums in a grid by calling displayAlbums*/}
      <DisplayAlbums />

      <AddAlbumModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Col>
  )
}

/** Create new album modal
 *   props: show, onHide
 */
function AddAlbumModal(props) {
  const { updateAuthenticatedUser } = useContext(UserContext);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Album
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            // following this: https://stackoverflow.com/questions/63182107/react-bootstrap-get-value-from-form-on-submit
            const formData = new FormData(e.target),
              formDataObj = Object.fromEntries(formData.entries())
            await fetch('/api', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'createAlbum', ...formDataObj })
            })
              .then(res => res.json())
              .then(data => updateAuthenticatedUser())
              .catch(console.log)
          }} >
            {/* Album name */}
            <Form.Group controlId="name" >
              <Form.Label>Album name</Form.Label>
              <Form.Control
                as="textarea"
                rows="1"
                placeholder="Enter album name"
                name='name' />
            </Form.Group>

            {/* Album description */}
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Enter album description"
                name='caption' />
            </Form.Group>

            {/* Album privacy */}
            <Form.Group controlId="privacy">
              <Form.Label>Privacy</Form.Label>
              <PrivacySettingToggle />
            </Form.Group>

            {/* Buttons */}
            <Row style={{ justifyContent: "flex-end" }}>
              <Button
                onClick={props.onHide}
                variant="light"
                style={{ marginRight: "1em", color: "grey" }}>
                Cancel
                </Button>
              <Button
                type='submit'
                variant="light"
                style={{ marginRight: "1em", borderColor: "grey", color: "grey" }}>
                Submit
                </Button>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

/* Called by AddAlbumModal
 * returns: a toggle button between private and public icons */
function PrivacySettingToggle() {
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('1');

  const privacyOptions = [
    { name: <FiLock />, value: '1' },
    { name: <MdPublic />, value: '2' },
  ];

  return (
    <>
      <ButtonGroup toggle style={{ marginLeft: "2em" }}>
        {privacyOptions.map((icon, idx) => (
          <ToggleButton
            key={idx}
            type="radio"
            variant="light"
            name="radio"
            value={icon.value}
            checked={radioValue === icon.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {icon.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}

// +----------------------+----------------------------------------------------------------------
// | 4. Opened Album View |
// +----------------------+
/** Displays images of an album when album is clicked 
 *   Returns a header: "Back" button, Album title, Delete, Settings, Add Icons
 *   Grid of the images in the album (calling displayImages)
 * */
function OpenedAlbum() {
  const { id } = useParams();
  const { user, updateAuthenticatedUser } = useContext(UserContext);
  let album = user.albums.find(elem => elem._id === id);

  // Controls whether the AlbumSettings Modal is Open
  // This fetch requests removes an image from an album
  const removeImageFromAlbum = async (imageId) => {
    console.log(`imageId: ${imageId}, albumId: ${id}`);
    return fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'removeImageFromAlbum', albumId: id, imageId: imageId })
    });
  }

  // This button removes an image from this album
  const removeImageFromAlbumButtonFactory = (imageId) => (
    <Button onClick={async () => {
      try {
        const res = await removeImageFromAlbum(imageId);
        const data = await res.json();
        if (data.success) {
          alert(`${data.message}`);
          updateAuthenticatedUser();
        } else {
          alert(`Failed because: ${data.message}`)
        }
      } catch (error) {
        alert(`Failed because: ${error}`);
      }
    }}>
      Remove
    </Button>)

  if (!album) return null;
  return (
    <div>
      <Col style={{ marginTop: "1em" }}>
        <Row style={{ justifyContent: "space-between" }}>
          {/* Back button */}
          <Button variant="light" className='linkItem' >
            <Link to={'/profile/albums'} className="link" style={{ color: "black", styleDecoration: "none" }}><IoIosArrowBack /> Back</Link>
          </Button>

          {/* album name*/}
          <h3> {album.name}</h3>

          {/* icons: settings, delete, add */}
          <Row>
            <AlbumSettings album={album} />
            <DeleteAlbumIcon albumId={id} />
            <AddImagesIcon />
          </Row>
        </Row>

        {/* album description */}
        <Row>
          <p>{album.caption}</p>
        </Row>

        {/* Display album images */}
        <DisplayImages
          cards={album.images}
          cardsLoaded={true}
          removeImageFromAlbumButtonFactory={removeImageFromAlbumButtonFactory}
        />
      </Col>
    </div>
  )
}

function AlbumSettings() {
  const [albumSettingsIsOpen, setAlbumSettingsIsOpen] = useState(false);
  const { id } = useParams();
  const { user, updateAuthenticatedUser } = useContext(UserContext);
  let album = user.albums.find(elem => elem._id === id);

  // This fetch request renames the album
  const renameAlbum = async (newName) => (
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({ action: 'renameAlbum', albumId: album._id, newName: newName })
    }));

  // This fetch request changes the albums caption/description
  const changeAlbumCaption = async (newCaption) => (
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({ action: 'changeAlbumCaption', albumId: album._id, newCaption: newCaption })
    }));

  return (
    <>
      <Modal
        onHide={() => { setAlbumSettingsIsOpen(false) }}
        show={albumSettingsIsOpen}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Album Settings
		      </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <p2>You might have to refresh the album page to the changes take effect.</p2>
            <div style={{ width: "90%" }}>
              <Form>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                  {/* Album name */}
                  <Form.Label column sm="4">
                    Album name
                  </Form.Label>
                  <Col sm="7">
                    <EdiText
                      type='text'
                      value={album.name}
                      onSave={async (val) => {
                        const res = await renameAlbum(val);
                        const data = await res.json();
                        alert(data.success ? 'success' : 'fail');
                        if (data.success) {
                          updateAuthenticatedUser();
                        }
                      }}
                    />
                  </Col>

                  {/* Album description */}
                  <Form.Label column sm="4">
                    Album description
                  </Form.Label>
                  <Col sm="7">
                    <EdiText
                      type='textarea'
                      value={album.caption}
                      onSave={async (val) => {
                        try {
                          const res = await changeAlbumCaption(val);
                          const data = await res.json();
                          alert(data.success ? 'success' : 'fail');
                          if (data.success) {
                            updateAuthenticatedUser();
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    />
                  </Col>
                  {/* Album Privacy setting */}
                  <Form.Label column sm="4">Privacy</Form.Label>
                  <Col><PrivacySettingToggle /></Col>

                </Form.Group>
              </Form>

            </div>
          </Container>
        </Modal.Body>
      </Modal>
      <Button variant="light" onClick={() => setAlbumSettingsIsOpen(true)}>
        <AiOutlineSetting />
      </Button>
    </>
  )
}
