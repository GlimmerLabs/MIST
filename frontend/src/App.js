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

// +-------------+----------------------------------------------------------------------
// | App.js      |
// +-------------+

/**
 * This is the App.js
 * This file is in charge of rendering the different pages
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licensed under a LGLP 3.0 or later .....
 *
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+

/**
 * This app is a single-page website. It always renders into index.html's <root
 * element the following way:
 *
 * It always displays a navigation bar:
 *      -- the user navigation bar if the user is signed in
 *      -- the base navigation bar if the user is NOT signed in
 *
 * Then, it renders one of the 'pages' page content (eg. home, about, workspace, tutorials, etc.)
 *      -- the page it renders depends on the URL path
 *            if it calls the /about path, then it calls the About imported component
 *
 * It always renders the 'footer' component in the end
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+

/* imports from react libraries */
import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";

/* imports stylesheet & userContext */
import "./design/styleSheets/generalStyles.css";
import { UserContext } from "./pages/components/Contexts/UserContext";

/* Imports the 2 types of navigation bar */
import NavBar from "./pages/components/Navbar";

/* Imports for the actual page contents */
import About from "./pages/about";
import Challenges from "./pages/challenges";
import Community from "./pages/community";
import Contact from "./pages/contact";
import Development from "./pages/development";
import EmailVerification from "./pages/emailVerification";
import Expert from "./expert/";
import Faq from "./pages/faq";
import Gallery from "./pages/Gallery";
import Home from "./pages/home";
import License from "./pages/license";
import Privacy from "./pages/privacy";
import ReportForm from "./pages/report";
import Settings from "./pages/settings";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Tutorial from "./pages/tutorial";
import User from "./pages/user";
import UserProfile from "./pages/profile";
//import WorkSpace from "./Workspace";
import WorkspaceComponent from "./workspace";

/* imports the footer */
import Footer from "./pages/components/footer";

import { imageExists, saveImage,
workspaceExists, saveWorkspace, getWorkspaces } from './http.workspace';
// +-------------+----------------------------------------------------------------------
// | App         |
// +-------------+

function App() {
  const { user } = useContext(UserContext);

  return (
    /* the page-container styling helps with the footer */
    <div id="page-container">
      <BrowserRouter>
		<NavBar />
        {/* the container-wrap styling helps with the footer */}
        <Container fluid id="content-wrap">
          <Switch>
            {/* pages */}
            <Route path="/" component={Home} exact />
            <Route path="/about" component={About} />
            <Route path="/challenges" component={Challenges} />
            <Route path="/community" component={Community} />
            <Route path="/contact" component={Contact} />
            <Route path="/development" component={Development} />
            <Route path="/expert" children={<Expert />} />
            <Route path="/faq" component={Faq} />
            <Route path="/gallery/:category" component={Gallery} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/license" component={License} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/report" children={ReportForm} />
            <Route path="/settings" component={Settings} />
            <Route path="/signIn" component={SignIn} />
            <Route path="/signUp" component={SignUp} />
            <Route path="/tutorial" component={Tutorial} />
            <Route path="/user" component={User} />
            <Route path="/emailVerification/:token" component={EmailVerification} />
            {/* workspace */}
            <Route
              path="/createWorkspace"
              children={
                <WorkspaceComponent
                  width={document.documentElement.clientWidth}
                  height={document.documentElement.clientHeight * 0.81}
                  menuHeight={document.documentElement.clientWidth * 0.08}
                  funBarHeight={document.documentElement.clientHeight * 0.1}
                  functionWidth={document.documentElement.clientWidth * 0.047}
                  valueWidth={document.documentElement.clientWidth * 0.047}
                  offset={0}
                />
              }
            />
            <Route path="/expert" render={(props) => <Expert {...props} />} />

            {/* overlay modal when opening an image */}
            <Route path="/img/:url" children={<Gallery />} />
          </Switch>
        </Container>

        {/* footer */}
        <Footer id="footer" />
      </BrowserRouter>
    </div>
  );
}

export default App;
