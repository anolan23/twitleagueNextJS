import React from "react";
import { useRouter } from "next/router";

import scoreStyle from "../sass/components/Score.module.scss";
import Avatar from "./Avatar";

function Score({ event }) {
  const router = useRouter();

  return (
    <div
      className={scoreStyle["score"]}
      onClick={() => router.push(`/events/${event.id}`)}
    >
      <div className={scoreStyle["score__group"]}>
        <div className={scoreStyle["score__row"]}>
          <Avatar
            className={scoreStyle["score__row__avatar"]}
            src={event.home_team.avatar}
          />
          <span className={scoreStyle["score__row__teamname"]}>
            {event.home_team.team_name}
          </span>
          <span className={scoreStyle["score__row__points"]}>
            {event.home_team_points}
          </span>
        </div>
        <div className={scoreStyle["score__row"]}>
          <Avatar
            className={scoreStyle["score__row__avatar"]}
            src={event.away_team.avatar}
          />
          <span className={scoreStyle["score__row__teamname"]}>
            {event.away_team.team_name}
          </span>
          <span className={scoreStyle["score__row__points"]}>
            {event.away_team_points}
          </span>
        </div>
      </div>
      <div className={scoreStyle["score__play-period"]}>
        {event.play_period}
      </div>
    </div>
  );
}

export default Score;
