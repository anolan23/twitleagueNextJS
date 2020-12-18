import React from 'react';
import {connect} from "react-redux";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useFormik} from "formik";
import * as Yup from "yup";

import {createUser, toggleSignUpModal} from "../../actions";
import TwitFormModal from "./TwitFormModal";

 function SignUp(props) {

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string()
      .min(4, "Username must be at least four characters")
      .max(20, "Username must be 20 characters or less")
      .required("Required"),
    password: Yup.string()
      .required('You must provide a password') 
      .min(8, 'Password must be at least eight characters')
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: ""
    },
    onSubmit: (values) => {
      props.createUser(values);
    },
    validationSchema: SignupSchema
  });


  function renderForm(){
    return (
      <React.Fragment>
       <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                name="name" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.name}
                isValid={formik.values.name && !formik.errors.name} 
                isInvalid={formik.touched.name && formik.errors.name}
                type="text" 
                placeholder="name" 
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name && formik.touched.name ? formik.errors.name : null}
              </Form.Control.Feedback>
            </Form.Group>
        
        <br />
        <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                name="email" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.email} 
                isValid={formik.touched.email && !formik.errors.email} 
                isInvalid={formik.touched.email && formik.errors.email}
                type="email" 
                placeholder="Email"
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email && formik.touched.email ? formik.errors.email : null}
              </Form.Control.Feedback>
            </Form.Group>
        <br />
        <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                name="username" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.username} 
                isValid={formik.touched.username && !formik.errors.username} 
                isInvalid={formik.touched.username && formik.errors.username}
                type="text" 
                placeholder="Username"
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username && formik.touched.username ? formik.errors.username : null}
              </Form.Control.Feedback>
            </Form.Group>
        <br />
        <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                name="password" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.password}
                isValid={formik.touched.password && !formik.errors.password} 
                isInvalid={formik.touched.password && formik.errors.password} 
                type="password" 
                placeholder="Password" 
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password && formik.touched.password ? formik.errors.password : null}
              </Form.Control.Feedback>
            </Form.Group>
      </React.Fragment>
    );
  }

  function renderActions(){
    return(
      <React.Fragment>
        <Button variant="secondary" onClick={props.toggleSignUpModal}>
          Close
        </Button>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </React.Fragment>
  
    );
  }

    return (
      <TwitFormModal 
        show={props.showSignUpModal}  
        onHide={props.toggleSignUpModal} 
        onSubmit={formik.handleSubmit}
        title="Join Twitleague"
        form={renderForm()}
        actions={renderActions()}
        />
    );
  }

  const mapStateToProps = (state) => {
    return {showSignUpModal: state.modals.showSignUpModal}
  }
  
export default connect(mapStateToProps, {createUser, toggleSignUpModal})(SignUp);