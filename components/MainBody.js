import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Figure from "react-bootstrap/Figure"

import LeftColumn from './LeftColumn';


function MainBody({children}) {
  return (
      <Container fluid>
        <Row>
          <Col sm={3}>
              <LeftColumn/>
          </Col>
          <Col lg={6} sm={9}>
              {children}
          </Col>
          <Col sm={3} className="right-column">
          <Figure>
            <Figure.Image
              width={"100%"}
              height={"auto"}
              alt="171x180"
              src="https://via.placeholder.com/600"
            />
            <Figure.Caption>
              Advertisement
            </Figure.Caption>
          </Figure>
          <Figure>
            <Figure.Image
              width={"100%"}
              height={"auto"}
              alt="171x180"
              src="https://via.placeholder.com/600"
            />
            <Figure.Caption>
              Advertisement
            </Figure.Caption>
          </Figure>
          </Col>
        </Row>
    </Container>
  );
}

export default MainBody;
