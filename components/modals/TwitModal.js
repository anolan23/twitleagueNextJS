import React from "react";
import Modal from 'react-bootstrap/Modal';

function TwitModal(props){
    
    return (
        <Modal show={props.show} animation={false} dialogClassName="twit-post-modal" onHide={props.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
              <div>
                {props.title}
              </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.body}
        </Modal.Body>
        <Modal.Footer>
            {props.footer}
        </Modal.Footer>
        
      </Modal>
    );
}

export default TwitModal;