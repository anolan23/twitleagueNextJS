import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from "react-bootstrap/Figure"
import Image from "next/image";

import LeftColumn from './LeftColumn';


function MainBody({children}) {
  return (
      <div className="twit-container">
        <header className="header">
          <LeftColumn/>
        </header>
        <div className="top-bar">
          <div className="top-bar__box">
            <svg className="top-bar__icon">
                <use xlinkHref="/sprites.svg#icon-arrow-left"/>
            </svg>
            <div className="top-bar__text">
              <div className="top-bar__text-main heading-1">White Sox</div>
              <div className="heading-3 muted">12.1k Tweets</div>
            </div>
          </div>
        </div>
        <main className="main">
          {children}
        </main>
        <div className="right-bar">
         Right Bar
        </div>
    </div>
  );
}

export default MainBody;
