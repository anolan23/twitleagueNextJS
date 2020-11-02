import React from 'react';
import {connect} from "react-redux";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {loginUser, toggleLoginModal} from "../../actions";
import TwitFormModal from "./TwitFormModal";

 class Login extends React.Component{

    onSubmit = (event) => {
      event.preventDefault();
      const elements = event.target.elements;
      const formData = {
        username:elements.username.value,
        password:elements.password.value
      }
      this.props.loginUser(formData);

    }

    renderForm(){
      return (
        <Form.Group controlId="form">
          <Form.Control name="username" type="text" placeholder="Username" />
          <br />
          <Form.Control name="password" type="password" placeholder="Password" />
      </Form.Group>
      );
    }

    renderActions(){
      return (
        <React.Fragment>
          <Button variant="secondary" onClick={this.props.toggleLoginModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Log In
          </Button>
        </React.Fragment>
      );
    }

    render(){
      return (
        <TwitFormModal
          show={this.props.showLoginModal}
          close={this.props.toggleLoginModal}
          onSubmit={this.onSubmit}
          title="Log In"
          form={this.renderForm()}
          actions={this.renderActions()}
        />
      );
  }

}

const mapStateToProps = (state) => {
  return {showLoginModal: state.modals.showLoginModal}
}

export default connect(mapStateToProps,{loginUser, toggleLoginModal})(Login);