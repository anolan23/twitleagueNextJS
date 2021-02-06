import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleEditEventsPopup} from "../../actions";
import backend from "../../lib/backend";
import editEventsPopup from "../../sass/components/EditEventsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import TwitDropdownItem from "../TwitDropdownItem";

function EditEventsPopup(props){

    const [step, setStep] = useState("events")
    const [events, setEvents] = useState(null);
    const [opponents, setOpponents] = useState(null);

    useEffect(() => {
        console.log("useEffect")
        const getOpponents = async () => {
            const response = await backend.get("/api/teams", {
                params: {
                    leagueId: props.leagueId
                }
            });
            setOpponents(response.data);
        }
        getOpponents();
        
    }, [props.showEditEventsPopup]);
        
    const formik = useFormik({
        initialValues: {
            type: null,
            opponent: null,
            location: null,
            eventDate: null,
            time: null,
            notes: null
        },
        onSubmit: values => { 
            console.log(values)
            createEvent(values);
          }
    });

    const createEvent = async (event) => {
        console.log(props.teamId)
        const response = await backend.post("/api/teams/events", {
                event: {...event, teamId: props.teamId}
        });
    }

    const onChange = (event) => {
        formik.setFieldValue("opponent", event.target.value)
        
        // const search = async () => {
        //     const response = await backend.get("api/search", {
        //         params: {
        //             searchTerm: event.target.value,
        //             category: "users"
        //         }
        //     });

        // setUsers(response.data);
        // }
        // search();
    }

    const renderOpponentOptions = () => {
        if(!opponents){
            return
        }
        else{
            return opponents.map((opponent, index) => {
                return <option key={index} value={opponent.id}>{`${opponent.abbrev} - ${opponent.team_name}`}</option>
            })
        }
    }

    const renderHeading = () => {
        if(step === "events"){
            return (
                <div className={editEventsPopup["edit-events-popup__heading"]}>
                    <TwitButton onClick={() => setStep("create")} color="twit-button--primary">New event</TwitButton>
                </div>
            )
        }
        else{
            return (
                <div className={editEventsPopup["edit-events-popup__heading"]}>
                    <div className={editEventsPopup["edit-events-popup__heading__actions"]}>
                        <TwitButton onClick={() => setStep("events")} color="twit-button--primary">Back</TwitButton>
                        <TwitButton form="add-event-form" color="twit-button--primary">Save</TwitButton>
                    </div>
                </div>
            )
        }
        
    }

    const renderOpponentInput = () => {
        if(formik.values.type === "game"){
            return(
                <TwitInputGroup labelText="Opponent">
                    <TwitInput
                        select
                        id="opponent"
                        onChange={onChange}
                        onBlur={formik.handleBlur} 
                        value={formik.values.opponent} 
                        name="opponent" 
                        type="text" 
                    >
                        {renderOpponentOptions()}
                    </TwitInput> 
                </TwitInputGroup>
            );
        }
        else{
            return;
        }
    }

    const renderContent = () => {
        if(step === "events"){
            return (
                <React.Fragment>
                    <h1>Events</h1>
                </React.Fragment>
            )
        }
        else if(step === "create"){
            return(
                <form id="add-event-form" onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
                    <TwitInputGroup labelText="Event type">
                        <TwitInput
                            select
                            id="type"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.type} 
                            name="type" 
                            type="select" 
                        >   
                            <option value="game">Game</option>
                            <option value="practice">Practice</option>
                            <option value="workout">Workout</option>
                            <option value="meeting">Meeting</option>
                            <option value="party">Party</option>
                        </TwitInput>
                    </TwitInputGroup>
                    {renderOpponentInput()}
                    <TwitInputGroup labelText="Event date">
                        <TwitInput
                            id="eventDate"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.eventDate} 
                            name="eventDate" 
                            type="date" 
                        />   
                    </TwitInputGroup>
                    <TwitInputGroup labelText="Time">
                        <TwitInput
                            id="time"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.time} 
                            name="time" 
                            type="time" 
                        />   
                    </TwitInputGroup>
                    <TwitInputGroup labelText="Location">
                        <TwitInput
                            id="location"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.location} 
                            name="location" 
                            type="text" 
                        />   
                    </TwitInputGroup>
                    <TwitInputGroup labelText="Notes">
                        <TwitInput
                            id="notes"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.notes} 
                            name="notes" 
                            type="text-area" 
                        />   
                    </TwitInputGroup>
                </form>
            )
        }
    }

    const renderBody = () => {
        return (
            <div className={editEventsPopup["edit-events-popup__body"]}>
                {renderContent()}
            </div>
        );
    }


    return(
        <Popup 
            show={props.showEditEventsPopup}
            heading={renderHeading()} 
            body={renderBody()} 
            onHide={props.toggleEditEventsPopup}/>
        
    );
}

const mapStateToProps = (state) => {
    return {
        showEditEventsPopup: state.modals.showEditEventsPopup,
        teamId: state.team.id,
        leagueId: state.team.league_id
    }
}

export default connect(mapStateToProps, {toggleEditEventsPopup})(EditEventsPopup);