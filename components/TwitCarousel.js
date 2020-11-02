import React, {useState} from "react";
import Nav from 'react-bootstrap/Nav';
import Carousel from 'react-bootstrap/Carousel';

import TwitEventDeck from "./TwitEventDeck";
import TwitPlayerDeck from "./TwitPlayerDeck";
import "../styles/TwitCarousel.css";

function TwitCarousel(props) {

    const [activeLink, setActiveLink] = useState(0);

    return (
        <React.Fragment>
            <Nav className="nav-style">
            <Nav.Item>
                <Nav.Link eventKey={0} onSelect={(k) => setActiveLink(parseInt(k))}>
                <div className={activeLink === 0 ? "link-active" : "link-inactive twit-link"}>
                    <span>Schedule</span>
                </div>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={1} onSelect={(k) => setActiveLink(parseInt(k))}>
                <div className={activeLink === 1 ? "link-active" : "link-inactive twit-link"}>
                    <span>Roster</span>
                </div>
                </Nav.Link>
            </Nav.Item>
            </Nav>
            <Carousel activeIndex={activeLink} controls={false} indicators={false}>
            <Carousel.Item className="twit-carousel-item">
                <TwitEventDeck/>
            </Carousel.Item>
            <Carousel.Item className="twit-carousel-item">
                <TwitPlayerDeck/>
            </Carousel.Item>
            </Carousel>
        </React.Fragment>
    );
}

export default TwitCarousel;