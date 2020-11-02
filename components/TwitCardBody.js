import React from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function TwitCardBody(props){
    return (
        <React.Fragment>
            {props.category ? null : <Card.Title>{props.title}</Card.Title>}
            <Button variant="primary" onClick={props.onClick}>{props.buttonText}</Button>
            <ListGroup variant="flush">
                {props.content}
            </ListGroup>
        </React.Fragment>
        
    );
}

export default TwitCardBody;