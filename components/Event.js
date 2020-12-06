import React from "react";
import {connect} from "react-redux";

import event from "../sass/components/Event.module.scss";
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
            <div className={event["event"]} key={props.key}>
                <div className={event["event__date"]}>
                    <span className={event["event__date--day"]}>{day}</span>
                    <span className={event["event__date--month"]}>{months[month]}</span>
                </div>
                <div className={event["event__info"]}>
                    <span className={event["event__type"]}>{props.eventType}</span>
                    <span className={event["event__time"]}>{props.time}</span>
                    <span className={event["event__location"]}>{props.location}</span>
                    {props.eventType === "Game" ? <Matchup homeTeam={props.isHomeTeam ? props.team : props.opponent} awayTeam={props.isHomeTeam ? props.opponent : props.team}/> : null}
                </div>
            </div>
    );
}

const mapStateToProps = (state) => {
    return {team: state.team}
}

export default connect(mapStateToProps)(Event);