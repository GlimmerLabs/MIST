
// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * about.js
 * 
 * This file is that displays the About page, which gives basic information about MIST.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 *
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
import React from "react";
import { Container } from "react-bootstrap";
import "./../design/styleSheets/styles.css";
import "./../design/styleSheets/about.css";


//full page
const About = () => {
  return (
    <Container fluid style={{marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem"}}>
      <AboutHeader />
      <AboutContent />
    </Container>
  );
};

//page title
const AboutHeader = () => {
  return (
    <div>
      <h1>About MIST</h1>
    </div>
  );
};

//page contents (Q&A)
const AboutContent = () => {
  return (
    <div>
      <dl id="aboutQA">
        <Container>
          <dt>What is MIST?</dt>
          <dd>
            MIST (or the Mathematical Image Synthesis Toolkit) is a tool for
            creating images and animations using simple math functions. You can
            make your own art from scratch, complete challenges, and share your
            creations with the MIST community.
          </dd>
        </Container>
        <Container>
          <dt>Who can use MIST?</dt>
          <dd>
            Anyone! MIST does not require any prior experience in art, math, or
            computer science.
          </dd>
        </Container>
        <Container>
          <dt>What can I learn with MIST?</dt>
          <dd>
            You will learn artistic creativity, functional problem solving, and
            computational thinking.
          </dd>
        </Container>
        <Container>
          <dt>How can I share my art?</dt>
          <dd>
            Create an account to see, share, and modify the work of other users.
            You will join a community of people who love to create art and learn
            computing.
          </dd>
        </Container>
        <Container>
          <dt>Community Guidelines</dt>
          <dd>
            You can find our community guidelines <a href="/community">here</a>
          </dd>
        </Container>
      </dl>
    </div>
  );
};

export default About;