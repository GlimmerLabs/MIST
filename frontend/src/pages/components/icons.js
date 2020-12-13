// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+

/******************************************************************************
 Icons defines icons used in the app:
    AddImageToAlbumIcon,
    AddImagesIcon,
    AnimationIcon,
    CodeIcon,
    CommentIcon,
    DeleteAlbumIcon,
    MoreIcon,
    PrivacyIcon,
    SaveIcon,
    ShareIcon,
    StarIcon
*********************************************************************************/

// +---------+----------------------------------------------------------------------
// | Imports |
// +---------+

import React, { useContext, useState, useRef } from "react";
import {
  Button, Row,
  Col, Nav, NavDropdown, Popover, Overlay,
  Modal, OverlayTrigger
} from "react-bootstrap";
import { UserContext } from './Contexts/UserContext';
import { Link, useLocation } from "react-router-dom";
import "../../design/styleSheets/gallery.css";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import copy from 'copy-to-clipboard';
/* icons */
import { AiFillStar, AiOutlineStar, AiOutlineDelete } from "react-icons/ai";
import { RiFolderAddLine } from "react-icons/ri";
import {
  FaRegShareSquare, FaRegComments, FaFacebook,
  FaSnapchat
} from "react-icons/fa";
import {
  FiSave, FiCode, FiMoreHorizontal,
  FiFlag, FiLock, FiClock
}
  from "react-icons/fi";
import { TiSocialInstagram } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io"
import { MdVisibilityOff, MdPublic } from "react-icons/md"

TimeAgo.addLocale(en)

// +-------------+-----------------------------------------------------------
// | Icons       |
// +-------------+

// +------------------+-----------------------------------------------------------
// | AddImageToAlbum  |
// +------------------+
/** An Add to Album Icon (RiFolderAddLine)
 *  Calls AddImageToAlbumModal
 *  Called in DisplayImages
 *  props: img
 */

function AddImageToAlbumIcon(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Nav.Link onClick={() => setModalShow(true)}>
        <RiFolderAddLine style={{ color: "black" }}/>
      </Nav.Link>
      <AddImageToAlbumModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        img={props.img}
      />
    </>
  );
}

/**
 * Displays a modal to choose an album to add the image to
 * props: show, onHide, img
 */
function AddImageToAlbumModal(props) {
  const [chosenAlbum, setChosenAlbum] = React.useState({});
  const notSignedInMessage = 'You have to be logged in to add images to albums.';
  const { user, updateAuthenticatedUser } = useContext(UserContext);
  const albums = user.albums;

  function handleAddToAlbum(e) {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'addImageToAlbum', album: chosenAlbum, imgID: props.img._id })
    }).then(res => res.json())
      .then(data => alert(data.message))
      .then(() => updateAuthenticatedUser())
      .catch(console.log)
  }

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton >
        <Modal.Title id="contained-modal-title-vcenter">
          Select Album
            </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row style={{ justifyContent: "space-between", paddingRight: "1em" }}>
          <Col xs={4}>Your Albums:</Col>
          <Col >
            {(albums === null) ? notSignedInMessage : <></>}
            {(!albums) ? <></> : albums.map((obj) => (
              <Row style={{ marginBottom: "1em" }}>
                <Button
                  onClick={() => setChosenAlbum(obj)}
                  variant="light"
                >
                  {obj.name}
                </Button>
              </Row>
            ))}
          </Col>
          <Col>
            <Row style={{ justifyContent: "flex-end" }}>
            </Row>
          </Col>
        </Row>

      </Modal.Body>
      <Modal.Footer>
        {/* Cancel button */}
        <Button
          onClick={props.onHide}
          variant="light">
          Cancel
        </Button>

        {/* Add button */}
        <Button
          variant="light"
          style={{ borderColor: "grey" }}
          onClick={handleAddToAlbum}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// +------------------+-----------------------------------------------------------
// | AddImagesIcon    |
// +------------------+
/**
 * Displays a plus sign (<IoMdAdd />) 
 * to choose from liked / your images to add to a specific album
 */
function AddImagesIcon() {
  return (
    <Button variant="light" style={{ marginRight: "1em" }}>
      <IoMdAdd />
    </Button>
  )
}

// +------------------+-----------------------------------------------------------
// | AnimationIcon    |
// +------------------+
/**
 * Displays a clock icon (<FiClock/>) to show if the image is animated
 * props: isAnimated
 */
