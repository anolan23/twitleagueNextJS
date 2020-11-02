import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LeftColumn from './LeftColumn';
// import Team from "./Team";
// import League from "./League";
// import Notifications from "./Notifications";
// import Home from "./Home";


function MainBody({children}) {
  return (
      <Container fluid>
        <Row>
          <Col sm={3}>
              <LeftColumn></LeftColumn>
          </Col>
          <Col lg={6} sm={9}>
              {children}
          </Col>
          <Col sm={3} className="right-column">
          sm=3
          </Col>
        </Row>
    </Container>
  );
}

export default MainBody;
