import React from "react";
import Link from "next/link";

import twitCard from "../sass/components/TwitCard.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitCardItem(props) {

    return (
        <div className={twitCard["twit-card__item"]}>
            <Link href={props.href}>
                <Avatar roundedCircle className={twitCard["twit-card__item__image"]} src={props.avatar}/>
            </Link>
            <div className={twitCard["twit-card__item__text-box"]}>
                <Link href={props.href} passHref>
                    <a className={twitCard["twit-card__item__text--main"] + " heading-3"}>{props.mainText}</a>
                </Link>
                <div className={twitCard["twit-card__item__text--sub"] + " muted"}>{props.subText}</div>
            </div>
            <div className={twitCard["twit-card__item__action"]}>
                <TwitButton color="twit-button--primary">{props.actionText}</TwitButton>
            </div>
        </div>
    );
}

export default TwitCardItem;
