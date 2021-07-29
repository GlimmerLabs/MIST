
// frontend\src\TutorialImages\(x).png
// +----------------------------------------------------------------------------------------------------------
// | Tutorial.js |
// +-------------+

/**
 * This is the Tutorials page.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 *
 */

// +--------------------------------------+-------------------------------------------------------------------
// | Design Issues  -- The Sections array |
// +--------------------------------------+

/**
 * All the tutorials page content is in an array called sections[].
 *   Sections are the following as of Summer 2021:
 *       - Getting Started
 *       - Variables
 *       - Functions
 *       - Shapes
 *       - Transformations & Combinations
 *       - Interesting Images
 *
 *   Each SECTIONS have the following fields:
 *     - title
 *         | This is the name that is shown on the UI (button)
 *
 *     - subsections
 *         | Subsections are eg. Introduction to Mist, The Workspace, ... , Circle, Triangle, etc.
 *
 *   ----------------------------------------------------------------------------------------------------------
 *   Each SUBSECTIONS have the following fields:
 *     - title
 *        | The title of the subsection (eg. Introduction to MIST)
 *
 *     - id
 *        | The id of the subsection to refer to,
 *        |and is also related to the URL(eg. intro-to-mist)
 *
 *     - keywords
 *        | the keywords of the different subsections
 *        |  Needs to be mapped, not yet connected / called in the code
 *
 *     - final product image
 *        | need to be added in this array, will be a MISTimg probably
 *
 *     - text
 *        | the text tutorial option -- html code content
 *
 *     - video
 *        | The video tutorial option
 *
 *     - final
 *        | mini workspace with the final product layout
 *
 *     - challenges
 *        | an array of challenges
 *        | each challenge has the following fields:
 *        |    - question:  html code question + possible image
 *        |    - hint    :  html code content for hint
 *   ------------------------------------------------------------------------------------------------------------
 */

// +-----------------------------+-------------------------------------------------------------------------------
// | Design Issues  -- This File |
// +-----------------------------+

/**
 * 1. Imports
 * 2. Tutorial Code
 *       - Table of Contents
 *       - Tutorials contents
 *           | SubsectionButton
 *                 + Button that has a section name on (eg. text),
 *                 + and goes to that subsection
 *           | Help Modal
 *                 + the overlay modal that comes up when someone needs help in challenges
 *           | Introduction
 *           | Checkpoint
 *           | Challenge
 * 3. Sections array
 *
 * Both the *Table of Contents* and the *Tutorials contents*
 * are relying on sections[].
 */

