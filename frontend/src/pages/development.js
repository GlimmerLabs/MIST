// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * development.js
 * 
 * This exports the development page, which gives a disclaimer about
 * how MIST is still in developmental phases.
 * 
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React from "react";
import "./../design/styleSheets/styles.css";
import "./../design/styleSheets/about.css";
import { Container } from "react-bootstrap";

// +-------------------+----------------------------------------------------------------------
// | development.js    |
// +-------------------+
//Disclaimer about how MIST is still in developmental phases
const Development = () => {
  return (
    <Container fluid style={{marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem"}}>
      <h1>Development</h1>
      <Container className="clear:left;">
        <p>
          Welcome to the MIST public beta release. We hope that you have fun
          experimenting with MIST. In case you haven't figured it out, MIST
          provides a new approach to making interesting abstract images. We hope
          that you will be inspired by the sample images already on the site and
          that you will be inspired to create your own.
        </p>
        <p>
          Because MIST is in its early stages of development, you are likely to
          find some things missing on this Web site, and you'll ocassionally
          find that things don't work as they should. We'd appreciate it if
          you'd take the time to let us know about &nbsp;
          <a href="https://docs.google.com/forms/d/1vWQcSE6oU-yiM0CWk-q55aBj6Ec8zTRTepUlKdbPdog/viewform">
            features &nbsp;
          </a>
          that you would like to see and any &nbsp;
          <a href="https://docs.google.com/forms/d/1TrMg8uoYFa1JJYR4qRAxX396gGW46UazTnU_Z23eQm8/viewform">
            bugs &nbsp;
          </a>
          that you have encountered. If you spend more than a few minutes on the
          site, we'd also appreciate it if you'd fill out the &nbsp;
          <a href="https://docs.google.com/forms/d/1DUo5eEY-5w8amayx9DJMifr7BvgzRUp1yy4a9-r09-g/viewform">
            user feedback form
          </a>
          .
        </p>
        <p className="text-align: right;">-- The MIST Team</p>
      </Container>
    </Container>
  );
};

export default Development;
