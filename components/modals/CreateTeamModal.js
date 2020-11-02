import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import {useFormik} from "formik";
import * as Yup from "yup";

import TwitFormModal from "./TwitFormModal";
import AutoCompleteInput from "./AutoCompleteInput";
import {toggleCreateTeamModal, createTeamAndFetchUser} from "../../actions";
import styles from "../../styles/CreateTeamModal.module.css"

function CreateTeamModal(props){
    
  
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => 
    {
    setShow(false);
    })
  }, [])
  

  const validationSchema = Yup.object({
      teamName: Yup.string().required("Required").min(3).max(30),
      teamAbbrev: Yup.string().required("Required").max(6),
      league: Yup.string().required("Required"),
      sport: Yup.string().required("Reqiured")
  });

  const validate = values => {
    let errors ={};
    // return backend.get("/leaguesearch", {
    //       params: {league: values.league}
    //   }).then((response) => {
    //     setOptions(response.data.leagues);
    //     if(!response.data.activeLeague){
    //       errors.league = "You must join an active league";
    //     }
  
    //     return errors;
    //   });
    
}

  const formik = useFormik({
      initialValues: {
        teamName:"",
        teamAbbrev:"",
        league:"",
        sport:"Baseball"
        },
      onSubmit: values => { 
        const formData = {
          teamName: values.teamName,
          teamAbbrev: "$"+values.teamAbbrev,
          league: values.league,
          sport: values.sport
        }
        props.createTeamAndFetchUser(formData);
      },
      validationSchema,
      validate
  });

  const onAutoCompleteChange = (event) => {
    formik.handleChange(event);
    if(event.target.value){
      setShow(true);
    }
    else{
      setShow(false);
    }
    
  }

  const renderOptions = () => {
      return options.map(option => {
          return (
                  <Dropdown.Item onClick={() => {formik.setFieldValue("league", option.leagueName); setShow(false);}} key={option._id}>{option.leagueName}</Dropdown.Item>
          );
      });
  }  
  
  
  function renderForm(){
        return (
          <React.Fragment>
            <Form.Group>
              <Form.Label>Team Name</Form.Label>
              <Form.Control 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.teamName} 
                name="teamName" 
                type="text" 
                autoComplete="off" 
                isValid={formik.touched.teamName && !formik.errors.teamName}  
                />
              {formik.errors.teamName && formik.touched.teamName ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.teamName}</Form.Control.Feedback> : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Team Abbreviation</Form.Label>
              <Form.Control 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.teamAbbrev} 
              name="teamAbbrev" 
              type="text" 
              placeholder="example - LIONS" 
              autoComplete="off" 
              isValid={formik.touched.teamAbbrev && !formik.errors.teamAbbrev} 
              />
              {formik.errors.teamAbbrev && formik.touched.teamAbbrev ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.teamAbbrev}</Form.Control.Feedback> : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>League</Form.Label>
              <AutoCompleteInput 
                name="league" 
                type="text" 
                placeholder="example - National Football League" 
                autoComplete="off"
                onChange={onAutoCompleteChange}
                onBlur={formik.handleBlur}
                value={formik.values.league}
                show={show}
                header="Active Leagues"
                options={renderOptions()}
                className="mr-sm-2"
                isValid={formik.touched.league && !formik.errors.league}
               />
               {formik.errors.league && formik.touched.league ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.league}</Form.Control.Feedback> : null}
            </Form.Group>
            <Form.Group controlId="sport">
              <Form.Label>Sport</Form.Label>
              <Form.Control 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.sport} 
                as="select"
                isValid={formik.touched.sport && !formik.errors.sport} 
              >
                <option>Baseball</option>
                <option>Basketball</option>
                <option>Football</option>
                <option>Soccer</option>
              </Form.Control>
              {formik.errors.sport && formik.touched.sport ? <Form.Control.Feedback className="invalid-feedback" type="invalid">{formik.errors.sport}</Form.Control.Feedback> : null}
            </Form.Group>
          </React.Fragment>
        );
      }
    
      function renderActions(){
        return(
          <React.Fragment>
            <Button variant="secondary" onClick={props.toggleCreateTeamModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </React.Fragment>
      
        );
      }  

    return (
        <TwitFormModal
            show={props.showCreateTeamModal}  
            close={props.toggleCreateTeamModal} 
            onSubmit={formik.handleSubmit}
            title="Create a Team"
            form={renderForm()}
            actions={renderActions()}

        />
    );
}

const mapStateToProps = (state) => {
    return {showCreateTeamModal: state.modals.showCreateTeamModal}
}

export default connect(mapStateToProps, {toggleCreateTeamModal, createTeamAndFetchUser})(CreateTeamModal);