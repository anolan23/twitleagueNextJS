import React from "react";

import twitCard from "../sass/components/TwitCard.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitCardItem(props) {

    return (
        <div className={twitCard["twit-card__item"]}>
            <Avatar roundedCircle className={twitCard["twit-card__item__image"]}/>
            <div className={twitCard["twit-card__item__text-box"]}>
                <div className={twitCard["twitcard__item__text--main"] + " heading-3"}>{props.mainText}</div>
                <div className={twitCard["twit-card__item__text--sub"] + " muted"}>{props.subText}</div>
            </div>
            <div className={twitCard["twit-card__item__action"]}>
                <TwitButton color="twit-button--primary">Scout</TwitButton>
            </div>
        </div>
    );
}

export default TwitCardItem;
