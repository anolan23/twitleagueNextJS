import React from "react";
import { Gif } from "@giphy/react-components";
import twitGif from "../sass/components/TwitGif.module.scss";
import { closeMedia } from "../actions";

function TwitGif({ gif }) {
  return (
    <div className={twitGif["twit-gif"]}>
      <div onClick={closeMedia} className={twitGif["twit-gif__close"]}>
        <svg className={twitGif["twit-gif__icon"]}>
          <use xlinkHref="/sprites.svg#icon-x" />
        </svg>
      </div>
      <Gif gif={gif} width="100%" />
    </div>
  );
}

export default TwitGif;
