// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * user.js
 * 
 * This exports the user page, which is the page users see 
 * when viewing other user's profile.
 * Not yet developed:
    * Albums are the user's public albums. Currently, what is displayed is fake data.
    * Images are the user's public images. Currently, the images displayed are the same 
    *   images from the gallery 
    * blocking user works
 * 
 */

// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect } from "react";
import DisplayImages from "./components/displayImages";
import "./../design/styleSheets/profile.css";
import "./../design/styleSheets/generalStyles.css";
import { Button, Card, Carousel, Container, Col, Form, Nav, Row, OverlayTrigger, Popover } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from "./components/MISTImageGallery"

/* icons */
import {
    AiOutlinePicture,
    AiOutlineStar,
} from "react-icons/ai";
import { GiAchievement } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io"

// full user profile
export default function User() {

    // grabs the id from the url (everything after the last slash)
    const id = (window.location.href).split('/').slice(-1)[0];

    // keeps track if the user is blocked by the person viewing 
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        //check if the user is blocked
        fetch('/api/?action=getBlockedStatus&blockedid=' + id)
            .then(req => req.json())
            .then(response => { setBlocked(response) })
            .catch((error) => {
                console.error('Error in user.js:', error)
                alert("Uh-oh, an error occured. Please try again later.")
            });
    }, [blocked])

    return (
        blocked ? <BlockedPage /> : <UserPage id={id} />
    );
}

// the page displayed when a user is blocked by the person viewing
function BlockedPage() {
    return (
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '80vh'}}>
            <h3> This user is blocked. This can be undone in settings. </h3>
        </div>
    )
}

// normal unblocked view of a user's profile
function UserPage(props) {

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
        fetch('/api/?action=getAuthenticatedCompleteUserProfile&userid=' + props.id)
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
            .catch((error) => {
                console.error('Error in user.js:', error)
                alert("Uh-oh, an error occured. Please try again later.")
            });
    }, [])

    return (
        <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
            {/* Title */}
            <Container>
                <h1> {user.forename}'s Profile </h1>
            </Container>

            {/* First Part: Profile Picture + information */}
            <Container style={{ marginTop: "3vh", marginBottom: "3vh" }}>
                <FirstPart name={user.forename + " " + user.surname}
                    username={user.username}
                    userid={user.id}
                    date={user.createdAt}
                    bio={user.about}
                    code={user.profilepic}
                />
            </Container>

            {/* Tabs for images, albums */}
            <ProfileNav images={userImages} albums={userAlbums} />
        </Container>
    )
}

// user information: profile pic, username, name, email, member since, block, report
function FirstPart(props) {

    let [blocked, setBlocked] = useState(false);

    let blockPopover = (
        <Popover id="popover-basic">
            <Popover.Content>
                This user and their content will be blocked for you.
        </Popover.Content>
        </Popover>
    );

    function block() {
        if (!blocked) {
            setBlocked(true);

            //block the user
            fetch("/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    action: "blockUser",
                    blockedid: props.userid,
                }),
            })
                .then((res) => res.json())
                .then((message) => alert(message))
                .catch((error) => {
                    console.error('Error in block:', error)
                    alert("Uh-oh, an error occured. Please try again later.")
                });
        }
    }

    let reportPopover = (
        <Popover id="popover-basic">
            <Popover.Content>
                Report this user.
        </Popover.Content>
        </Popover>
    );

    return (
        <Container style={{ width: "90%" }}>
            <Row style={{ justifyContent: "space-between" }}>
                <Container style={{ width: "30%", justifyContent: "center" }}>
                    <MISTImage code={props.code} resolution="275" />
                    <OverlayTrigger trigger="hover" placement="right" overlay={blockPopover}>
                        <Button variant="secondary" onClick={() => block()}>
                            {blocked ? "Blocked" : "Block"}
                        </Button>
                    </OverlayTrigger> {' '}
                    <OverlayTrigger trigger="hover" placement="right" overlay={reportPopover}>
                        <Button href="/report" variant="danger">Report</Button>
                    </OverlayTrigger>
                </Container>

                {/** User informations + icon bar*/}

                <Container style={{ width: "50%", alignItems: "center" }}>
                    <Form>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4"> Name </Form.Label>
                            <Col sm="7">
                                <Form.Control
                                    plaintext
                                    readOnly
                                    value={props.name}
                                />
                            </Col>

                            <Form.Label column sm="4"> Username </Form.Label>
                            <Col sm="7">
                                <Form.Control plaintext readOnly value={"@" + props.username} />
                            </Col>
                            <Form.Label column sm="4">
                                Member since </Form.Label>

                            <Col sm="6">
                                <Form.Control plaintext readOnly value={props.date} />
                            </Col>

                            <Form.Label column sm="4">
                                Bio </Form.Label>

                            <Col sm="7">
                                <Form.Control as="textarea" readOnly rows="3" value={props.bio} />
                            </Col>
                        </Form.Group>
                    </Form>
                    <hr />
                    <IconsBar />
                    <hr />
                </Container>
            </Row>
        </Container>
    );
}

// icons (for images, likes, badges, challenges) underneath user information
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

