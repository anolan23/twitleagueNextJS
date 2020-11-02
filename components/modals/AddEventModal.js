import React, {useState} from "react";
import {connect} from "react-redux";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useFormik} from "formik";

import TwitFormModal from "./TwitFormModal";
import {toggleAddEventModal, addTeamEventAndFetchTeam} from "../../actions";
import Matchup from "../Matchup";

function AddEventModal(props) {

    const formik = useFormik({
        initialValues: {
            eventType: "Game",
            isHomeTeam: false,
            opponent: props.opponents[0] ? props.opponents[0].teamAbbrev : "",
            location: "",
            eventDate: "",
            time: "",
            notes: ""
        },
        onSubmit: (values) => {
            console.log(values);
            props.addTeamEventAndFetchTeam(values);
        },
        enableReinitialize: true
    });

    const opponent = props.opponents.find(opponent => opponent.teamAbbrev === formik.values.opponent);

    const renderOptions = () => {
        return props.opponents.map((opponent, index) => {
            return <option key={index}>{opponent.teamAbbrev}</option>  
        } )
    }
    
    const renderForm = () => {

        return (
            <React.Fragment>
                <Matchup homeTeam={formik.values.isHomeTeam ? props.team : opponent} awayTeam={formik.values.isHomeTeam ? opponent : props.team}/>
                <Form.Group controlId="eventType">
                    <Form.Label>
                    Event Type
                    </Form.Label>
                    <Form.Control name="eventType" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.eventType} as="select" placeholder="Event Type">
                        <option>Game</option>
                        <option>Practice</option>
                        <option>Meeting</option>
                        <option>Workout</option>
                        <option>Party</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="homeTeam">
                    <Form.Check name="isHomeTeam" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.isHomeTeam} type="checkbox" label="Are you the home team?" />
                </Form.Group>
                <Form.Group controlId="opponent">
                    <Form.Label>
                    Opponent
                    </Form.Label>
                    <Form.Control name="opponent" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.opponent} as="select" placeholder="Opponent">
                        {renderOptions()}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="location">
                    <Form.Label>
                    Location
                    </Form.Label>
                    <Form.Control name="location" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.location} type="location" placeholder="Choose location" />
                </Form.Group>
                <Form.Group controlId="date">
                    <Form.Label column sm={2}>
                    Event Date
                    </Form.Label>
                    <Form.Control name="eventDate" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.eventDate} type="date" placeholder="Enter date" />             
                </Form.Group>
                <Form.Group controlId="time">
                    <Form.Label column sm={2}>
                    Time
                    </Form.Label>
                    <Form.Control name="time" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.time} type="time" placeholder="Start time" />
                </Form.Group>
                <Form.Group controlId="notes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control name="notes" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.notes} as="textarea" rows="3" />
                </Form.Group>
            </React.Fragment>
            
        );
    }


    const renderActions = () => {
        return(
            <React.Fragment>
                <Button variant="secondary" onClick={props.toggleAddEventModal}>
                Close
                </Button>
                <Button variant="primary" type="submit">
                Add
                </Button>
          </React.Fragment>
        );
    }
    
    return (
        <TwitFormModal 
            show={props.showAddEventModal} 
            onHide={props.toggleAddEventModal}
            title="Event"
            form={renderForm()}
            actions={renderActions()}
            onSubmit={formik.handleSubmit} 
        />
    );
}

const mapStateToProps = (state) => {
    return {
        showAddEventModal: state.modals.showAddEventModal,
        team: state.team,
        opponents: state.team.opponents ? state.team.opponents : []
    }
}

export default connect(mapStateToProps, {toggleAddEventModal, addTeamEventAndFetchTeam})(AddEventModal);