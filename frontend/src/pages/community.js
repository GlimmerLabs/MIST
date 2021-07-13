
// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * community.js
 * This file is  displays the Community Guidelines
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
import React from "react";
import { Container } from "react-bootstrap";
import "./../design/styleSheets/community.css";

// full community page
function Community() {
  return (
    <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem", width: "70%" }}>
      <div>
        <h1>Community Guidelines</h1>
      </div>
      <div id="community">
        <h2>Welcome to MIST!</h2> 
        <p> MIST provides a new approach to making interesting abstract images
        and we would like you to share that experience with other users and friends.
        We provide the ability to see other user’s images and write comments,
        where we hope you can find inspiration and applaud other people’s creativity.
        We very much would like you to help us do just that, so here are some
        guidelines for how to participate. </p>

        {/* Short Version */}
        <h2>The Short Version</h2>
        <ul>
          <li>
            Be nice!
          </li>
          <li>
            See anything offensive? Just report and we’ll remove the bad stuff!
          </li>
          <li>
            In addition to reporting, you have the option to hide content and block users.
          </li>
          <li>
            Respect and help the moderators. We appreciate those who help us
            identify inappropriate content and users!
          </li>
        </ul>
        
        {/* Rules & Guidelines */}
        <h2>Rules and Guidelines</h2>
        <ul>
          <li>
            <b>Be respectful:</b> When creating images or posting comments,
            remember that people of different ages and backgrounds will see what you’ve shared.
          </li>
          <li>
            <b>Share:</b> You are free to remix projects, ideas, images, or anything else you find
            on MIST– and anyone can use anything that you share. Be sure to give credit when you remix.
          </li>
          <li>
            <b>Keep personal information private:</b> For safety reasons, don't give out any information
            that could be used for private communication - such as real last names, phone numbers,
            addresses, email addresses, links to social media sites or websites with unmoderated chat
          </li>
          <li>
            <b>Be honest:</b> Don’t try to impersonate other users, spread rumors, or otherwise
            try to trick the community.
          </li>
        </ul>
        <p style={{paddingBottom: "10px"}}>Here are things that will get your comment, image, or album removed and quite possibly
        get you banned. Note that this is not a comprehensive list. Our moderators reserve
          the right to remove anything we deem inappropriate.</p>
        <ul>
          <li>
            <b>Spam:</b> Zero tolerance, of course! If it comes from a human or a robot,
            spam will be deleted.
          </li>
          <li>
            <b>Personal attacks/Harassment:</b> Don’t attack or insult another user.
            It’s not helpful and it doesn’t make MIST a friendly place.
          </li>
          <li>
            <b>Illegal activities: </b> Posting links to illegal downloads,
            ways to steal service, and other nefarious activity is not OK here.
          </li>
          <li>
            <b>Explicit material:</b> A good rule of thumb is that anything beyond PG-13
            will get you in trouble, but we reserve the right to remove anything we
            deem inappropriate.
          </li>
          <li>
            <b>Offensive content:</b> Inappropriate content, both visual and written,
             have no place here. Please remain mindful of the words you use and the
             images you create. We understand that people may hold different opinions
             about what is inappropriate and we take this into consideration when moderating.
          </li>
          <li>
            <b>Discrimination:</b> Attacking entire classes of people is just
            like attacking a single person: we’ll ban you for it. Example forms of discrimiation:
            <ul>
              <li>Racism</li>
              <li>Sexism</li>
              <li>Ableism</li>
              <li>Heterosexism/Homophobia</li>
              <li>Transphobia</li>
            </ul>
            This list is by no means exhaustive and we will not tolerate discimination of any form.
          </li>
          <li>
            <b>Trolling: </b> Trolling is a complex term, but in its basic essence, includes
            intentionally provoking other users for an emotional response (usually anger),
            writing inflammatory and off-topic material, and in general, causing chaos.
            If you’re abusing the good conversations, we will take those comments, images,
            and or albums down.
          </li>
        </ul>
        <p>Above all, our team of moderators works to keep conversation here friendly,
        engaging, helpful, and productive. If we feel content is harming that endeavor,
          we’ll take action.</p>
        <p><b>See any of the above? You can help us out by reporting!</b></p>

        {/* Hiding, Blocking, Reporting */}
        <h2>Hiding, Blocking, and Reporting</h2>
        <p style={{paddingBottom: "10px"}}>We provide the ability to hide and report images, comments, albums,
          and block and report users. </p>
        <ul>
          <li>
            <b>Hide:</b> You will not see this content again, but you will still be able
          to see other content the author creates. This is not the same as reporting and
          will only affect what you see. To hide something, click the “...” option next to
          the content and select <i>hide.</i> Once you have hidden content, you will have the
          ability to view hidden content in your personal settings page and unhide anything.
          </li>
          <li>
            <b>Block:</b> You will not see the user or any content from this user.
          This is not the same as reporting and will only affect what you see.
          To block a user, navigate to their profile page and select <i>block</i>.
          Once you block a user, you have the ability to unblock from “block list”
          in the personal settings page.
          </li>
          <li>
            <b>Report:</b>
            <ul>
              <li>
                <b>Reporting content:</b> To report content, click the “...” option next
              to the content and select <i>report</i>. You will be asked to select the reasoning
              for the report and the content will be automatically hidden. If our moderators
              deem the content inappropriate it will be removed and no one will be able to see it.
              </li>
              <li>
                <b>Reporting Users:</b> To report a user, navigate to their profile page and
              select <i>report</i>. You will be asked to select the reasoning for the report. If our
              moderators deem the user to be breaking the community guidelines, they will be banned.
              </li>
              <li>
                We appreciate you taking time to report. Please be patient as it may take some time
                for reports to be processed; we do not have full time moderators. Once your report has
                been reviewed, we will send you an email with the status of the report.
              </li>
            </ul>
          </li>
        </ul>
        <br/>
        <p>These guidelines were inspired by Scratch’s and The Verge’s community guidelines. </p>
        <p>Scratch: <a href="https://scratch.mit.edu/community_guidelines">Community Guidelines</a> </p>
        <p>The Verge: <a href="https://www.theverge.com/pages/community-guidelines">Community Guidelines</a> </p>
        <br/>
        <p>&copy;2021 Glimmer Labs</p>
      </div>
    </Container>
  );
}

export default Community;