// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+

/******************************************************************************
* displayImages.js provides Gallery, ImageView, and ModalView settings
* for viewing images. We expect to call use these settings on both the
* Gallery page and on the Profile/Images page.
* 
* TABLE OF CONTENTS:
*   1.  Imports:
*          --react, react-dom-router, react-bootstrap, react-icon, images
*   2.  Router & Switches:
*          --displayImages.js pulls up the page to match the URL:
*               (a) the Gallery
*               (b) ImageView, a new page based on the image's ID
*               (c) ImageModal, the overlay modal based on the image's ID * 
*   3.  Main Gallery (Gallery)
*   4.  New Page Modal (ImageView)
*   5.  Overlay Modal (ImageModal)
*   6.  Additional components (icons, comments)
*********************************************************************************/

// +---------+----------------------------------------------------------------------
// | Imports |
// +---------+

import MISTImage from "./MISTImageGallery";
import React, { useState, useEffect, Component } from "react";
import {
  Card, Button, Pagination, Container, Row,
  Col, Nav, Form,
  Modal, Navbar
} from "react-bootstrap";
import { FiSend } from "react-icons/fi";

import {
  BrowserRouter as Router, Switch, Route, Link,
  useHistory, useLocation, useParams
} from "react-router-dom";

import {
  AnimationIcon,
  SaveIcon,
  ShareIcon,
  AddImageToAlbumIcon,
  CommentIcon,
  CodeIcon,
  MoreIcon,
  StarIcon,
  PrivacyIcon
} from "./icons.js"
import "../../design/styleSheets/gallery.css";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)

/* Note: We'll eventually need to add BsViewStacked
and BsLayout Split as imports. They will 
allow users to change views on the overlay modal. */

// +---------+----------------------------------------------------------------------
// | Routers |
// +---------+

/** DisplayImages returns the router and ModalSwitch.
 *  Note: We should keep DisplayImages() and ModalSwitch() as 
 *  two separate functions. Combining them creates issues
 *  with transitioning between the Gallery and Modal View.
*/
export default function DisplayImages(props) {
  return (
    <Router>
      <ModalSwitch cards={props.cards} {...props} />
    </Router>
  );
}

/** ModalSwitch calls the relevant page based on the URL 
 * props: cards
*/
function ModalSwitch(props) {

  let location = useLocation();

  /* This piece of state is set when one of the gallery links is clicked.
  // The `background` state is the location that we were at when one of
  // the gallery links was clicked. If it's there, use it as the location
  // for the <Switch> so we show the gallery in the background. */
  let background = location.state && location.state.background;

  return (
    <div>
      <Switch location={background || location}>
        <Route path="/gallery" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/random" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/featured" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/top-rated" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/recent" children={<Gallery cards={props.cards} />} />
        <Route path="/profile" children={<Gallery cards={props.cards} removeImageFromAlbumButtonFactory={props.removeImageFromAlbumButtonFactory} />} />
        <Route path="/user" children={<Gallery cards={props.cards} />} />
        <Route path="/img/:id" children={<ImageView cards={props.cards} />} />
      </Switch>

      {/* Show the modal when a background page is set. */}
      {background && <Route path="/img/:id" children={<ImageModal cards={props.cards} />} />}
    </div>
  );
}

// +---------+----------------------------------------------------------------------
// | Gallery |
// +---------+

/**
 * The Gallery returns a set of cards and the pagination
 *    -- normally, gallery is displayed when displayImages is called.
 *  
 * It takes in the cards array, 
 * and calls it on the header, image, and body component of the card
 */
function Gallery(props) {
  let cards = props.cards;
  return (
    /* styling helps with footer */
    <Row style={{ justifyContent: "space-between" }}>
      {/* maps each array in the cards array */}
      {cards.map((card, idx) => (
        <Card key={idx} style={{ width: "31%", marginTop: "1em", marginBottom: "1em" }}>
          {props.removeImageFromAlbumButtonFactory ?
            props.removeImageFromAlbumButtonFactory(card._id)
            :
            console.log('failed')}
          <CardHeader card={card} />
          <CardImage card={card} />
          <CardBody card={card} />
        </Card>
      ))}
      {/* pagination */}

    </Row>
  );
}

/**
 * Displays the header of the card
 *    | title
 *    | Privacy Icon
 *    | clock sign (if animated)
 *    | More Icon for Report and Hide
 * 
 * props: takes in the information of one card
 */
function CardHeader(props) {
  return (
    <Card.Header>
      <Card.Title style={{ margin: "auto" }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Title + Clock sign */}
          <Col style={{ marginLeft: "1em" }}>
            {props.card.title}
          </Col>

          <AnimationIcon isAnimated={props.card.isAnimated} />
          <PrivacyIcon />
          <MoreIcon />
        </Row>

      </Card.Title>
    </Card.Header>
  );
}

