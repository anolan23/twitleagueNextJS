import React from "react";

import player from "../sass/components/Player.module.scss";
import Avatar from "./Avatar";
import TwitButtton from "./TwitButton";

function Player(props) {
  return (
    <div className={player["player"]} key={props.key}>
      <Avatar className={player["player__image"]} />
      <div className={player["player__text"]}>
        <div className={player["player__text--main"]}>{props.username}</div>
        <div
          className={player["player__text--sub"] + " muted"}
        >{`@${props.username}`}</div>
      </div>
      <div className={player["player__actions"]}>
        <TwitButtton color="primary" outline="primary">
          Scout
        </TwitButtton>
      </div>
    </div>
  );
}
export default Player;
