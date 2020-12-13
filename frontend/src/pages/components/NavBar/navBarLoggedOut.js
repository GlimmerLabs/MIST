/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// +------------------------+---------------------------------------------------------------------
// | navBarLoggedOut.js     |
// +------------------------+
/** 
 * This file, navBarLoggedOut.js, creates the navigation bar for users
 * who are not signed in. The navigation bar is returned by the
 * function Header.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+
/**
 * Header is built up of the following components:
 *    --Logo
 *    --NavbarCenter
 *        | default mode  (default navigation Bar)
 *        | signIn mode   (when the user is trying to sign in navBar)
 *    --Search
 * 
 * Additional functions:
 *    -SignInUpButton (used in NavbarCenter in the case of ***default*** mode)
 *    -SignInButton (used in NavbarCenter in the case of ***signIn*** mode)
 *    -SignUpButton (used in NavbarCenter in the case of ***signIn*** mode)
 *    -CancelButton (used in NavbarCenter in the case of ***signIn*** mode)
 */


// +---------+----------------------------------------------------------
// | Imports |
// +---------+

import React, { useState, useEffect } from "react";
import FacebookIcon from "../../../design/icons/icons8-facebook-30.png";
import GoogleIcon from "../../../design/icons/icons8-google-48.png";
import MistLogo from "../../../design/Logos/logoFinal.png";
import { Link } from "react-router-dom";
import {
  Navbar, Nav, NavDropdown, Form, Image, InputGroup,
  FormControl, Button
} from "react-bootstrap";
import "../../../design/styleSheets/navBar.css";
import "bootstrap/dist/css/bootstrap.css";

// +---------+----------------------------------------------------
// | Header  |
// +---------+

/** Returns the whole header for logged out users */
function Header(props) {

  return (
    <div id={'basenav'}>
      <Navbar variant="dark" expand="lg" className="navigationBar">
        <Logo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavBarCenter />
        </Navbar.Collapse>
        <Search />
      </Navbar>
    </div>
  );
};

/**
 * returns logo
 */
function Logo() {
  return (
    <Link to="/" style={{ width: "5%" }}>
      <img src={MistLogo} alt="MIST Logo" style={{ maxWidth: "100%" }}></img>
    </Link>
  );
}

/**
 * returns Search
 */
function Search() {
  return (
    <div>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-light" className="searchButton">
          Search
        </Button>
      </Form>
    </div>
  );
}

// +-----------------------+------------------------------------
// | Center Part of NavBar |
// +-----------------------+

/**
 * NavBarCenter returns the center portion of the Header depending on the mode.
 * The two modes are "default", "signIn"
 *    --The default mode is "default".
 *    --The mode changes to "signIn" when the user clicks on the Sign In/Up option.
 *        (they are trying to sign in)
 * */

function NavBarCenter() {

  const [mode, setMode] = useState("default");
  function handleSignInClick() { setMode("signIn") };
  function handleCancelClick() { setMode("default") };

  if (mode === "default") {
    return (
      /* default mode*/
      <Nav className="mr-auto">
        <DefaultCenter />
        <SignInUpButton onClick={handleSignInClick} />
      </Nav>
    );
  } else {
    return (
      /* signIn mode*/
      <Nav className="mr-auto">
        <SignInCenter />
        {/*
        <SignInButton onClick={handleSignInClick} />
        */}
        <SignUpButton />
        <CancelButton onClick={handleCancelClick} />
      </Nav>
    );
  }
}

// +--------------+------------------------------------
// | Default Mode |
// +--------------+

/* DefaultCenter contains links for Create, Challenges, Tutorial, Gallery, and About.*/
function DefaultCenter() {
  return (
    <Nav>
      <NavDropdown title="Create" id="basic-nav-dropdown">
        <NavDropdown.Item href="/createWorkspace">GUI Workspace</NavDropdown.Item>
        <NavDropdown.Item href="/expert">Expert UI</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="/challenges">Challenges</Nav.Link>
      <Nav.Link href="/tutorial">Tutorial</Nav.Link>
      <Nav.Link href="/gallery">Gallery</Nav.Link>
      <NavDropdown title="About" id="basic-nav-dropdown">
        <NavDropdown.Item href="/about">About MIST</NavDropdown.Item>
        <NavDropdown.Item href="/development">Development</NavDropdown.Item>
        <NavDropdown.Item href="/community">Community Guidelines</NavDropdown.Item>
        <NavDropdown.Item href="/faq">FAQ</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

function SignInUpButton(props) {
  return (
    <Nav>
      <Nav.Link href="#" onClick={props.onClick}>
        Sign In / Up
      </Nav.Link>
    </Nav>
  );
}

// +--------------+------------------------------------
// | SignIn Mode  |
// +--------------+


/* Base of the SignIn navigation bar -- Icons + Forms (Inputs, Remember Check) */

function SignInCenter() {

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const login = (e) => {

    // prevents the page from refreshing on submit
    e.preventDefault();

    let user = {
      username: loginUsername,
      password: loginPassword,
    };

    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ action: 'signIn', ...user })
    })
      //redirect user to home page
      .then(res => res.json())
      .then((message) => {
        //console.log("message = " + message);
        if (message === "Success") {
          window.location.href = "/";
        } else {
          console.log(message)
          alert(message);
        }
      });
  }

  return (
    <Nav>
      {/* Google and Facebook Icons */}
      <Image src={GoogleIcon} alt="MIST Logo" className="navBarIcon"></Image>
      <Image src={FacebookIcon} alt="MIST Logo" className="navBarIcon"></Image>

      <Nav.Link eventKey="disabled" disabled> OR </Nav.Link>

      {/* type in labels (email + password) */}
      <Form inline>
        <Form.Label htmlFor="inlineFormInputName2" srOnly>
          className
        </Form.Label>
        <Form.Control
          className="mb-2 mr-sm-2"
          id="inlineFormInputName2"
          placeholder="Username"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
          Email
        </Form.Label>
        <InputGroup className="mb-2 mr-sm-2">
          <FormControl
            id="inlineFormInputGroupUsername2"
            type="password"
            placeholder="Password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </InputGroup>

        {/* Remember Me checkbox */}
        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customCheck1"
          />
          <label class="custom-control-label" for="customCheck1" variant="dark">
            Remember Me
          </label>
        </div>
        <Nav.Link href="#" onClick={login}>
          Sign In
      </Nav.Link>
      </Form>
    </Nav>
  );
}

/* Sign up button */
function SignUpButton(props) {
  return (
    <Nav>
      <Nav.Link href="/signUp" onClick={props.onClick}>
        Sign Up
      </Nav.Link>
    </Nav>
  );
}

/* Cancel up button */
function CancelButton(props) {
  return (
    <Nav>
      <Nav.Link href="#" onClick={props.onClick}>
        Cancel
      </Nav.Link>
    </Nav>
  );
}

export default Header;
