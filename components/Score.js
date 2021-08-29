import React from "react";
import { useRouter } from "next/router";

import scoreStyle from "../sass/components/Score.module.scss";
import Avatar from "./Avatar";

function Score({ event }) {
  const router = useRouter();
  const {
    id,
    home_team,
    away_team,
    home_team_points,
    away_team_points,
    play_period,
  } = event;

  return (
    <div
      className={scoreStyle["score"]}
      onClick={() => router.push(`/events/${id}`)}
    >
      <div className={scoreStyle["score__group"]}>
        <div className={scoreStyle["score__row"]}>
          <Avatar
            className={scoreStyle["score__row__avatar"]}
            src={home_team.avatar}
          />
          <span className={scoreStyle["score__row__teamname"]}>
            {home_team.team_name}
          </span>
          <span className={scoreStyle["score__row__points"]}>
            {home_team_points ?? "-"}
          </span>
        </div>
        <div className={scoreStyle["score__row"]}>
          <Avatar
            className={scoreStyle["score__row__avatar"]}
            src={away_team.avatar}
          />
          <span className={scoreStyle["score__row__teamname"]}>
            {away_team.team_name}
          </span>
          <span className={scoreStyle["score__row__points"]}>
            {away_team_points ?? "-"}
          </span>
        </div>
      </div>
      <div className={scoreStyle["score__play-period"]}>{play_period}</div>
    </div>
  );
}

export default Score;
