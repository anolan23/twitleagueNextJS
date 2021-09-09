import React from "react";
import { useRouter } from "next/router";

import style from "../sass/components/ScheduleEvent.module.scss";
import TwitDate from "../lib/twit-date";
import Avatar from "./Avatar";

function ScheduleEvent({ event, seasonTeamId }) {
  const router = useRouter();
  const { id, date, home_team, away_team, home_team_points, away_team_points } =
    event;
  const isHomeTeam = home_team.id == seasonTeamId;

  function onClick() {
    router.push(`/events/${id}`);
  }

  function renderOpponent() {
    return (
      <td className={style["schedule-event__opponent"]}>
        {isHomeTeam ? "vs" : "@"}
        <Avatar
          src={isHomeTeam ? away_team.avatar : home_team.avatar}
          className={style["schedule-event__opponent__avatar"]}
        />
        <div className={style["schedule-event__opponent__teamname"]}>
          {isHomeTeam ? away_team.team_name : home_team.team_name}
        </div>
      </td>
    );
  }

  return (
    <tr className={style["schedule-event"]} onClick={onClick}>
      <td className={style["schedule-event__date"]}>
        {TwitDate.localeDateStringShort(date)}
      </td>
      {renderOpponent()}
      <td className={style["schedule-event__score"]}>
        {isHomeTeam
          ? `${home_team_points} - ${away_team_points}`
          : `${away_team_points} - ${home_team_points}`}
      </td>
    </tr>
  );
}

export default ScheduleEvent;
