import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleEditEventsPopup} from "../../actions";
import backend from "../../lib/backend";
import editEventsPopup from "../../sass/components/EditEventsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import InputGroup from "../InputGroup";

function EditEventsPopup(props){

    const [step, setStep] = useState("events")
    const [events, setEvents] = useState(null);

    // useEffect(() => {
    //     console.log("render")
    //     const getEvents = async () => {
    //         const response = await backend.get("api/teams/events", {
    //             params: {
    //                 teamId: props.teamId
    //             }
    //         });
    //         setEvents(response.data);
    //     }
    //     getEvents();
        
    // }, [props.teamId]);
        
    const formik = useFormik({
        initialValues: {
            eventType: "game",
            isHomeTeam: false,
            opponent: "",
            location: "",
            eventDate: "",
            time: "",
            notes: ""
        },
    });

    const onChange = (event) => {
        formik.handleChange(event);
        
        const search = async () => {
            const response = await backend.get("api/search", {
                params: {
                    searchTerm: event.target.value,
                    category: "users"
                }
            });

        setUsers(response.data);
        }
        search();
    }

    const renderHeading = () => {
        return (
            <div className={editEventsPopup["edit-events-popup__heading"]}>
                <TwitButton onClick={() => setStep("create")} color="twit-button--primary">New event</TwitButton>
            </div>
        )
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
                    <InputGroup
                        labelText="Event Type"
                        id="eventType"
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                        value={formik.values.eventType} 
                        name="eventType" 
                        type="text" 
                        className={twitForm["twit-form__input"]}
                    />
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
        teamId: state.team.id
    }
}

export default connect(mapStateToProps, {toggleEditEventsPopup})(EditEventsPopup);