import React from "react";

import twitCard from "../sass/components/TwitCard.module.scss";

function TwitCard({ title, footer, children, color }) {
  const calcColor = () => {
    switch (color) {
      case "clear":
        return twitCard["twit-card--clear"];

      default:
        return null;
    }
  };
  return (
    <div className={`${twitCard["twit-card"]} ${calcColor()}`}>
      <div className={twitCard["twit-card__title"]}>{title}</div>
      {children}
      <div className={twitCard["twit-card__footer"]}>{footer}</div>
    </div>
  );
}

export default TwitCard;
