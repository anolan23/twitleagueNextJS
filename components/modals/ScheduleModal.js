import React from "react";
import {connect} from "react-redux";

import {toggleScheduleModal} from "../../actions";
import TwitModal from "./TwitModal";
import Event from "../Event";

function ScheduleModal(props) {

    const renderBody = () => {
        return props.events.map((event, index) => {
            return (
                <Event 
                    key={index} 
                    eventDate={event.eventDate} 
                    opponent={event.opponent} 
                    eventType={event.eventType}
                    isHomeTeam={event.isHomeTeam}
                    time={event.time}
                    location={event.location}
                />
            );
        })
    }

    return(
        <TwitModal
            show={props.showScheduleModal}
            onHide={props.toggleScheduleModal} 
            title="Schedule"
            body={renderBody()} 
            footer={null}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        showScheduleModal: state.modals.showScheduleModal,
        events: state.team.events ? state.team.events : []
    }
}

export default connect(mapStateToProps, {toggleScheduleModal})(ScheduleModal);