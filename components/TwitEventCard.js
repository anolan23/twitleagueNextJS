import React from "react";
import {connect} from "react-redux";

import "../styles/TwitCard.css";
import Avatar from "./Avatar";

function TwitEventCard(props){

    const events = props.events;
    const releventEvents = events.filter(event => event.eventDate === props.date.ISOdate);

    const renderEvent = () => {
        console.log("releventEvents", releventEvents);
        if(releventEvents.length === 0){
            return <span className="twit-subtitle">No event</span>
        }
        else{
            return (
                <div className="matchup">
                    <span>{releventEvents[0].time}</span>
                    <span className="twit-subtitle">at</span>
                    <div className="profile">
                        <Avatar style={{width:"100%"}}/>
                        <span>{releventEvents[0].opponent}</span>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="twit-card">
            <div className="twit-card-body">
                <div className="twit-title">{props.date.day}</div>
                <div className="mb-2 text-muted twit-subtitle">{`${props.date.month+1}/${props.date.date}`}</div>
                <div className="twit-card-text">
                {renderEvent()}
                </div>
                {/* <a href="/" className="twit-card-link">View Details</a> */}
            </div>  
        </div>
    );
}

const mapStateToProps = (state) => {
    return {events: state.team.events}
}

export default connect(mapStateToProps)(TwitEventCard);