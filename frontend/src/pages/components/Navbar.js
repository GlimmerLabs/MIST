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

// +------------+----------------------------------------------------------------------
// | Navbar     |
// +------------+
/** 
 * This file, Navbar.js was refactored from navBarLoggedOut.js. It creates the 
 * navigation bar, whose appearances depends on whether or not a user has been 
 * authenticated. It figures this out by checking the UserContext. 
 * The navigation bar is returned by the function Header.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licensed under a LGLP 3.0 or later .....
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
 *        | UserDropdown  (when the user has been authenticated)
 *    --Search
 * 
 * Additional functions:
 *    -SignInUpButton (used in NavbarCenter in the case of ***default*** mode)
 *    -SignInButton (used in NavbarCenter in the case of ***signIn*** mode)
 *    -SignUpButton (used in NavbarCenter in the case of ***signIn*** mode)
 *    -SignOutButton (used in UserDropdown in case the user as been signed in)
 *    -CancelButton (used in NavbarCenter in the case of ***signIn*** mode)
 */


// +---------+----------------------------------------------------------
// | Imports |
// +---------+

import React, { useContext, useState } from "react";
import FacebookIcon from "../../design/icons/icons8-facebook-30.png";
import GoogleIcon from "../../design/icons/icons8-google-48.png";
import MistLogo from "../../design/Logos/logoFinal.png";
import { Link } from "react-router-dom";
import {
  Navbar, Nav, NavDropdown, Form, Image, InputGroup,
  FormControl, Button
} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import "../../design/styleSheets/navBar.css";
import "bootstrap/dist/css/bootstrap.css";
import { UserContext } from './Contexts/UserContext';

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
    </div>)
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
// | Center Part of Navbar |
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

  const { user } = useContext(UserContext);
  function isUserAuthenticated(user) {
    if (user && user._id) {
      return true;
    } else {
      return false;
    }
  };
  const isAuthenticated = isUserAuthenticated(user);
  if (mode === "default") {
    return (
      /* default mode*/
      <Nav className="mr-auto">
        <DefaultCenter />
        { isAuthenticated ?
          <UserDropdown username={user.username} /> :
          <SignInUpButton onClick={handleSignInClick} />}
      </Nav>
    );
  } else {
    return (
      /* signIn mode*/
      <Nav className="mr-auto">
        <SignInCenter resolve={handleCancelClick} />
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
        <LinkContainer to="/createWorkspace">
          <NavDropdown.Item>GUI Workspace</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/expert">
          <NavDropdown.Item>Expert UI</NavDropdown.Item>
        </LinkContainer>
      </NavDropdown>
      <LinkContainer to="/challenges">
        <Nav.Link>Challenges</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/tutorial">
        <Nav.Link>Tutorial</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/gallery">
        <Nav.Link>Gallery</Nav.Link>
      </LinkContainer>
      <NavDropdown title="About" id="basic-nav-dropdown">
        <LinkContainer to="/about">
          <NavDropdown.Item>About MIST</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/development">
          <NavDropdown.Item>Development</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/community">
          <NavDropdown.Item>Community Guidelines</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/faq">
          <NavDropdown.Item href="/faq">FAQ</NavDropdown.Item>
        </LinkContainer>
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

function SignInCenter(props) {

  const { updateAuthenticatedUser } = useContext(UserContext);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const login = (e) => {

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
      .then(async (message) => {
        //console.log("message = " + message);
        if (message === "Success") {
          // window.location.href = "/";
          //
          await updateAuthenticatedUser();
          props.resolve();
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
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1" variant="dark">
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

/* username dropdown */
function UserDropdown(props) {
  return (
    <NavDropdown title={props.username} id="basic-nav-dropdown">
      <LinkContainer to="/profile">
        <NavDropdown.Item>Profile</NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/settings">
        <NavDropdown.Item>Settings</NavDropdown.Item>
      </LinkContainer>
      <NavDropdown.Divider />
      <SignOutButton />
    </NavDropdown>
  );
};

/* Sign Out Bar */
function SignOutButton(props) {
  const { updateAuthenticatedUser } = useContext(UserContext);
  function signOut() {
    fetch('/api?action=signOut', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then(res => {
			alert('signing out');
      updateAuthenticatedUser();
    }).catch((err) => console.log(err))
  }
  return (
    <NavDropdown.Item href="#" onClick={() => signOut()}>
      Sign Out
    </NavDropdown.Item>
  );
}


export default Header;
