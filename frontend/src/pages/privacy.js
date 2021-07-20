// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * privacy.js
 * 
 * This exports the privacy policy page, which is not yet completed.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React from "react";
import { Container } from "react-bootstrap";

//full page
function Privacy() {
  return (
    <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem", width: "70%" }}>
      <div>
        <h1>Privacy Policy</h1>
      </div>
      <div id="community">
        <br/>
        <p>We at Glimmer Labs take your privacy very seriously. We believe that you, the user, 
          should understand exactly what information we are keeping track of on our end, and be 
          made aware of the steps you can take to control that information. This privacy policy 
          will detail the following things, as well as the settings you have access to that can adjust these things:
           </p>
           <br/>
           <ul>
             <li>
             The information we track while you are navigating our site.
             </li>
             <li>
             The information we store in our database.
             </li>
           </ul>

        {/* Short Version */}
        <h2>Information from Cookies</h2>
        <p>
        The MIST website uses Google Analytics to track how you navigate the site. 
        We use this to better understand what our users want and how they respond 
        to the content on the site--most importantly, where users leave the site--
        which allows us to better focus our efforts to keep you engaged. 
        Google Analytics records a large amount of data, so we recommend 
        looking at Google’s Privacy Policy
        <a href="http://www.google.com/intl/en/policies/privacy/#infocollect"> here. </a>
        We understand if you feel uncomfortable with this data 
        being recorded, and as such provide the link to  
        <a href="https://tools.google.com/dlpage/gaoptout"> disable google analytics  </a>  
        for your web browser.
        </p>
        
        
        {/* Rules & Guidelines */}
        <h2>Information Stored by Us</h2>
        <p>
        One of the features we provide as content creating website is the ability 
        to share the images you create with other users. As such, any image that 
        you create and save to your account is stored on our server as the code 
        that rendered it. You own the image under the  
        <a href="http://creativecommons.org/licenses/by-sa/4.0/legalcode"> Creative Commons Attribution-ShareAlike 4.0 International, </a> 
        and you are free to create additional contracts with third parties 
        in relation to your own work. We are free to display your image, along with the code 
        used to render it, on our website and to use it in additional educational materials related to our project.
        Glimmer Labs will not sell, rent, or exchange the email address or other account information ​of our users.
         In the future, we plan to use email addresses for the following purposes:
        </p>
        <br/>
        <ul>
          <li>
          To verify user accounts on account creation.
          </li>
          <li>
          To provide account recovery services to users.
          </li>
        </ul>
        <br/>
        
        <p>&copy;2021 Glimmer Labs</p>
      </div>
    </Container>



   
    // OLD PRIVACY POLICY BELOW
    /* 
        <Container className="center">
            <div id="pageTitleGeneral">
                <h1> Privacy Policy</h1>
            </div>
            <div id='policy-content'>
                <p>We at Glimmer Labs take your privacy very seriously. 
                We believe that you, the user, should understand exactly
                what information we are keeping track of on our end, and
                be made aware of the steps you can take to control that information. 
                This privacy policy will detail the following things, as well as 
                the settings you have access to that can adjust these things:
                </p>
                <ul>
                    <li> The information we track while you are navigating our site.</li>
                    <li> The information we store in our database.</li>
                </ul>
                <h2> Information from Cookies</h2>
                    <p>The MIST website uses Google Analytics to
                    track how you navigate the site. We use this
                    to better understand what our users want and
                    how they respond to the content on the site--
                    most importantly, where users leave the site--
                    which allows us to better focus our efforts to
                    keep you engaged. Google Analytics records a large
                    amount of data, so we recommend looking at Google’s
                    Privacy Policy
                    <a href="http://www.google.com/intl/en/policies/privacy/#infocollect">here</a>. 
                    We understand if you feel uncomfortable with
                    this data being recorded, and as such provide the link to
                    <a href="https://tools.google.com/dlpage/gaoptout"> disable google analytics</a>
                    for your web browser.</p>
                <h2> Information Stored by Us</h2>
                    <p>One of the features we provide as content
                    creating website is the ability to share the
                    images you create with other users. As such,
                    any image that you create and save to your
                    account is stored on our server as the code
                    that rendered it. You own the image under the 
                    <a href="http://creativecommons.org/licenses/by-sa/4.0/legalcode">
                    Creative Commons Attribution-ShareAlike 4.0 International</a>,
                    and you are free to create additional contracts with
                    third parties in relation to your own work. 
                    We are free to display your image, along with 
                    the code used to render it, on our website and to
                    use it in additional educational materials related to our project. </p>
                <p>Glimmer Labs will not sell, rent, or exchange
                 the email address or other account information ​of our users.
                In the future, we plan to use email addresses for the following purposes:</p>
                 <ul>
                    <li> To verify user accounts on account creation.</li>
                    <li> To provide account recovery services to users.</li>
                    </ul>
             </div>
        </Container>
        
       }*/
  );
}

export default Privacy;