/* Animation Icon */
function AnimationIcon(props) {
  return (
    <>
      {props.isAnimated ?
        (
          <Nav.Item>
            <FiClock size={15} />
          </Nav.Item>
        ) :
        ("")
      }
    </>
  )
}

// +------------------+-----------------------------------------------------------
// | Code Icon        |
// +------------------+
/**
 * displays a code icon (<FiCode />)
 * on click, it shows the code
 * props: code
 */
function CodeIcon(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [copyText, setCopyText] = useState("Copy")
  const ref = useRef(null);

  /* shows or does not show the popover
   * and if it is not shown after the click, 
   * the button says "copy" */
  const handleClick = (event) => {
    setShow(!show);
    !show ? setCopyText("Copy") : setCopyText(copyText);
    setTarget(event.target);
  };

  /* copies code and displays "Copied!" instead of "Copy" */
  const handleCopy = () => {
    copy(props.code);
    setCopyText("Copied!");
  }

  return (
    <div ref={ref}>
      <Nav.Item>
        <Nav.Link onClick={handleClick} style={{ color: "black" }}>
          <FiCode />
        </Nav.Link>
      </Nav.Item>
      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        {/* Popover: "Code", code, copy button */}
        <Popover id="popover-contained">
          {/* Title: "Code" */}
          <Popover.Title as="h3">
            Code
              </Popover.Title>
          {/* Content: code and copy button */}
          <Popover.Content>
            <p2>{props.code}</p2>
            <Row style={{ justifyContent: "flex-end" }}>
              <Button
                variant="light"
                style={{ color: "black", marginRight: "1em", marginLeft: "1em" }}
                onClick={handleCopy}>
                {copyText}
              </Button>
            </Row>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}


// +------------------+-----------------------------------------------------------
// | Comment Icon     |
// +------------------+
/**
 * Displays a comment icon (<FaRegComments/>)
 * Calls the ImageModal onClick
 */
function CommentIcon(props) {
  let location = useLocation();
  return (
    <Nav.Item  >
      <Nav.Link>
        <Link
          to={{
            pathname: `/img/${props.id}`,
            state: { background: location },
          }}
        >
          <FaRegComments
            style={{ color: "black" }}
          />
        </Link>
      </Nav.Link>
    </Nav.Item>
  )
}

// +------------------+-----------------------------------------------------------
// | DeleteAlbum      |
// +------------------+
// Displays delete (trash) icon (<AiOutlineDelete />)
// This button deletes the album corresponding to the given albumId from the database
// props: albumId
function DeleteAlbumIcon(props) {
  const { updateAuthenticatedUser } = useContext(UserContext);
  const { albumId } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function handleDeleteAlbum() {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deleteAlbum', albumID: albumId })
    }).then(res => res.json()).then(data => alert(data.message)).then(() => updateAuthenticatedUser())
  }

  return (
    <>
      <Modal show={show} onClick={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Album</Modal.Title>
        </Modal.Header>
        <Modal.Body>Click Delete to confirm.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Link
            to={'/profile/albums'}
            className="link"
            style={{ color: "black", styleDecoration: "none" }}
          >
            <Button variant="danger" onClick={handleDeleteAlbum}>
              Delete
          </Button>
          </Link>
        </Modal.Footer>
      </Modal>
      <Button variant="light" style={{ marginLeft: "1em", marginRight: "1em" }} onClick={handleShow}>
        <AiOutlineDelete />
      </Button>
    </>
  )
}

// +------------------+-----------------------------------------------------------
// | More Icon        |
// +------------------+
/* Displays 3 dots icon (more)
 *  Shows: Report and Hide on click
 *
 * TODO: Actually Hide / Report the image or album or comment etc...
 */
function MoreIcon() {
  function hide() {
    alert("You have hidden this content and will no longer see it again.")
  }

  /* hide popover */
  let hidePopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        This content will be hidden from you.
      </Popover.Content>
    </Popover>
  );

  /* report popover */
  let reportPopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        Report this content.
      </Popover.Content>
    </Popover>
  );

  return (
    <NavDropdown
      title={<FiMoreHorizontal
        size={15} style={{ color: "grey", marginLeft: "0", paddingLeft: "0" }} />}
      id="nav-dropdown">
      {/* Hide */}
      <OverlayTrigger
        trigger="hover"
        placement="right"
        overlay={hidePopover}>
        <NavDropdown.Item onClick={() => hide()}>
          <MdVisibilityOff />  Hide
          </NavDropdown.Item>
      </OverlayTrigger>

      {/* Report */}
      <OverlayTrigger
        trigger="hover"
        placement="right"
        overlay={reportPopover}>
        <NavDropdown.Item href="/report">
          <FiFlag /> Report
          </NavDropdown.Item>
      </OverlayTrigger>
    </NavDropdown>
  )
}

