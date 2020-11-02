import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function TwitFormModal(props){
    
    return (
        <Modal show={props.show} animation={false} dialogClassName="twit-modal" onHide={props.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
              <div>
                {props.title}
              </div>
          </Modal.Title>
        </Modal.Header>
        <form noValidate onSubmit={props.onSubmit}>
        <Modal.Body>
            <Form.Group controlId="form">
                {props.form}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            {props.actions}
        </Modal.Footer>
        </form>
      </Modal>
    );
}

export default TwitFormModal;