import React from 'react';
import {connect} from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Link from "next/link";

import {logOutUser, toggleSignUpModal, toggleLoginModal} from "../actions";
import AutoCompleteForm from "./modals/AutoCompleteForm";
import Avatar from "./Avatar";
import styles from "../styles/Heading.module.css"

function Heading(props) {

  const renderButtons = () => { 
    if(props.user.isSignedIn){
      return (
        <div className={styles["heading-buttons"]}>
          <i className={`fas fa-envelope ${styles["heading-button"]}`}></i>
          <Link href="/notifications"><i className={`fas fa-bell ${styles["heading-button"]}`}></i></Link>
          <Avatar roundedCircle className={styles["heading-button"]} style={{width:"40px"}}/>
          <Button variant="primary" onClick={props.logOutUser}>Log Out</Button>
        </div>
        

      )
    }
    else{
      return(
        <div className={styles["heading-buttons"]}>
          <Button variant="outline-primary" onClick={props.toggleLoginModal}>Log In</Button>
          <Button onClick={props.toggleSignUpModal}>Sign Up</Button>
        </div>
      );
    }
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>TwitLeague</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
          <AutoCompleteForm inline placeHolder="$Team or @Username">
            <Button variant="outline-success">Search</Button>
          </AutoCompleteForm>
        {renderButtons()}
      </Navbar.Collapse>
</Navbar>
  );
}

const mapStateToProps = state => {
  return {user: state.user}
}

export default connect(mapStateToProps, {logOutUser, toggleSignUpModal, toggleLoginModal})(Heading);