// +------------------+-----------------------------------------------------------
// | Privacy Icon     |
// +------------------+
/**
 * Displays a lock icon or a world icon depending on the state of the privacy
 * Onclick it changes to the other
 * props: will need to be the current privacy setting
 * 
 * TODO: add the props, and make it that only one can change it if its their own image / album
 */
class PrivacyIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = { private: true }; //<-- should be props.privacy
    this.handlePrivateClick = this.handlePrivateClick.bind(this);
  }

  handlePrivateClick() {
    this.setState(state => ({
      private: !state.private
    }));
  }

  render() {
    return (
      <Nav.Link style={{ color: "black", marginRight: "0", paddingRight: "0" }} onClick={this.handlePrivateClick}>
        {this.state.private ? <FiLock size={15} /> : <MdPublic size={15} />}
      </Nav.Link>
    );
  }
}

/* Save Icon */
function SaveIcon(props) {
  const newProfilePic = props.code;

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
      .then((message) => alert(message));
  }

  return (
    <NavDropdown title={<FiSave />} id="nav-dropdown">
      <NavDropdown.Item onClick={() => changeProfilePic()}> as my profile image </NavDropdown.Item>
      <NavDropdown.Item eventKey="4.1">as image</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.2"> as video</NavDropdown.Item>
    </NavDropdown>
  );
}

// +------------------+-----------------------------------------------------------
// | Share Icon       |
// +------------------+
/**
 * Displays a a share icon (<FaRegShareSquare />)
 * OnClick it gives options to Facebook, Insta, Snap
 * 
 * TODO: Make it work!
 */
function ShareIcon() {
  return (
    <NavDropdown title={<FaRegShareSquare />} id="nav-dropdown" >
      {/* Facebook */}
      <NavDropdown.Item eventKey="4.1">
        {" "}
        <FaFacebook /> Facebook
          </NavDropdown.Item>

      {/* Instagram */}
      <NavDropdown.Item eventKey="4.2">
        <TiSocialInstagram /> Instagram
          </NavDropdown.Item>

      {/* Snapchat */}
      <NavDropdown.Item eventKey="4.3">
        {" "}
        <FaSnapchat /> Snapchat
          </NavDropdown.Item>
    </NavDropdown>

  );
}

// +------------------+-----------------------------------------------------------
// | Star Icon       |
// +------------------+
/**
 * Displays a a star icon (<AiOutlineStar />) or <AiFillStar/>
 * depending on if the user had liked the image or not
 * OnClick it changes to the other and counts up or down on rankings
 * 
 * TODO: bring in props (original stat of the star)
 *     
 */
function StarIcon(props) {
  const [liked, setLiked] = useState(false); //props.like <-- boolean

  //count up if it was liked
  function likeCount() {
    props.card.ratings++;
  }

  //count down if it was disliked
  function dislikeCount() {
    props.card.ratings--;
  }

  //change the icon
  function handleClick() {
    setLiked(!liked);
  }
  return (
    <div>
      {liked ?
        /* If it was previously liked, then onClick dislike it*/
        <Nav.Link
          style={{ color: "black", display: "inline-block" }}
          onClick={() => {
            handleClick();
            dislikeCount();
          }}>
          <AiFillStar size={15} />
          {props.card.ratings}
        </Nav.Link>
        :
        /* If it was previously disliked, then onClick like it*/
        <Nav.Link
          style={{ color: "black", display: "inline-block" }}
          onClick={() => {
            handleClick();
            likeCount();
          }}>
          <AiOutlineStar size={15} />
          {props.card.ratings}
        </Nav.Link>
      }
    </div>

  )
}
export {
  AddImageToAlbumIcon,
  AddImagesIcon,
  AnimationIcon,
  CodeIcon,
  CommentIcon,
  DeleteAlbumIcon,
  MoreIcon,
  PrivacyIcon,
  SaveIcon,
  ShareIcon,
  StarIcon
}
