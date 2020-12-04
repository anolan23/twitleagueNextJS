import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from "react-bootstrap/Figure"
import Image from "next/image";

import LeftColumn from './LeftColumn';
import RightColumn from "./RightColumn";


function MainBody({children}) {
  return (
      <div className="twit-container">
        <header className="header">
          <LeftColumn/>
        </header>
        <main className="main">
          {children}
        </main>
        <div className="right-bar">
         <RightColumn/>
        </div>
    </div>
  );
}

export default MainBody;
