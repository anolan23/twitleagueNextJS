import React from "react";
import {useRouter} from "next/router";

import event from "../sass/components/Event.module.scss";

function Event(props) {
  const router = useRouter();

  const renderTeams = () => {
    if(props.event.type === "game"){
      return(
        <div className={event["event__wrap"]}>
          <div className={event["event__teams"]}>
            <div className={event["event__teams__team"]} style={{backgroundImage: `url(${props.event.avatar})`}}>

            </div>
            <div className={event["event__teams__team"]} style={{backgroundImage: `url(${props.event.opponent_avatar})`}} >

            </div>
          </div>
        </div>
      )
    }
    else{
      return null;
    }
  }

  const renderTeamNames = () => {
    if(props.event.isHomeTeam == true || props.event.is_home_team == true){
      return <span className={event["event__matchup__vs"]}>{`${props.event.team_name} vs ${props.event.opponent_team_name}`}</span>
    }
    else{
      return <span className={event["event__matchup__vs"]}>{`${props.event.team_name} @ ${props.event.opponent_team_name}`}</span>
    }
  }

  return(
          <div onClick={() => router.push(`/events/${props.event.id}`).then(() => window.scrollTo(0, 0))} className={event["event"]}>
            {renderTeams()}
            <div className={event["event__date"]}>
                <span className={event["event__date--day"]}>{props.event.day}</span>
                <span className={event["event__date--month"]}>{props.event.month}</span>
            </div>
            <div className={event["event__matchup"]}>
              <div className={event["event__info"]}>
                    <span className={event["event__type"]}>{props.event.type}</span>
                    {renderTeamNames()}
                    <span className={event["event__time"]}>{props.event.time}</span>
                    <span className={event["event__location"]}>{props.event.location}</span>
              </div>
            </div> 
          </div>
  );
}

export default Event;