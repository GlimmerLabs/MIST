// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * faq.js
 * 
 * This exports the FAQ (frequently asked questions) page.

 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+

import React from 'react';
import "./../design/styleSheets/styles.css";
import "./../design/styleSheets/about.css";
import { Container } from 'react-bootstrap';

//FAQ about MIST; with links to forms to report bugs, 
//request features, and how to reach MIST admin
const Faq = () => {
    return (
        <Container fluid className="clear:left;">
        <h2>FAQ</h2>
        <dl>
          <dt>
            What can I do on this site?
          </dt>
          <dd>
            <ul>
              <li>Browse interesting images in the galleries.</li>
              <li>Create interesting images yourself using the gui. </li>
              <li>Challenge yourself to figure out how to make the images that appear in the challenges section.</li>
            </ul>
          </dd>
          <dt>
            Where can I find the bug report form?
          </dt>
          <dd>
            Here's the <a href="https://docs.google.com/forms/d/1TrMg8uoYFa1JJYR4qRAxX396gGW46UazTnU_Z23eQm8/viewform">bug report form</a>.
          </dd>
          <dt>
            Where can I find the feature request form?
          </dt>
          <dd>
            Here's the <a href="https://docs.google.com/forms/d/1vWQcSE6oU-yiM0CWk-q55aBj6Ec8zTRTepUlKdbPdog/viewform">feature request form</a>.
          </dd>
          <dt>
            What should I do if I have other questions?
          </dt>
          <dd>
            Send us mail at <a href='mailto:theglimmerlabs@gmail.com'>theglimmerlabs@gmail.com</a>!
          </dd>
          <dt>
            Why are you using a self-signed certificate for https?
          </dt>
          <dd>
            We haven't had time to get a reasonable certificate.
          </dd>
        </dl>
      </Container>
    );
}
 
export default Faq;
