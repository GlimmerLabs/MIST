// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * gallery.js
 * 
 * This exports the gallery pages (featured, random, toprated, recent).
 * It calls displayImages.js in order to display the images and the pagination.
 * Currently no buttons to switch pages, but the code for the pages is there.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 *
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
import React, { useState, useEffect } from "react";
import DisplayImages from "./components/displayImages";
import { Button, Container } from 'react-bootstrap';


export default function Gallery() {

  const [cards, setCards] = useState([]);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  // grab the category based on which page they are
  // this grabs the word after the last slash in the url
  const category = (window.location.href).split('/').slice(-1)[0];

  // fetch the images, depending on what category is selected
  useEffect(() => {
    switch (category) {
      case 'recent':
        fetch('/api?action=getRecentImages')
          .then(req => req.json())
          .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      case 'top-rated':
        fetch('/api?action=getTopImages')
          .then(req => req.json())
          .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      case 'featured':
        fetch('/api?action=getFeaturedImages')
          .then(req => req.json())
          .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      default:
        fetch('/api?action=getRandomImages')
          .then(req => req.json())
          .then(cards => { setCards(cards); setCardsLoaded(true) });
    }
  }, [category])

  return (
    <div style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
      <h1>Gallery</h1>
      <p>Get Inspired by others!</p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button variant="outline-dark" href="/gallery/recent">
          Recent
        </Button> &nbsp;&nbsp;&nbsp;
        <Button variant="outline-dark" href="/gallery/featured">
          Featured
        </Button> &nbsp;&nbsp;&nbsp;
        <Button variant="outline-dark" href="/gallery/top-rated">
          Top Rated
        </Button> &nbsp;&nbsp;&nbsp;
        <Button variant="outline-dark" href="/gallery/random">
          Random
        </Button>
      </div>
      <Container>
        <DisplayImages cards={cards} cardsLoaded={cardsLoaded} />
      </Container>
    </div>
  );
}