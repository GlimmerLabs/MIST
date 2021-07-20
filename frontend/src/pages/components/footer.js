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
// | footer.js     |
// +-----------------------+
/** 
 * This file returns the footer of this website
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Imports        |
// +----------------+
import React from "react";
import "../../design/styleSheets/generalStyles.css";
import { Container, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Creates the footer
 */

function Footer() {
  return (
    <Container fluid id="footer">
      {/* copy right */}
      <p className="justify-content-center">&copy;2021 Glimmer Labs </p>
      <Nav className="justify-content-center" activeKey="/home">
        {/* about */}
        <Nav.Item>
          <Nav.Link href="/about" id="footer-button">
            About
          </Nav.Link>
        </Nav.Item>

         {/* contact */}
        <Nav.Item>
          <Nav.Link href="/contact" id="footer-button">
            Contact
          </Nav.Link>
        </Nav.Item>

         {/* license */}
        <Nav.Item>
          <Nav.Link href="/license" id="footer-button">
            License
          </Nav.Link>
        </Nav.Item>

         {/* privacy policy */}
        <Nav.Item>
          <Nav.Link href="/privacy" id="footer-button">
            Privacy Policy
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}

export default Footer;