/* Profile navigation bar: for now, it is only images and albums */
class ProfileNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: <DisplayImages cards={props.images} cardsLoaded={true} albums={props.albums} />
        }
    }

    /* update message with Display Images; when someone clicks the "Images" tab*/
    openImagesView = () => {
        this.setState({ message: <DisplayImages cards={this.props.images} cardsLoaded={true} albums={this.props.albums} /> });
    }

    /* update message with Albums; when someone clicks the "Album" tab*/
    openAlbumsView = () => {
        this.setState({ message: <Albums albums={this.props.albums} /> });
    }

    /* update message with AlbumsView; when someone tries to open an album*/
    openedAlbum = () => {
        this.setState({ message: <AlbumsView albums={this.props.albums} /> });
    }

    render() {
        return (
            <Container>
                <Nav fill variant="tabs" defaultActiveKey="images">
                    <Nav.Item>
                        <Nav.Link onClick={this.openImagesView} style={{ color: "black" }}>
                            Images
            </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={this.openAlbumsView} style={{ color: "black" }}>
                            Albums
            </Nav.Link>
                    </Nav.Item>
                    {/*  Not implemented in back-end 
          <Nav.Item>
            <Nav.Link eventKey="link-4" style={{ color: "black" }}>
              Badges
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3" style={{ color: "black" }}>
              Challenges
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-5" style={{ color: "black" }}>
              Saved
            </Nav.Link>
    </Nav.Item> */}
                </Nav>

                <Container>
                    {this.state.message}
                </Container>

            </Container>
        );
    }
}

function Albums(props) {

    const [mode, setMode] = useState("albumsView");
    const [images, setImages] = useState("");

    function openAlbumsView() { setMode("albumsView") };
    function openAlbum(props) { setMode("openedAlbum") };
    function setImagesProp(images) { setImages(images) };

    // this is commented out because it is currently not in use but was part of this album
    // implementation that we may or may not still use
    //const [modalShow, setModalShow] = React.useState(false);
    if (mode === "albumsView") {
        return (

            /* default mode*/
            <Col style={{ marginTop: "1em" }}>
                <Row>
                    {props.albums.map((album, index) => (
                        <Card
                            style={{ padding: "1em", width: "30%", margin: "1em" }}
                        >
                            <Card.Header>
                                <Card.Title style={{ margin: "auto" }}>
                                    <p>{props.title}</p>
                                </Card.Title>
                                {/* ICONS */}
                                <Card.Body style={{ justifyContent: "space-between" }}>
                                    <ControlledCarousel albumIndex={index} images={album.images} openAlbum={openAlbum} setImages={setImagesProp} />
                                    <p>{props.description}</p>
                                    <p>{props.date}</p>
                                </Card.Body>
                            </Card.Header>
                        </Card>
                    ))}
                </Row>
            </Col>
        );
    } else if (mode === "openedAlbum") {
        return (
            <OpenedAlbum images={images} onClick={openAlbumsView} />
        )
    } else {
        return (
            /* signIn mode*/
            <OpenedAlbum images={[]} onClick={openAlbumsView} />
        );
    }
}

function AlbumsView(props) {
    return (
        <Row>
            {props.albums.map((album) => (
                <Album title={album.name} description={album.caption} date={album.createdAt} images={album.images} message={props.message} />
            ))}
        </Row>

    )
}
// album component
function Album(props) {

    return (
        <Card
            style={{ padding: "1em", width: "30%", margin: "1em" }}
        >
            <Card.Header>
                <Card.Title style={{ margin: "auto" }}>
                    <p>{props.title}</p>
                </Card.Title>
                {/* ICONS */}
                <Card.Body style={{ justifyContent: "space-between" }}>
                    <ControlledCarousel images={props.images} message={props.message} />
                    <p>{props.description}</p>
                    <p>{props.date}</p>
                </Card.Body>
            </Card.Header>
        </Card>
    )
}

// carousel used for looking through albums
function ControlledCarousel(props) {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            {props.images.map((album) => (
                <Carousel.Item >
                    <Row style={{ justifyContent: "center" }}>
                        <Nav.Link onClick={() => {
                            props.openAlbum();
                            props.setImages(props.images);
                        }}>
                            <MISTImage
                                code={album.code}
                                resolution="250"
                            />
                        </Nav.Link>
                    </Row>
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

function OpenedAlbum(props) {
    return (
        <Container>
            <Col style={{ marginTop: "1em" }}>
                <Row style={{ justifyContent: "space-between" }}>
                    <Button variant="outline-secondary" onClick={props.onClick}>
                        <IoIosArrowBack /> Back
            </Button>

                    <Button variant="outline-secondary" >
                        <IoMdAdd /> Add Image
            </Button>

                </Row>
                <Row>


                    {props.images.map((album) => (
                        <Card style={{ width: '18rem' }}>
                            <MISTImage
                                code={album.code}
                                resolution="250"
                            />
                        </Card>
                    ))}

                    {/*  <DisplayImages cards={props.images} cardsLoaded={true} /> */}
                </Row>
            </Col>
        </Container>
    )
}