// +---------+--------------------------------------
// | IMPORTS |
// +---------+
import React from "react";
import {
  Nav,
  NavDropdown,
  Image,
  Card,
  Button,
  Container,
  Row,
  Col,
  Jumbotron,
  Modal,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

import { Link } from "react-router-dom";
import { BsQuestionCircle, BsClock } from "react-icons/bs";

import MISTImage from "./components/MISTImageGallery";

import WorkSpace from "../workspace";

import Circle from "./../TutorialImages/CircleImages/circle.png";
import Circle1 from "./../TutorialImages/CircleImages/circle1.png";
import Circle2 from "./../TutorialImages/CircleImages/circle2.png";
import Circle3 from "./../TutorialImages/CircleImages/circle3.png";
import arrowX from "./../TutorialImages/arrowShowingX.png";
import arrowY from "./../TutorialImages/arrowShowingY.png";
import arrowXandY from "./../TutorialImages/arrowsShowingXandY.png";
import workspaceConnect from "./../TutorialImages/workspaceConnect.mp4";
import workspaceDrag from "./../TutorialImages/workspaceDrag.mp4";
import funcConnectVideo from "./../TutorialImages/workspaceFuncConnectAndPreview.mp4";
import workspaceIntro from "./../TutorialImages/workspaceIntro.mp4";
import codeIntro from "./../TutorialImages/codeIntro.mp4";
import savingFunction from "./../TutorialImages/savingFunction.mp4";
import allVars from "./../TutorialImages/allVariables.mp4";
import constantDemo from "./../TutorialImages/constNodeInput.mp4";

const rgbVenn = (
  "rgb(neg("
  + "sign("
  + "sum("
  + "square(sum(x, neg(mult(0.6, cos(0.66666)))))"
  + "square(sum(y, neg(mult(0.3, sin(0.66666)))))"
  + "neg(square(0.6))))),"
  + "neg("
  + "sign("
  + "sum("
  + "square(sum(x, neg(mult(0.6, cos(-0.5)))))"
  + "square(sum(y, neg(mult(0.3, sin(-0.5)))))"
  + "neg(square(0.6))))),"
  + "neg("
  + "sign("
  + "sum("
  + "square(sum(x, neg(mult(0.6, cos(0.33333)))))"
  + "square(sum(y, neg(mult(0.3, sin(0.33333)))))"
  + "neg(square(0.6))))))"
);

const rgbVennSoft = (
  "rgb(neg("
  // + "sign("
  + "sum(-0.5,"
  + "square(sum(x, neg(mult(0.6, cos(0.66666)))))"
  + "square(sum(y, neg(mult(0.3, sin(0.66666)))))"
  + "neg(square(0.6)))),"//)," 
  + "neg("
  // + "sign("
  + "sum(-0.5,"
  + "square(sum(x, neg(mult(0.6, cos(-0.5)))))"
  + "square(sum(y, neg(mult(0.3, sin(-0.5)))))"
  + "neg(square(0.6)))),"//),"    
  + "neg("
  // + "sign("
  + "sum(-0.5,"
  + "square(sum(x, neg(mult(0.6, cos(0.33333)))))"
  + "square(sum(y, neg(mult(0.3, sin(0.33333)))))"
  + "neg(square(0.6)))))"//)"
);

const bodyTextSize = "125%";


// workspace Demo, so we can include workspaces in our tutorials easily.
function WorkSpaceDemo() {
  return (
    <WorkSpace
      width={document.documentElement.clientWidth * .52}
      height={document.documentElement.clientHeight * 0.8}
      menuHeight={document.documentElement.clientWidth * 0.07}
      funBarHeight={document.documentElement.clientHeight * 0.1}
      functionWidth={document.documentElement.clientWidth * 0.033}
      valueWidth={document.documentElement.clientWidth * 0.035}
      offset={0}
    />
  );
}



//Tutorial Header
function Tutorial() {
  return (
    <Container
      fluid
      style={{
        marginTop: "1vh",
        marginBottom: "0",
        paddingBottom: "4rem",
      }}
    >
      {/* Table of Contents */}
      <TableContents />
      <Row
        // className="mr-auto"
        style={{
          marginLeft: "-3em",
          marginRight: "5em",
          alignItems: "flex-start",
        }}
      >
        <Col xs="6" style={{
          alignItems: "stretch",
          top: "1vh",
        }}>
          {/* Tutorials */}
         <Tutorials /> 
        </Col>
        <Col xs="5" style={{
          alignItems: "stretch",
          top: "0rem",
        }}>
        <WorkSpaceDemo />
        </Col>
      </Row>
    </Container>

  );
}

// +--------------------+--------------------------------------------
// | Table of Contents  |
// +------------------- +

function TableContents() {
  return (
    <Card>
      {/* All the sections and subsections */}
      <Nav>
      <Card.Header 
        style={{border: "none"}}
      >Table of Contents:</Card.Header>
        {/* Maps each sections  */}
        {sections.map((section, idx) => (
            <Nav>
              {/* Displays the title of the section */}
              <NavDropdown title={section.title}>
                {section.subsections.map((subsection) => (
                    //The button in the Table of Contents with the subsection title
                    <NavDropdown.Item
                      href={"#" + subsection.id}
                      style={{
                        color: "black",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                      }}
                    >
                      {subsection.title}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
            </Nav>
        ))}
      </Nav>
    </Card>
  );
}

// +----------------------------+----------------------------------------
// | Tutorial Contents          |
// +--------------------------- +

function Tutorials() {
  return (
    <Container style={{ height: "75vh", width:"48vw", margin: "0vh", overflowY: "scroll", overflowX: "hidden", scrollBehavior: "smooth" }}>
      {/* Maps each sections */}
      {sections.map((section, idx) => (
        <div>
          {/* Maps each subsections */}
          {section.subsections.map((subsection, idx) => (
            //Has correct subsection id
            <section style={{overflowWrap: "breakword"}} id={subsection.id}>
              <Container>
                {/* The "header" of the subsection */}
                <Jumbotron
                  fluid
                  style={{
                    borderRadius: "20px",
                    border: "solid",
                    borderWidth: "1px",
                    borderColor: "gray",
                    marginLeft: "0vh",
                    overflowWrap: "breakword"
                  }}
                >
                  <Container>
                    <Row>
                      <Col sm="8">
                        <h1 style={{ textAlign: "left",
                                     overflowWrap: "breakword"}}>
                          {subsection.title}{" "}
                          <Link
                            to={"#" + subsection.id}
                            style={{ color: "gray", overflowWrap: "breakword"}}
                          >

                          </Link>
                        </h1>
                        <hr />

                        {/* keywords */}
                        <Row style={{ marginLeft: "0vh" }}>
                          {subsection.keywords.map((keyword) => (
                            <p1 style={{ margin: "1vh" }}>
                              {" "}
                              {keyword} &#x25CF;
                            </p1>
                          ))}
                        </Row>

                        {/* Buttons for the text, video, final, and challenges sections */}
                        <Row style={{ marginLeft: "0em", paddingTop: "2vh" }}>
                          <SubsectionButton style={{overflowWrap: "breakword"}}
                                                   id={subsection.id} type="text" />
                          {/* <SubsectionButton id={subsection.id} type="video" /> */}
                          {/* <SubsectionButton id={subsection.id} type="final" /> */}
                          <SubsectionButton style={{overflowWrap: "breakword"}}
                                            id={subsection.id} type="checkpoint" />
                          <SubsectionButton style={{overflowWrap: "breakword"}}
                                            id={subsection.id} type="challenges" />
                        </Row>
                      </Col>

                      {/* The Final Image */}
                      <Col style={{ justifyContent: "center" }}>
                        <Row style={{ justifyContent: "center" }}>
                          {subsection.image}
                        </Row>
                        <Row style={{ justifyContent: "center" }}>
                          {subsection.isAnimated ? (
                            <p>
                              <BsClock size={15} style={{ margin: "1vh" }} />
                              Hover over for animation!
                            </p>
                          ) : (
                            ""
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </Jumbotron>
                {/* END OF "HEADER" OF SUBSECTION! */}

                {/* Text, Video, Final, Challenges sections */}
                <Text text={subsection.text} id={subsection.id} />
                {subsection.isCheckpoint ? (
                  <CheckPoint checkpoint={subsection.checkpoint} id={subsection.id} />
                ) : (
                  ""
                )}
                {subsection.isChallenge ? (
                  <Challenges
                    challenges={subsection.challenges}
                    id={subsection.id}
                  />
                ) : (
                  ""
                )}
              </Container>
            </section>
          ))}
        </div>
      ))}
    </Container>
  );
}


/**
 * Button on the Jumbotron that is the text
 */
function SubsectionButton(props) {
  return (
    <Button
      variant="outline-dark"
      style={{ marginRight: "1em" }}
      href={"#" + props.id + "-" + props.type}
    >
      {props.type}
    </Button>
  );
}

/**
 * Text section
 */
function Text(props) {
  return (
    <Card
      id={props.id + "-text"}
      style={{
        borderRadius: "15px",
        backgroundColor: "aliceblue",
        borderWidth: "1px",
        margin: "0vh",
        textAlign: "left",
        fontSize: { bodyTextSize }

      }}
    >
      <Card.Body>
        <Row>
          <Col xs="4">
            <Container><h4 style={{overflowWrap: "breakword"}}>Introduction</h4></Container>
            {/* {props.text} */}
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col xs="0">
            {/* <Container><h4>Introduction</h4></Container> */}
            {props.text}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

function CheckPoint(props) {
  return (
    <Card
      id={props.id + "-checkpoint"}
      style={{
        borderRadius: "15px",
        backgroundColor: "aliceblue",
        borderWidth: "1px",
        margin: "0vh",
        textAlign: "left",
        fontSize: { bodyTextSize }

      }}
    >
      <Card.Body>
        <Row>
          <Col xs="0">
            <Container><h4>Checkpoint</h4></Container>
            {/* {props.checkpoint} */}

          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col xs="0">
            {/* <Container><h4>Checkpoint</h4></Container> */}
            {props.checkpoint}

            {/* <WorkSpaceDemo/> */}

          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

/* Challenges section */
function Challenges(props) {
  return (
    <Card
      id={props.id + "-challenges"}
      style={{
        borderRadius: "15px",
        backgroundColor: "aliceblue",
        borderWidth: "1px",
        margin: "0vh",
        fontSize: { bodyTextSize }
      }}
    >
      <Card.Body>
        <Row>
          <Col xs="0">
            <Container><h4>Challenges</h4></Container>
            {/* <Container>
              {// Maps each challenges }
              { {props.challenges.map((challenge) => (
                <Challenge
                  question={challenge.question}
                  hint={challenge.hint}
                />
              ))}
              <br/><br/>
              <WorkSpaceDemo/> 
            </Container> */}
          </Col>

          {/* each section's small menu icon on the right side */}
        </Row>
        <br />
        <br />
        <Row>
          <Container>
            {/* Maps each challenges */}
            {props.challenges.map((challenge) => (
              <Challenge
                question={challenge.question}
                hint={challenge.hint}
              />
            ))}
            <br /><br />

            {/* <WorkSpaceDemo/>  */}
          </Container>
        </Row>
      </Card.Body>
    </Card>
  );
}

/* Challenge */
function Challenge(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <Container>
      {props.question}

      {/* Help Icon Button */}
      <Nav.Link onClick={() => setModalShow(true)}>
        <BsQuestionCircle />
      </Nav.Link>

      {/* Callse Help Modal*/}
      <HelpModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        hint={props.hint}
      />
    </Container>
  );
}

/**
 * Help Overlay
 */
function HelpModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Hint</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.hint}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

//+---------------------+----------------------------------------------------------------------------------------------------------------------
//| Section Array    |
//+------------------+

const sections = [
  {
    //+------------------+----------------------------------------------------------------------------------------------------------------------
    //| Getting Started  |
    //+------------------+

    title: "Getting Started",

    subsections:
      /* Introduction to MIST */
      [
        {
          title: "Introduction to MIST",
          id: "intro-to-mist",
          keywords: ["introduction", "MIST", "general"],
          image: <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sum(x,y)" resolution="250" />,
          isAnimated: false,
          //Text
          text: (
            <Container>
              Welcome to MIST, the Mathematical Image Synthesis Toolkit!
              {/* In this video we will go over the basic ideas of MIST! */}
              {/* <br /><br /> */}

              {/* After this, you will have a better understanding of how variables
              and functions are getting translated to the cool images that you
              can create with MIST. */}
              <br />
              <br />
              Each image in MIST is drawn on a square canvas.
              {/* <br />
              <br /> */}
              {/* We have an x and a y axis, just like in math class! */}
              <br />
              <br />
              On our canvas, there is a horizontal axis - <b>x</b> - and a vertical axis - <b>y</b>.
              <br />
              X values range from –1 to 1 (left to right).
              {/* X values range from -1 at the left to 1 at the right. */}
              <Image src={arrowX} fluid></Image>

              <br />
              <br />
              Y values range from -1 at the top to 1 at the bottom.
              <br />
              <br />
              <Image src={arrowY} fluid></Image>
              <br />
              <br />
              (Note that our y-axis is likely
              different from the ones you’ve seen before. The values increase
              from the top to the bottom)
              <br />
              <br />
              <Image src={arrowXandY} fluid></Image>
              {/* <MISTImage code="x" resolution="250"/> */}
              <br />
              <br />
              Now you will explore the variable and function blocks
              so you can create your own amazing images!!!
              <br />
              {/* To begin, let's learn to make greyscale images! In greyscale,
               1 corresponds to black, and –1 is white. Any number in between
                renders a shade of gray.
              <br />
              <br />
              If we look at the image made with a function of x, the rendered
              shades depend on the value of the x coordinate. This means that
              as x increases, the image gets darker.
              <br />
              <br />
              <MISTImage code="x" fluid resolution="500"></MISTImage>
              <br />
              <br />
               
              <MISTImage code="mult(x,y)" fluid resolution="500"></MISTImage>
              <br />
              <br />
              Notice that when one variable is negative and the other is positive, the 
              image is lighter--negative values produce less "ink"! */}
            </Container>
          ),

          // //Video
          // video: <Container>This is a video </Container>,

          // //Final
          // final: <Container> This is the final image </Container>,

          // isChallenge: false,

          // //Challenges
          // challenges: [
          //   //   {
          //   //   question:
          //   //     <Container>This is a Challenge 1 </Container>,
          //   //   hint:
          //   //     <Container>This is a hint 1 </Container>
          //   // },
          //   // {
          //   //   question:
          //   //     <Container> This is a Challenge 2 </Container>,
          //   //   hint:
          //   //     <Container> This is a hint 2</Container>
          //   // }
          // ],
        },

        //+------------------+----------------------------------------------------------------------------------------------------------------------
        //| The Workspace    |
        //+------------------+

        {
          title: "The Workspace",
          id: "workspace",
          keywords: ["graph", "grayscale", "general"],
          image: <MISTImage height={document.documentElement.clientWidth/10} 
                            width={document.documentElement.clientWidth/10} 
                            code="x" resolution="200" />,
          isAnimated: false,
          //Text
          text: (
            <Container>
              {/* Welcome to the workspace! This is where you will be making all of
              your lovely images from mathematical equations. */}
              This is the graphical workspace!
              <br />
              <br />
              {/* <Image src={GUIgif} fluid></Image> */}
              <Container fluid>
                <iframe width={document.documentElement.clientWidth/3} height="276" src={workspaceIntro}
                  title="workspace-function-connect" frameborder="0"
                  allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </Container>
              <br />
              <br />
              Here you can click
              on different blocks and drag them to the center panel.
              <br />
              <br />
              {/* <Image src={nodeDragGif} fluid></Image>  */}
              <Container fluid>
                <iframe width={document.documentElement.clientWidth/3} height="276" src={workspaceDrag}
                  title="workspace-function-connect" frameborder="0"
                  allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </Container>
              {/* //gif of moving the nodes!!! */}
              <br />
              <br />
              By <b>double-clicking</b> on blocks and dragging away from
              them, you can connect them to the left side of other blocks.
              <br />
              <br />
              <Container fluid>
                <iframe width={document.documentElement.clientWidth/3} height="276" src={workspaceConnect}
                  title="workspace-function-connect" frameborder="0"
                  allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </Container>
              <br />
              <br />
              Some functions can also be inputs for other functions!
              <br />
              <br />
              <Container fluid>
                <iframe width={document.do} height="276" src={funcConnectVideo}
                  title="workspace-function-connect" frameborder="0"
                  allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </Container>
              <br />
              <br />
            </Container>
          ),
        },

        //+------------------+----------------------------------------------------------------------------------------------------------------------
        //| The Expert UI    |
        //+------------------+

        {
          title: "The Expert UI",
          id: "expert-ui",
          keywords: ["graph", "grayscale", "axis"],
          image: <MISTImage height={document.documentElement.clientWidth/10}
                            width={document.documentElement.clientWidth/10} 
                            code="x" resolution="200" />,
          isAnimated: false,
          //Text 
          text: <Container>
            In addition to the Graphical Workspace, we have
            a workspace that takes in the code itself without using any of the nodes.
            <br />
            <br />
            You can type code into the “create image” tab and click the play button to
            generate the image.
            <br />
            <br />
            <Container fluid>
              <iframe width={document.documentElement.clientWidth/3} height="276" src={codeIntro}
                title="code-intro" frameborder="0"
                allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </Container>
            <br />
            <br />
            If you find you've made an image you like,
            you can save it as a custom function in the “create function” tab and use
            it in other images later.
            <br />
            <br />
            <Container fluid>
              <iframe width={document.documentElement.clientWidth/3} height="276" src={savingFunction}
                title="using-params" frameborder="0"
                allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </Container>
            <br />
            <br />
            If you want to share your image, you can publish it to the gallery
            or download it as a .png file. We currently don’t have
            support for downloading .gif files, but we’re working
            on it!
            <br />
            <br />
          </Container>,

          isChallenge: false,
          //Challenges 
          challenges: [
            {
              question: <Container> This is a Challenge 1 </Container>,
              hint: <Container>This is a hint 1 </Container>,
            },
            {
              question: <Container> This is a Challenge 2 </Container>,
              hint: <Container> This is a hint 2</Container>,
            },
          ],
        },
      ],
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Variables    |
  //+------------------+
  {
    title: "Variables",
    subsections: [
      {
        title: "X, Y, and Constants",
        id: "x-y-constants",
        keywords: ["introduction", "grayscale", "MIST"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            There are many values you can use as inputs in MIST. The
            basic building building blocks are the values, shown here:
            <br />
            <br />
            <Container fluid>
              <iframe width={document.documentElement.clientWidth/3} height="276" src={allVars}
                title="values" frameborder="0"
                allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </Container>
            <br />
            <br />
            Remember that both the <b>X</b> and <b>Y</b> values on the canvas range from -1 to 1.
            <br />
            <br />
            <Row fluid >
              <Col>
                <b>Code:</b> x
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                <br />
                <br />
                As <b>X</b> increases, the image gets darker.
              </Col>
              <Col>
                <b>Code:</b> y
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                <br />
                <br />
                As <b>Y</b> increases, the image gets darker. <b>Remember:</b> in MIST the Y axis increases
                from top to bottom.
              </Col>
            </Row>
            <br />
            A constant is a value that doesn't change, hence the name
            constant. For example, if we set a constant equal to <b>2</b>, the value will
            always be <b>2</b>.
            <br />
            <br />
            <Row>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/15} 
                           width={document.documentElement.clientWidth/15} 
                           code="neg(1)" resolution="100" />
                {/* <br/> */}
                <br />
                <b>Code:</b> -1
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/15} 
                           width={document.documentElement.clientWidth/15} 
                           code="neg(0.5)" resolution="100" />
                {/* <br/> */}
                <br />
                <b>Code:</b> -0.5
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/15} 
                           width={document.documentElement.clientWidth/15} 
                           code="0" resolution="100" />
                {/* <br/> */}
                <br />
                <b>Code:</b> 0
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/15} 
                           width={document.documentElement.clientWidth/15} 
                           code="0.5" resolution="100" />
                {/* <br/> */}
                <br />
                <b>Code:</b> 0.5
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/15} 
                           width={document.documentElement.clientWidth/15} 
                           code="1" resolution="100" />
                {/* <br/> */}
                <br />
                <b>Code:</b> 1
              </Col>
            </Row>
            <br />
            <br />
            Notice that all of the images produced by the constants are completely
            flat--their light/dark values don't depend on any inputs from the canvas.
            <br />
            <br />
            In the Code Workspace, you can simply type numbers for constants. In the Graphical Workspace, you drag
            a constant node into the panel and enter a number to set it (shown on the right of the workspace):
            <br />
            <br />
            <Container fluid>
              <iframe width={document.documentElement.clientWidth/3} height="276" src={constantDemo}
                title="constant-entry" frameborder="0"
                allow="accelerometer; autopause; loop; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </Container>


          </Container>
        ),
        isCheckpoint: false,
        CheckPoint: [
        ],

        isChallenge: false,
        //Challenges
        challenges: [
        ],
      },

      //+---------------------+------------------------------------------------------------------------------------------------------------------
      //| Time and Animations |
      //+---------------------+
      {
        title: "Time and Animations",
        id: "time-animations",
        keywords: ["animation", "grayscale", "time"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
        width={document.documentElement.clientWidth/10} 
        code="x" resolution="200" />,
        isAnimated: true,
        //Text
        text: (
          <Container>
            Functions can also take time as an input, resulting in an animation.
            In MIST, we've used:
            <br />
            <br />
            <Row>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                {/* <br/> */}
                <br />
                <b>Code:</b> t.s
                <br /> Time in seconds
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                {/* <br/> */}
                <br />
                <b>Code:</b> t.m
                <br /> Time in minutes
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                {/* <br/> */}
                <br />
                <b>Code:</b> t.h
                <br /> Time in hours
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                {/* <br/> */}
                <br />
                <b>Code:</b> t.d
                <br /> Time in days
              </Col>

            </Row>
            <br />
            <br />
            You'll notice that t.h and t.d move very slowly. Each time input moves between
            -1 and 1 over the course of its period. The hour and day inputs move slowest
            because they are much larger units of time.
            <br />
            <br />
            As you experiment with time nodes you will see how powerful they are. Try multiplying,
            adding, and feeding time nodes into other functions. With time nodes you can speed up, slow down, or offset
            the animations you create.
          </Container>
        ),
        isCheckpoint: true,
        checkpoint: (
          <Container>
            Try this:
            <br />
            <Row>
              <Col>
                1. Add an <b>x</b> and <b>t.s</b> variable to the workspace.
              </Col>

              <Col>
                2. Drag in a <b>mult</b> block and connect the <b>x</b> and <b>t.s</b> to it.
                Now you can see that as <b>t.s</b> changes, so does the <b>x</b> image.
              </Col>

              <Col>
                3. Bring in a{" "}
                <b>constant</b> variable and set it equal to 2. Connect this to the{" "}
                <b>mult</b> block that is already there.
              </Col>

            </Row>

            <br />
            <br />
          </Container>),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br /><br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Container>
            ),

            hint: (
              <Container>
                {" "}
                What happens when some values get multipled?{" "}
              </Container>
            ),
          },
          {
            question: (
              <Container>
                <p1>
                  Now try making this image: <br /> <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Container>
            ),
            hint: <Container>
              What happens when you use <b>wsum</b> with <b>sin</b>? Try a few different values.
              {/* What happens when you add <b>sin</b> of <b>x</b> and another value? */}
            </Container>,
          },
        ],
      },

      //+------------------------+-------------------------------------------------------------------------------------------------------------------
      //| Moving with the Mouse  |
      //+------------------------+
      {
        title: "Moving with the Mouse",
        id: "moving-with-mouse",
        keywords: ["animation", "grayscale", "mouse"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
        width={document.documentElement.clientWidth/10} 
        code="x" resolution="200" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            MIST can also use your mouse's position as an input. Try moving your mouse over these two images:
            <br />
            <br />
            <Row>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                {/* <br/> */}
                <br />
                <b>Code:</b> m.x
                <br /> The mouse's <b>x</b> value
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
                {/* <br/> */}
                <br />
                <b>Code:</b> m.x
                <br /> The mouse's <b>y</b> value
              </Col>
            </Row>
            <br />
            <br />
            The <b>m.x</b> block changes the colors along the x-values.
            <br />
            <br />
            The <b>m.y</b> block changes the shades from white to black across
            the y-values.
          </Container>
        ),
        isCheckpoint: true,

        checkpoint: (
          <Container>
            To try it yourself:
            <br />
            <br />
            <Row>
              <Col>
                1. Bring <b>x</b>, <b>y</b>, and <b>m.x</b> blocks
                into the workspace.
              </Col>

              <Col>
                2. Then add a <b>mult</b> block in and connect all 3 value blocks to it. You
                should have a simple animation that moves when you hover over it!
              </Col>

            </Row>
            <br />
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage code="wsum(mult(x,m.x,y),m.y)" resolution="250" />
              </Container>
            ),

            hint: (
              <Container>
                {" "}
                What happens when you feed the checkpoint function into another function?
              </Container>
            ),
          },
          {
            question: (
              <Container>
                <p1>
                  For a harder image, try this: <br />
                </p1>
                <MISTImage
                  height="200" width="200"
                  code="wsum(sin(x),cos(y),m.y,m.x)"
                  resolution="250"
                />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                What happens when you add <b>sin</b> and <b>cos</b>?{" "}
                <br />
                Try using <b>wsum</b> instead of <b>sum</b>
                <br />
                What direction of mouse movements change the image?
              </Container>
            ),
          },
        ],
      },
    ],
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Functions    |
  //+------------------+
  {
    title: "Functions",
    subsections: [
      {
        title: "Multiple Inputs",
        id: "multiple-input",
        keywords: ["inputs", "grayscale", "image"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
        width={document.documentElement.clientWidth/10} 
        code="x" resolution="200" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            Multiple-input functions are functions that take 2 or more
            inputs (up to 20). These functions include <b>sum</b>,{" "}
            <b>wsum</b>, <b>mult</b>, and <b>avg</b>.
            <br />
            <br />

            <h5><b>sum</b> and <b>wsum</b></h5>
            <br />
            <Row>
              <Col>
                The <b>sum</b> function adds numbers together. If the result is greater than 1, the function
                will treat the value as 1. Similarly, if the result is less than -1, the function outputs -1.
                This is because MIST caps maximum values at 1 and minimum values at -1.
                <br /><br />
              </Col>
              <Col>
                The <b>wsum</b> (wrap sum) function "wraps" the values around if they're outside{" "}
                the normal range of output. This means that values greater than 1 will be rendered as -1,
                and values less than -1 will be rendered as 1.
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                Here's <b>sum(x,y)</b>.
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
              <Col>

                Here's <b>wsum(x,y)</b>.
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
            </Row>

            <br />
            <br />
            <h5><b>mult</b> and <b>avg</b></h5>
            <br />
            <Row>
              <Col>
                The <b>mult</b> block lets you multiply two or more numbers
                together. Take the example of <b>mult(x,y)</b>.
              </Col>
              <Col>
                The <b>avg</b> (average) function averages the values of two or more inputs.
                See the example of <b>avg(x,y)</b> below.
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                Here's <b>mult(x,y)</b>.
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
              <Col>
                Here's <b>avg(x,y)</b>.
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
            </Row>
            <br />
          </Container>
        ),
        isCheckpoint: true,

        checkpoint: (
          <Container>
            To try out these functions:
            <br />
            <br />
            <Row>
              <Col>
                1. Add an <b>x</b> and <b>y</b> block to the workspace.
              </Col>
              <Col>
                2. Add a <b>sum</b> block and a <b>mult</b> block in.
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                3. Connect the <b>x</b> to the <b>sum</b> block twice, and then the{" "}
                <b>y</b> to the <b>mult</b> twice.
              </Col>
              <Col>
                4. Then bring in an <b>avg</b> block and connect the <b>sum</b> and{" "}
                <b>mult</b> block to it! Now take a look at your final image!
              </Col>
            </Row>
            <br />
            {/* <WorkSpaceDemo/> */}
          </Container>
        ),

        //Final
        // final: <Container> This is a final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Container>
            ),
            hint: (
              <Container> What value changes the image horizontally? </Container>
            ),
          },
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                How does <b>avg</b> change images?{" "}
              </Container>
            ),
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Fixed Inputs     |
      //+------------------+
      {
        title: "Fixed Inputs",
        id: "fixed-input",
        keywords: ["inputs", "grayscale", "image"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
        width={document.documentElement.clientWidth/10} 
        code="x" resolution="200" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            Fixed-input functions only accept a certain number of inputs; no more, no less.
            <br /><br />
            These include: <br />
            <br />
            <Row>
              <Col>
                <b>Sqr</b> multiplies a value by itself.
              </Col>
              <Col>
                <b>Neg</b> multiplies a value by <b>-1</b>
              </Col>
              <Col>
                <b>Sin</b> is the trigonometric function sine.
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
            </Row>
            <br />
            <br />
            <Row >
              <Col>
                <b>Sign</b> is used to round values.
              </Col>
              <Col>
                <b>Abs</b> is absolute value. This turns anything that is negative
                into its positive counterpart
              </Col>
              <Col>
                <b>Cos</b> is the trigonometric function cosine.
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Col>
            </Row>
            <br />
            <br />

            <b>If</b> blocks are a little complicated. The first input of an <b>If</b> block is the <b>test</b>.
            The second input, <b>pos</b> is the output when the test is positive, and the third input, <b>neg</b>, is the output
            when the test is negative.
            <br />
            <br />
            We'll walk you through an example in the Checkpoint section.
            <br />
          </Container>
        ),
        isCheckpoint: true,

        checkpoint: (
          <Container fluid>
            <Row>
              <Col>
                1. Drag <b>x</b> and <b>y</b> blocks into the workspace along
                with an <b>if</b> block.
              </Col>
              <Col>
                2. Connect the <b>x</b> to the first two
                nodes of the <b>if</b> block.
              </Col>
              <Col>
                3. Connect the <b>y</b> block to the third node of the{" "}
                <b>if</b> block.
              </Col>
            </Row>
            <br />
            Experiment with connecting different values to the nodes. If you get comfortable,
            try some of the more complex functions.
            <br />
          </Container>
        ),


        //Final
        // final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Container>
            ),

            hint: (
              <Container>
                {" "}
                How do you change images from vertical to horizonal?{" "}
              </Container>
            ),
          },
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="x" resolution="200" />,
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                What happens when you combine <b>sin</b> and <b>cos</b>?{" "}
              </Container>
            ),
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Adding Color     |
      //+------------------+
      {
        title: "Adding Color",
        id: "adding-color",
        keywords: ["graph", "color", "image"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(mult(y,y),x,square(x))" resolution="250" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            The <b>color</b> function block creates color using the RGB system!
            {" "}<b>RGB</b> is defined by three
            components: red, green, and blue. These components are the primary
            colors in a pixel on your screen. It helps to think about
            RGB in terms of mixing <em>light</em> rather than mixing paint colors: the
            {" "}more you add, the closer you get to white light.
            <br />
            <br />
            <Row>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code={rgbVenn} resolution="300" />
              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code={rgbVennSoft} resolution="300" />
              </Col>
            </Row>

            <br />
            <br />
            <Row>
              <Col>
                An example of solid red,
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(1,-1,-1)" resolution="250" />
              </Col>
              <Col>
                An example of solid green
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(-1,1,-1)" resolution="250" />
              </Col>
              <Col>
                An example of solid blue
                <br />
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(-1,-1,1)" resolution="250" />
              </Col>
            </Row>
            Different amounts of each color component make a unique color.
            <Row>
              <Col>
                Here's a sample image where Red = x, Green = y, and Blue = t.s.
                <br />
                <br />
                Hover over the image to animate.
                <br />
                <br />

              </Col>
              <Col>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(x,y,t.s)" resolution="300" />
              </Col>
            </Row>
          </Container>
        ),

        isCheckpoint: true,

        checkpoint: (
          <Container>
            <br />
            To make your own colorful image, try this!
            <br />
            <br />
            <Row>
              <Col>
                1. Start by adding an <b>x</b> block, a <b>y</b> block, and a <b>color</b> block to your
                workspace.
              </Col>
              <Col>
                2. Drag in a <b>mult</b> block and connect y to it twice.
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                3. Add a <b>sin</b> and connect the <b>x</b> to it.
              </Col>
              <Col>
                4. Connect the <b>mult</b>{" "}
                block to the red, the x to the green, and sign to the blue.
              </Col>
            </Row>
          </Container>


        ),
        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(x,x,y)" resolution="250" />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                What primary colors make solid blue?
                <br />
                <br />
                What primary colors make yellow in the Red-Green-Blue color system?
                <br />
                <br />
                Where are all the colors brightest and darkest?{" "}

              </Container>
            ),
          },
          {
            question: (
              <Container>
                <p1>
                  For a harder challenge, try making this image: <br />{" "}
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="rgb(cos(y),sum(cos(y),x),x)"
                  resolution="250"
                />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                How does <b>cos</b> change how a function looks?{" "}
              </Container>
            ),
          },
        ],
      },
    ],
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Shapes       |
  //+------------------+
  {
    title: "Shapes",
    subsections: [
      {
        title: "Circle",
        id: "circle",
        keywords: ["shape", "grayscale", "image"],
        image: (
          <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sign(wsum(square(x),square(y)))" resolution="250" />
        ),
        isAnimated: false,
        //Text
        text: (
          <Container>
            Have you ever wanted to try making shapes? Here is an example of a
            circle!
            <br /><br />
            1. Place an <b>x</b> and a <b>y</b> in the workspace.
            <br /><br />
            <img src={Circle} alt="Circle Step 1" style={{ height: "75%", width: "75%" }} />
            <br /><br />
            2. <b>Square</b> each of them! We square them because x<sup>2</sup>{" "}
            + y<sup>2</sup> is the equation of a circle.
            <br /><br />
            <img src={Circle1} alt="Circle Step 2" style={{ height: "75%", width: "75%" }} />
            <br /><br />
            3. Add <b>wsum</b>. And make sure it has a W!
            <br /><br />
            <img src={Circle2} alt="Circle Step 3" style={{ height: "75%", width: "75%" }} />
            <br /><br />
            4. Connect it to a <b>sign</b> function! This gets rid of all of the
            gray areas and makes it purely black and white.
            <br /><br />
            <img src={Circle3} alt="Circle Step 4" style={{ height: "75%", width: "75%" }} />
          </Container>
        ),

        //Video
        video: <Container> <iframe width={document.documentElement.clientWidth/3} height="276" src="https://www.youtube.com/embed/YQwvc7hdggE" title="circle-tutorial" frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </Container>,

        //Final
        final: (<Container> This is the final image: <br />
          <img src={Circle3} alt="Circle Final" style={{ height: "75%", width: "75%" }} />
        </Container>),

        isCheckpoint: true,

        checkpoint: (
          <Container>
            Try making a basic circle for yourself, or make a variation:
            <br />
            <br />
          </Container>
        ),
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="neg(sign(wsum(square(x),square(y))))"
                  resolution="250"
                />
              </Container>
            ),
            hint: <Container> What block inverts images? </Container>,
          },

          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="wsum(sum(mult(x,x),mult(y,y),t.s),t.s)"
                  resolution="250"
                />
              </Container>
            ),
            hint: <Container> How does adding time work? </Container>,
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Triangle         |
      //+------------------+
      {
        title: "Triangle",
        id: "triangle",
        keywords: ["shape", "grayscale", "image"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sign(sum(x,y))" resolution="250" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            Making a basic triangle is pretty straightforward!
            <br />
            1. Drag in a <b>x</b> and a <b>y</b> in the workspace.
            <br />
            2. Add a <b>sum</b> block. You can also add a wsum block to see how
            they look different. However, in this tutorial, we will just be
            focusing on sum.
            <br />
            3. Next, place in a <b>sign</b> block. Now if you click on the
            preview button, you will see that you have a triangle!
            <br />
          </Container>
        ),

        isCheckpoint: true,

        checkpoint: (
          <Container>
            Try making a basic triangle for yourself:
            <br />
            <br />
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sign(sum(x,negate(y)))" resolution="250" />
              </Container>
            ),
            hint: <Container> What inverts colors? </Container>,
          },
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="wsum(x,y,t.s)" resolution="250" />
              </Container>
            ),
            hint: <Container> How do you get it to move? </Container>,
          },
        ],
      },
    ],
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Customize    |
  //+------------------+
  {
    title: "Transformations & Combinations",
    subsections: [
      /* Flipping */
      {
        title: "Flipping",
        id: "flipping",
        keywords: ["shape", "grayscale", "image"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sign(neg(sum(x,y)))" resolution="250" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            Flipping an image means that you create the impression of flipping
            an image when you invert the colors! You can flip it horizontally or
            vertically (on the x or the y axis). Here is an example with a
            simple triangle.
            <br />
            1. Start by making a triangle. Click{" "}
            <Link to="#triangle">here </Link> for the triangle tutorial!
            <br />
            To flip horizontally: <br />
            3. Add a <b> neg </b> function to the <b>x </b> value
            <br />
            To flip vertically: <br />
            4. Add a <b> neg </b> function to the <b>y </b> value
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  {" "}
                  Try making a rhombus using a different equation: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sum(sin(x),sin(y),-0.5)" resolution="250" />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                Try adding <b>sin</b> with <b>x</b> or <b>y</b> and then how do
                you change the size of that?{" "}
              </Container>
            ),
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Resizing         |
      //+------------------+
      {
        title: "Resizing",
        id: "resizing",
        keywords: ["size", "shape", "grayscale"],
        image: <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sign(sum(x,y,-0.5))" resolution="250" />,
        isAnimated: false,
        //Text
        text: (
          <Container>
            Resizing can be useful when trying to get an image to look a certain
            way. The easiest way to alter the size of an image inside the canvas
            is to include a constant. Let's go through an example of that!
            <br />
            1. Start by making a triangle. Click{" "}
            <Link to="#triangle">here </Link> for the triangle tutorial!
            <br />
            2. Add a constant and set it equal to <b>-0.5</b>.
            <br />
            3. Connect this to the <b>sum</b> block.
            <br />
            4. Bring a <b>sign</b> block into the workspace.
            <br />
            5. Connect the <b>sum</b> block to it. See how the triangle got
            smaller!
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="sign(wsum(square(x),square(y),0.5))"
                  resolution="250"
                />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                Does making the constant bigger than 0 shrink the circle?{" "}
              </Container>
            ),
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Moving around    |
      //+------------------+
      {
        title: "Moving around",
        id: "moving-around",
        keywords: ["shape", "grayscale", "image"],
        image: (
          <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
            code="wsum(square(sum(x,0.5)),square(y))"
            resolution="250"
          />
        ),
        isAnimated: false,
        //Text
        text: (
          <Container>
            You are familiar with the following circle:In this tutorial, you
            will learn how to move this image along the x and y axis (vertically
            and horizontally).
            <br />
            1. To move the circle horizontally, we have to add or subtract some
            value from the <b>x</b> value. In this case we are adding <b>0.5</b>
            .
            <br />
            2. When finishing this up, you get a circle that is slightly to the
            left. Now try moving it to the right!
            <br />
            3. Similarly to the horizontal example, to move the circle
            vertically, we have to add or subtract some value from the <b>y</b>y
            value. In this case we are adding <b>0.5</b> to <b>y</b>.
            <br />
            4. When finishing this up, you get a circle that is slightly up. Now
            try moving it down!
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="sum(sign(sum(x,0.5)),sign(sum(y,0.5)))"
                  resolution="250"
                />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                Try making the <b>y</b> shape and <b>x</b> shape and then
                combing them.{" "}
              </Container>
            ),
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Assemble         |
      //+------------------+
      {
        title: "Assemble",
        id: "assemble",
        keywords: ["graph", "grayscale", "axis"],
        image: (
          <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
            code="mistif(sign(wsum(square(x),square(y))),y,sign(sum(x,y)))"
            resolution="250"
          />
        ),
        isAnimated: false,
        //Text
        text: (
          <Container>
            You might have created some cool pictures by now. In this tutorial
            you will learn how to put them together into one piece. To do so, we
            need to use the if function. Let’s say you have the following 3
            images:
            <br />
            <br />
            And you want to make it into the following:
            <br />
            <br />
            It uses the circle outline, and uses the second picture as the
            inside of the circle and the third picture as the outside of the
            circle. You just need to connect them together with an if function:
            <br />
            <br />
            Remember what if does? It takes 3 inputs in -- 3 images. It uses the
            second image in all the positive parts of the first image, and the
            third imagery all the negative parts of the image.
            <br />
            <br />
            In the above example, the second image (y) is being used at the
            positive parts (black parts) of the first image (the circle).
            Whereas the third image (the triangle) is being used at the negative
            parts (white parts) of the first image (the circle).
            <br />
            <br />
            So how would it look like if the order was the following with the
            following images:
            <br />
            <br />
            (These are the same images as in the previous one except the circle
            is blended.
            <br />
            <br />
            It looks the following:
            <br />
            <br />
            This is because sign changes all negative parts into white, and
            positive parts into black. By adding a sign function on the first
            image input, you will have an easier time seeing through the
            different parts of the image and the exact dividers.
            <br />
            <br />
            You can also think in quadrants, like in math with graphs and
            coordinates. For example you can use four different images to make
            the following:
            <br />
            <br />
            It makes up of the following four images:
            <br />
            <br />
            1. Make each of these shapes:
            <br />
            <br />
            2. Then connect the upper 2 together with an <b>if</b> function, and
            the bottom 2 together with an <b>if</b> function, while using{" "}
            <b>y</b> as the first image in both cases. You can see that the
            upper image is made up of the upper two images, and the bottom one
            is made up of the bottom two images. They are also being divided up
            horizontally in the middle. This is how it would look like:
            <br />
            <br />
            3. Now, we can connect these two images together based on the{" "}
            <b>x</b> image. Since the <b>x</b> function divides the image up
            vertically in the middle, it uses the first image’s right part, and
            the second image’s left part.
            <br />
            <br />
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                {" "}
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="mistif(x,mistif(y,cos(sin(x)),sign(sum(x,y))),mistif(y,wsum(square(x),square(y)),y))"
                  resolution="250"
                />{" "}
              </Container>
            ),

            hint: (
              <Container>
                {" "}
                Try making each quadrant seperately first!{" "}
              </Container>
            ),
          },
        ],
      },
    ],
  },

  //+---------------------------+-------------------------------------------------------------------------------------------------------------
  //| The Interesting Images    |
  //+---------------------------+
  {
    title: "Interesting Images",
    //+------------------+----------------------------------------------------------------------------------------------------------------------
    //| Colorful Image   |
    //+------------------+
    subsections: [
      {
        title: "Colorful Image",
        id: "colorful-image",
        keywords: ["color", "animation", "interesting"],
        image: (
          <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
            code="rgb(sin(sin(cos(x))),mult(sin(sin(cos(x))),y),wsum(y,t.s))"
            resolution="250"
          />
        ),
        isAnimated: false,
        //Text
        text: (
          <Container>
            Here is an example of a colorful image using many of the skills you
            just learned!
            <br />
            <br />
            1. To start, add an <b>x</b>, <b>y</b>, and <b>t.s</b> variable to
            the workspace.
            <br />
            <br />
            2. After this, bring in a <b>sin</b> and <b>cos</b> block. Connect
            the <b>x</b> to <b>cos</b> first then <b>sin</b>. If we click on the
            previews for <b>sin</b> and <b>cos</b>, we can see how the
            differences in how they look!
            <br />
            <br />
            3. Now, let’s add another <b>sin</b> block and connect the{" "}
            <b>sin</b> from the previous step to it.
            <br />
            <br />
            4. Next, we’re going to drag in a <b>mult</b> block. Let’s connect
            the <b>sin</b> block and the <b>y</b> variable to it!
            <br />
            <br />
            5. Add a <b>wsum</b> block. We’re going to connect <b>t.s</b> and{" "}
            <b>y</b> to this.
            <br />
            <br />
            6. Finally, connect this to an <b>rgb</b> block. We’ll start at the
            top, with <b>sin</b> being red, the <b>mult</b> block going to
            green, and <b>wsum</b> connecting to blue. Now look at this colorful
            animation you just made!
            <br />
            <br />
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="rgb(sin(x),cos(y),t.s)" resolution="250" />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                What does <b>sin</b> and <b>cos</b> look like?{" "}
              </Container>
            ),
          },
          {
            question: (
              <Container>
                {" "}
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="rgb(cos(sin(sin(x))),sum(cos(sin(sin(x))),y),y)"
                  resolution="250"
                />{" "}
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                What happens when you combine multiple <b>sin</b> and <b>cos</b>{" "}
                blocks?{" "}
              </Container>
            ),
          },
        ],
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Moving Image     |
      //+------------------+
      {
        title: "Moving Image",
        id: "moving-image",
        keywords: ["animation", "grayscale", "interesting"],
        image: (
          <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
            code="sin(wsum(neg(square(x)),neg(y),mult(t.s,m.y),m.x,mult(x,y)))"
            resolution="250"
          />
        ),
        isAnimated: false,
        //Text
        text: (
          <Container>
            Here is an example of an interesting and slightly more challenging
            image. It incorporates many aspects from the previous tutorials. To
            begin:
            <br />
            <br />
            1. Start by adding an <b>x</b> and a <b>y</b> variable.
            <br />
            <br />
            2. Next, add a <b>sqr</b>, <b>mult</b>, and <b>neg</b>. Connect the
            <b>x</b> to the <b>sqr</b> and <b>mult</b> and the <b>y</b> to the{" "}
            <b>mult</b> and <b>neg</b>.
            <br />
            <br />
            3. Then bring in another <b>neg</b> block and connect the <b>sqr</b>{" "}
            to this.
            <br />
            <br />
            4. Add a <b>t.s</b>, <b>m.x</b>, and <b>m.y</b>.
            <br />
            <br />
            5. Connect the <b>t.s</b> and <b>m.y</b> to the new <b>mult</b>{" "}
            block in the workspace. and it.
            <br />
            <br />
            6. On their own, the images look simple, but now it's time to put it
            all together. Start by adding a<b>wsum</b>. From there, connect both
            of the <b>neg</b> blocks and <b>mult</b> blocks. Additionally,
            connect the <b>m.x</b> block to the <b>wsum</b> block as well.
            <br />
            <br />
            7. Finally, connect the <b>wsum</b> to a new <b>sin</b> block and
            check out the final image!
            <br />
            <br />
          </Container>
        ),

        //Video
        video: <Container> This is a video </Container>,

        //Final
        final: <Container> This is the final image </Container>,
        isChallenge: true,
        //Challenges
        challenges: [
          {
            question: (
              <Container>
                <p1>
                  Try making the following image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} 
                          width={document.documentElement.clientWidth/10} 
                          code="sin(sin(sum(m.x,x)))" resolution="250" />
              </Container>
            ),

            hint: <Container> How does sin change the image? </Container>,
          },
          {
            question: (
              <Container>
                <p1>
                  For a super challenge, try this image: <br />
                </p1>
                <MISTImage height={document.documentElement.clientWidth/10} width={document.documentElement.clientWidth/10}
                  code="wsum(cos(mult(x,x,x)),cos(mult(x,x,x)),cos(mult(x,x,x)))"
                  resolution="250"
                />
              </Container>
            ),
            hint: (
              <Container>
                {" "}
                What happens when you use <b>cos</b> and <b>wsum</b>?{" "}
              </Container>
            ),
          },
        ],
      },
    ],
  },
];

export default Tutorial;
