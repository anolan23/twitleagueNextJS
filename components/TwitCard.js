import React from "react";

import twitCard from "../sass/components/TwitCard.module.scss";

function TwitCard(props) {

    return (
        <div className={twitCard["twit-card"]}>
            <div className={twitCard["twit-card__title"] + " heading-2"}>{props.title}</div>
            {props.children}
            <div className={twitCard["twit-card__footer"]}>{props.footer}</div>
        </div>
    );
}

export default TwitCard;
