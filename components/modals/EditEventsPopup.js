import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleEditEventsPopup, findEventsByTeamId, createEvent} from "../../actions";
import backend from "../../lib/backend";
import editEventsPopup from "../../sass/components/EditEventsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import TwitDropdownItem from "../TwitDropdownItem";
import Empty from "../Empty";
import Event from "../Event";
import TwitHelpers from "../../lib/twit-helpers";

function EditEventsPopup(props){

    const [step, setStep] = useState("events")
    const [events, setEvents] = useState(null);
    const [opponents, setOpponents] = useState(null);
    const [matchup, setMatchup] = useState(null);

    useEffect(() => {
        start();
    }, [props.showEditEventsPopup]);

    const start = async () => {
        const opponents = await getOpponents();
        setOpponents(opponents);
        formik.setFieldValue("opponent", opponents[0] ? opponents[0].id : "");
        let date = new Date();
        const day = date.getDate();
        let month = date.getMonth();
        month = TwitHelpers.monthIndexToName(month);
        let time = date.toISOString().split(11,-1);
        setMatchup({
            team_name: props.team.team_name,
            avatar: props.team.avatar,
            type: "game",
            eventDate: "date",
            time: "time",
            opponent_team_name: opponents[0] ? opponents[0].team_name : "",
            opponent_avatar: opponents[0] ? opponents[0].avatar : "",
            day,
            month,
            time
        });
        
    }

    const getOpponents = async () => {
        const opponents = await backend.get(`/api/leagues/${props.team.league_name}/teams`);
        console.log(props.team.league_name)

        return opponents.data.filter(opponent => opponent.id !== props.team.id);
    }
        
    const formik = useFormik({
        initialValues: {
            type: "game",
            opponent: null,
            location: null,
            eventDate: null,
            notes: null,
            isHomeTeam: null
        },
        onSubmit: values => { 
            console.log(values)
            const event = {...values, teamId: props.teamId}
            createEvent(event);
          }
    });

    const fetchEvents = async () => {
        const events = await findEventsByTeamId(props.teamId);
        setEvents(events);
    }

    const assembleOpponent = (opponentId) => {
        let event = formik.values;
        const opponent = opponents.find(opponent => opponent.id == opponentId);
        console.log(opponent);
        event = {
            ...matchup, 
            opponent_team_name: opponent.team_name,
            opponent_avatar: opponent.avatar
        }
        setMatchup(event);
    }

    const onOpponentChange = (event) => {
        formik.setFieldValue("opponent", event.target.value)
        assembleOpponent(event.target.value);
    }

    const onDateTimeChange = (event) => {
        formik.handleChange(event)
        let date = new Date(event.target.value);
        const day = date.getDate();
        let month = date.getMonth();
        month = TwitHelpers.monthIndexToName(month);
        let time = date.toISOString().split(11,-1);
        setMatchup({...matchup, day, month, time})

    }

    const onCheckboxChange = (event) => {
        formik.handleChange(event);
        console.log(event.target.checked)
        setMatchup({...matchup, isHomeTeam: event.target.checked});
    }

    const onChange = (event) => {
        formik.handleChange(event);
        setMatchup({...matchup, [event.target.name]: event.target.value});
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
                    <h1 className={editEventsPopup["edit-events-popup__heading__title"]}>Scheduled events</h1>
                    <TwitButton onClick={() => setStep("create")} color="twit-button--primary">New event</TwitButton>
                </div>
            )
        }
        else{
            return (
                <div className={editEventsPopup["edit-events-popup__heading"]}>
                    <h1 className={editEventsPopup["edit-events-popup__heading__title"]}>Create event</h1>
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
                <React.Fragment>
                    <TwitInputGroup labelText="Opponent">
                        <TwitInput
                            select
                            id="opponent"
                            onChange={onOpponentChange}
                            onBlur={formik.handleBlur} 
                            value={formik.values.opponent} 
                            name="opponent" 
                            type="text" 
                        >
                            {renderOpponentOptions()}
                        </TwitInput> 
                    </TwitInputGroup>
                    <TwitInputGroup labelText="Are you the home team?">
                        <TwitInput
                            id="isHomeTeam"
                            onChange={onCheckboxChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.isHomeTeam} 
                            name="isHomeTeam" 
                            type="checkbox" 
                        />   
                    </TwitInputGroup>
                </React.Fragment>
            );
        }
        else{
            return;
        }
    }

    const renderContent = () => {
        if(step === "events"){
            if(events === null){
                return <div>Loading...</div>
            }
            else if( events.length === 0){
                return <Empty main="No events" sub="The team has no scheduled events"/>
            }
            else{
                return events.map((event, index) => {
                    return <Event key={index} event={event}/>
                })
            }
        }
        else if(step === "create"){
            return(
                <form id="add-event-form" onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
                    <Event event={matchup}/>
                    <TwitInputGroup labelText="Event type">
                        <TwitInput
                            select
                            id="type"
                            onChange={onChange} 
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
                            onChange={onDateTimeChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.eventDate} 
                            name="eventDate" 
                            type="datetime-local" 
                        />   
                    </TwitInputGroup>
                    <TwitInputGroup labelText="Location">
                        <TwitInput
                            id="location"
                            onChange={onChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.location} 
                            name="location" 
                            type="text" 
                        />   
                    </TwitInputGroup>
                    <TwitInputGroup labelText="Notes">
                        <TwitInput
                            id="notes"
                            onChange={onChange} 
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

    // console.log(formik.values.isHomeTeam)
    // console.log("matchup", matchup.isHomeTeam)

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
        team: state.team
    }
}

export default connect(mapStateToProps, {toggleEditEventsPopup})(EditEventsPopup);