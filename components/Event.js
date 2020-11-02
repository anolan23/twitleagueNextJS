import React from "react";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";

import styles from "../styles/Event.module.css";
import Matchup from "./Matchup";

function Event(props) {

    const day = props.eventDate.substring(8);
    const month = props.eventDate.substring(5,7);
    const months = [];
    months[1] = "jan";
    months[2] = "feb";
    months[3] = "mar";
    months[4] = "apr";
    months[5] = "may";
    months[6] = "jun";
    months[7] = "jul";
    months[8] = "aug";
    months[9] = "sep";
    months[10] = "oct";
    months[11] = "nov";
    months[12] = "dec";

    return(
        <Card body>
            <div className="event">
                <div className="event-date">
                    <span className="day block-span">{day}</span>
                    <span className="month block-span">{months[month]}</span>
                </div>
                <div className="event-info">
                    <span className="event-type">{props.eventType}</span>
                    {props.eventType === "Game" ? <Matchup homeTeam={props.isHomeTeam ? props.team : props.opponent} awayTeam={props.isHomeTeam ? props.opponent : props.team}/> : null}
                    <span className="muted block-span">{props.time}</span>
                    <span className="muted twit-small-text block-span">{props.location}</span>
                </div>
            </div>
            
        </Card>
    );
}

const mapStateToProps = (state) => {
    return {team: state.team}
}

export default connect(mapStateToProps)(Event);