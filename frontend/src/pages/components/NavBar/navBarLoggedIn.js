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

// +-----------------------+----------------------------------------------------------------------
// | navBarLoggedIn.js     |
// +-----------------------+
/**
 * This file, navBarLoggedIn.js, creates the navigation bar for users
 * who are signed in. The navigation bar is returned by the
 * function UserHeader.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+
/**
 * UserHeader is built up of the following components:
 *    --Logo
 *    --Navbar
 *        | Create, Challenges, Tutorial, Gallery, About and its dropdowns
 *        | Username dropdown
 *            |Profile, Settings, <SignOutButton>
 *    --Search
 */

// +---------+----------------------------------------------------------
// | Imports |
// +---------+
import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";

/* Imports for stylesheet & logo */
import MistLogo from "../../../design/Logos/logoFinal.png";
import "../../../design/styleSheets/navBar.css";

/* Imports for bootstrap */
import {
  Navbar, Nav, NavDropdown, Form,
  FormControl, Button
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";


// +------------+----------------------------------------------------------
// | UserHeader |
// +------------+

function UserHeader(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api?action=getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(user => {
        if (user) setUser(user);
      })
  }, [user])

  return (
    <div id={'usernav'}>
      {/* variant is the styling of it, see more on bootstrap */}
      <Navbar variant="dark" expand="lg" className="navigationBar">
        <Logo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavBar user={user} />
        </Navbar.Collapse>
        <Search />
      </Navbar>
    </div>
  );
};

/**
 *  returns the logo
 */
function Logo() {
  return (
    <Link to="/" style={{ width: "5%" }}>
      <img src={MistLogo} alt="MIST Logo" style={{ maxWidth: "100%" }}></img>
    </Link>
  );
}
/**
 * returns the searchBar
 */
function Search() {
  return (
    <div>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />

        {/* variant is the styling of it, see more on bootstrap */}
        <Button variant="outline-light" className="searchButton">
          Search
        </Button>
      </Form>
    </div>
  );
}

/* Base Nav Bar */

/* First part of the base navigation Bar (Create, Challenges, Tutorial, Gallery, About and its dropdowns) */
function NavBar(props) {

  let username;
  if (props.user)
    username = props.user.username;
  else
    username = "Account"

  return (
    <Nav>
      <NavDropdown title="Create" id="basic-nav-dropdown">
        <NavDropdown.Item href="/createWorkspace">GUI Workspace</NavDropdown.Item>
        <NavDropdown.Item href="/expert">Expert UI</NavDropdown.Item>
      </NavDropdown>      <Nav.Link href="/challenges">Challenges</Nav.Link>
      <Nav.Link href="/tutorial">Tutorial</Nav.Link>
      <Nav.Link href="/gallery">Gallery</Nav.Link>
      {/* about dropdown */}
      <NavDropdown title="About" id="basic-nav-dropdown">
        <NavDropdown.Item href="/about">About MIST</NavDropdown.Item>
        <NavDropdown.Item href="/development">Development</NavDropdown.Item>
        <NavDropdown.Item href="/faq">FAQ</NavDropdown.Item>
      </NavDropdown>
      {/* username dropdown */}
      <NavDropdown title={username} id="basic-nav-dropdown">
        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
        <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <SignOutButton />
      </NavDropdown>
    </Nav>
  );
}

/* Sign Out Bar */
function SignOutButton(props) {
  return (
    <NavDropdown.Item href="#" onClick={signout}>
      Sign Out
    </NavDropdown.Item>
  );
}


function signout() {
  fetch('/api?action=signOut', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }).then(res => {
    window.location.href = "/";
  })
}

export default UserHeader;