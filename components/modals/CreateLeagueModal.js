import React from "react";
import {connect} from "react-redux";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useFormik} from "formik";
import * as Yup from "yup";

import TwitFormModal from "./TwitFormModal";
import {toggleCreateLeagueModal, createLeagueAndFetchUser} from "../../actions";
import styles from "../../styles/CreateLeagueModal.module.css"
import backend from "../../lib/backend";

function CreateLeagueModal(props){

  const validationSchema = Yup.object({
    sport: Yup.string().required("Required"),
    numTeams: Yup.string().required("Required")
  })

  const validate = values => {
    let errors ={};
    if(!values.leagueName){
      return errors.leagueName = "Required";
    }
    return backend.get("/api/league/"+values.leagueName)
      .then((response) => {
        if(response.data.leagueName === values.leagueName){
          errors.leagueName = "League Name already taken";
        }
      
        return errors;
      });
    
}

  const formik = useFormik({
    initialValues: {
      sport: "Baseball",
      leagueName: "",
      numTeams: "4"
    },
    onSubmit: values => {
      props.createLeagueAndFetchUser(values);
    },
    validationSchema,
    validate

  })
 
  function renderNumTeams(){
    const arr = [];
    for (let i = 4; i <= 32; i++) {
      arr.push(<option key={i}>{i}</option>);
    }
    return arr;
  } 
  
  
  function renderForm(){
        return (
          <React.Fragment>
             <Form.Group controlId="sport">
              <Form.Label>Sport</Form.Label>
              <Form.Control 
                name="sport" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                value={formik.values.sport} 
                as="select"
                isValid={formik.touched.sport && !formik.errors.sport} 
                autoComplete="off"
                >
                <option>Baseball</option>
                <option>Basketball</option>
                <option>Football</option>
                <option>Soccer</option>
              </Form.Control>
              {formik.errors.sport && formik.touched.sport ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.sport}</Form.Control.Feedback> : null}
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>League Name</Form.Label>
              <Form.Control 
                name="leagueName"
                type="text" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.leagueName}
                isValid={formik.touched.leagueName && !formik.errors.leagueName}
                autoComplete="off"
                />
              {formik.errors.leagueName && formik.touched.leagueName ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.leagueName}</Form.Control.Feedback> : null}
            </Form.Group>
            <br />
            <Form.Group controlId="numTeams">
              <Form.Label>Number of Teams</Form.Label>
              <Form.Control 
                name="numTeams"
                as="select"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.numTeams}
                isValid={formik.touched.numTeams && !formik.errors.numTeams}
                autoComplete="off"
                >
                {renderNumTeams()}
              </Form.Control>
              {formik.errors.numTeams && formik.touched.numTeams ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.numTeams}</Form.Control.Feedback> : null}
            </Form.Group>
          </React.Fragment>
        );
      }
    
      function renderActions(){
        return(
          <React.Fragment>
            <Button variant="secondary" onClick={props.toggleCreateLeagueModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </React.Fragment>
      
        );
      }
      console.log(formik.errors);

    return (
        <TwitFormModal
            show={props.showCreateLeagueModal}  
            close={props.toggleCreateLeagueModal} 
            onSubmit={formik.handleSubmit}
            title="Create a League"
            form={renderForm()}
            actions={renderActions()}

        />
    );
}

const mapStateToProps = (state) => {
    return {showCreateLeagueModal: state.modals.showCreateLeagueModal}
}

export default connect(mapStateToProps, {toggleCreateLeagueModal, createLeagueAndFetchUser})(CreateLeagueModal);