/**
 * Returns the MISTImage of a card
 * 
 * props: Takes in the information of one card.
 */
function CardImage(props) {
  let location = useLocation();

  return (
    /* Setting up the pathname and background for overlay */
    <Link
      to={{
        pathname: `/img/${props.card._id}`,
        state: { background: location },
      }}
    >
      <div variant="top" >
        <Row style={{ justifyContent: "center", marginTop: "1em" }}>
          <MISTImage code={props.card.code} resolution="250" />
        </Row>
      </div>
    </Link>
  );
}

/**
 * Returns the Body of a card
 *    | Username + Description
 *    | Icons
 *    | Write a Comment
 * 
 * Props: Takes in the information of one card.
 */
function CardBody(props) {
  let pathname = "/user/" + props.card.userId._id;
  let card = props.card;
  console.log("props: ", props);
  return (
    <Card.Body style={{ justifyContent: "space-between" }}>
      {/* Row 1: Username */}
      <Nav style={{ justifyContent: "space-between" }}>
        <Nav.Link variant="light" href={pathname} >
          {card.userId ? card.userId.username : null}
        </Nav.Link>
        <StarIcon card={card} />
      </Nav>

      {/* Row 2: Icons */}
      <Row style={{ margin: "0", justifyContent: "space-between" }}>
        <CodeIcon code={card.code} />
        <SaveIcon code={card.code} />
        <CommentIcon id={card._id} />
        <AddImageToAlbumIcon img={card} />
        <ShareIcon />
      </Row>

      {/* Row 3: Comment Box */}
      <Navbar>
        <MakeComment imageId={card._id} />
      </Navbar>
    </Card.Body>
  );
}

/**
 * Returns the page counter
 */
function PageCounter() {
  return (
    <Pagination className="pagination-style">
      <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Item>{11}</Pagination.Item>
      <Pagination.Item>{12}</Pagination.Item>
      <Pagination.Item>{13}</Pagination.Item>

      <Pagination.Ellipsis />
      <Pagination.Item>{20}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
}

// +---------+---------+------------------------------------------------------------
// | Single Image Page |
// +---------+---------+
/**
 * This is being called when someone accesses an image through its URL
 * and not by clicking on a smaller version of it on a card
 * 
 * Takes in the cards array.
 * 
 * Col 1:
 *  | Row 1: title + image
 *  | Row 2: username
 *  | Row 3: Range to change resolution
 * 
 * Col 2:
 *  | Comments
 * 
 * props: cards
 */
function ImageView(props) {
  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);
  if (!card) return <div>Image not found</div>;
  let pathname = "/user/" + card.userId._id

  return (
    <Container style={{ width: "65%", justifyContent: "center", marginTop: "1em" }}>
      <Col>
        <Row>
          <Col xs="4">
            <h1 style={{ fontSize: "150%", textAlign: "left" }} >{card.title}</h1>
            <MISTImage code={card.code} resolution="300" />
            <Row>
              <Button variant="light" href={pathname}>
                {<b>{card.userId.username}</b>}
              </Button>
            </Row>
            {/* change resolution */}
            <Form>
              <Form.Control type="range" custom style={{ marginTop: "1em", width: "100%" }} />
            </Form>
          </Col>
          {/* Comments */}
          <Col xs="8">
            <ModalComments card={card} />
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

// +-------------+-----------------------------------------------------------
// | Image Modal |
// +-------------+

/**
 * ImageModal is a overlay image view. 
 * It appears when the image is clicked from the gallery.
 * 
 * props: array of cards
 */
function ImageModal(props) {
  let history = useHistory();
  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);
  const [modalShow] = React.useState(true);

  if (!card) return null;
  return (
    <MyVerticallyCenteredModal
      show={modalShow}
      onHide={() => history.goBack()}
      card={card}
    />
  );
}

/**
 * MyVerticallyCenteredModal returns the display portion of ImageModal.
 * 
 * props: card, show state, and onHide function
 */
function MyVerticallyCenteredModal(props) {
  let card = props.card;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        width: "100%",
      }}
    >
      {/* Modal Header: title + close button */}
      <Modal.Header>
        <Container>
          <Modal.Title>{card.title}</Modal.Title>
        </Container>

        <Link to={{ pathname: "/gallery" }}>Close</Link>
      </Modal.Header>

      {/* Modal Body */}
      <Container>
        <SideView card={card} />
      </Container>

      {/* Modal Footer */}
      <Modal.Footer style={{ minHeight: "3em" }}></Modal.Footer>
    </Modal>
  );
}


/**
 * SideView returns the main body of the modal view.
 * It places the image side by side with the comments.
 * 
 * props: card
 */
