import React from "react";

import event from "../sass/components/Event.module.scss";
import Avatar from "./Avatar";

function Event(props) {

    return(
            <div className={event["event"]}>
                <div className={event["event__date"]}>
                    <span className={event["event__date--day"]}>{props.event.day}</span>
                    <span className={event["event__date--month"]}>{props.event.month}</span>
                </div>
                <div className={event["event__matchup"]}>
                    <div className={event["event__matchup__team"]}>
                        <Avatar className={event["event__matchup__team__avatar"]} src={props.event.avatar}/>
                        <span className={event["event__matchup__team__team-name"]}>{props.event.team_name}</span>
                    </div>
                    <div className={event["event__info"]}>
                        <span className={event["event__type"]}>{props.event.type}</span>
                        <span className={event["event__matchup__vs"]}>vs</span>
                        <span className={event["event__time"]}>{props.event.time}</span>
                        <span className={event["event__location"]}>{props.event.location}</span>
                    </div>
                    <div className={event["event__matchup__team"]}>
                        <Avatar className={event["event__matchup__team__avatar"]} src={props.event.opponent_avatar}/>
                        <span className={event["event__matchup__team__team-name"]}>{props.event.opponent_team_name}</span>
                    </div>
                </div>
                <div className={event["event__icons"]}>
                  <div className={event["event__icons__holder"]}>
                    <svg className={event["event__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-message-square"/>
                    </svg>
                    <span className={event["event__icons__count"]}>{props.event.replies > 0 ? props.event.replies : null}</span>
                  </div>
                  <div onClick={null} className={`${event["event__icons__holder"]} ${props.event.liked?event["event__icons__holder__active"]: null}`}>
                    <svg className={event["event__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-heart"/>
                    </svg>
                    <span className={event["event__icons__count"]}>{props.event.likes > 0 ? props.event.likes : null}</span>
                  </div>
                  <div className={event["event__icons__holder"]}>
                    <svg onClick={null} className={event["event__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                    </svg>
                  </div>
            </div>
              

                
            </div>
    );
}

export default Event;