import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from "react-bootstrap/Figure"

import LeftColumn from './LeftColumn';


function MainBody({children}) {
  return (
      <div className="twit-container">
        <header className="header">
          <LeftColumn/>
        </header>
        <main>
          {children}
        </main>
        <div className="right-bar">
         
        </div>
    </div>
  );
}

export default MainBody;