function SideView(props) {
  let card = props.card;
  let pathname = "/user/" + props.card.userId._id

  return (
    <Modal.Body>
      <Row >
        {/* Col 1: username, image, caption, range*/}
        <Col>
          <Row style={{ justifyContent: "space-between" }}>
            {/* username */}
            <Nav.Link variant="light" href={pathname}>
              {card.userId.username}
            </Nav.Link>

            <MoreIcon />
          </Row>
          {/* image */}
          <Row style={{ justifyContent: "center", marginTop: "1em" }}>
            <MISTImage code={card ? card.code : null} resolution="250" />
          </Row>

          {/* caption */}
          <Row>
            {card.caption}
          </Row>

          {/* range for resolution */}
          <Form>
            <Form.Control type="range" custom style={{ marginTop: "1em" }} />
          </Form>
        </Col>

        {/* Col 2: Comments*/}
        <Col style={{ width: "50%" }}>
          <div style={{ paddingLeft: "1em" }}></div>
          <ModalComments card={card} />
        </Col>

      </Row>
    </Modal.Body>
  );
}

// +----------------+-----------------------------------------------------------
// | Modal Comments |
// +----------------+

/* Displays the comments in the modal
 * props:  card */
function ModalComments(props) {
  const [comments, setComments] = useState([])
  // fetch the comments for this image 
  useEffect(() => {
    fetch('/api?action=getImageComments&id=' + props.card._id)
      .then(req => req.json())
      .then(comments => { setComments(comments); });
  }, [comments])
  return (
    <Col>
      <Form.Group >
        {/* All existing comments */}
        <Container style={{ overflowY: "scroll", height: "40vh" }}>
          {comments.map((comment) =>
            (<Comment
              id={comment.userId._id}
              username={comment.userId.username}
              comment={comment.body}
              date={comment.createdAt} />
            ))}
        </Container>

        {/* Horizontal Line */}
        <hr />
        {/* Icons and to make a comment field */}
        <ModalIcons card={props.card} />
        <MakeComment imageId={props.card._id} />

      </Form.Group>
    </Col>
  );
}

/**
 * Allows users to write and submit comments.
 * props: ImageId
 */
function MakeComment(props) {
  const [comment, setComment] = useState("");

  //Update the comment (state) as the user types it
  const handleChange = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };

  // When the user submits the comment, post to database
  const handleSubmit = (event) => {
    // prevent the page from refreshing 
    event.preventDefault();

    // grab user information
    fetch('/api?action=getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(user => {
        if (user) {

          console.log("user: ", user);
          // build full comment
          let fullComment = {
            "active": true,
            "flags": [],
            "userId": user._id,
            "body": comment,
            "imageId": props.imageId
          };

          //post comment
          fetch('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'postComment', ...fullComment })
          })
            //reset comment state
            .then(setComment(""))
        }
        else
          alert("You must be logged in to make comments")
      })
  };
  return (
    <Form onSubmit={handleSubmit} inline>
      {/* submit message */}
      <Form.Control
        name="comment"
        as="textarea"
        rows="1"

        placeholder="Type comment here"
        value={comment}
        onChange={handleChange}
      />

      {/* Send message button */}
      <Button variant="light" type="submit" style={{ paddingRight: "0" }}>
        <FiSend style={{ color: "black" }} />
      </Button>
    </Form>
  );
}

/* *
 * Displays one comment
 * props: username, comment, date 
 * */

class Comment extends Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      isHovering: false,
    };
    this.convertTime = this.convertTime.bind(this);
  }

  convertTime(date) {
    const timeAgo = new TimeAgo('en-US')
    if (typeof date === 'string')
      date = parseInt(date);
    return timeAgo.format(date);
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }
  render() {
    return (
      <Row>
        <Card style={{ width: "100%", margin: "0.5em" }}
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}>
          <Card.Body style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "0.5em"
          }}>
            <div style={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "flex-start"
            }}>
              <Nav.Link size="sm" variant="light" href="/user" style={{ alignSelf: "flex-start", paddingLeft: "0" }}>
                {this.props.username}
              </Nav.Link>
              <div style={{ fontSize: "15px" }}>
                {this.convertTime(this.props.date)}
              </div>
            </div>
            <div style={{ flexGrow: "2", fontSize: "18px" }}>
              {this.props.comment}
            </div>
            {this.state.isHovering && <MoreIcon />}

          </Card.Body>
        </Card>
      </Row>
    );
  }
}

// +------------------+-----------------------------------------------------------
// | Modal Icon       |
// +------------------+
/** 
 * Displays a row of icons that are on the modal
 * props: vard
 * */

function ModalIcons(props) {

  let card = props.card;

  return (
    <Row style={{ justifyContent: "flex-start" }}>

      <StarIcon card={card} />
      <CodeIcon code={card.code} />
      <SaveIcon code={card.code} />
      <AddImageToAlbumIcon img={props.card} />
      <ShareIcon />

    </Row>
  );
}
