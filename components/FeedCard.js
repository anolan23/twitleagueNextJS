import Link from "next/link";
import Divide from "./Divide";

import feedCard from "../sass/components/FeedCard.module.scss";
import TwitIcon from "./TwitIcon";

function FeedCard(props){
    if(!props.children){
        return null;
    }

    return (
        <div className={feedCard["feed-card"]}>
            <Divide/>
            <div className={feedCard["feed-card__header"]}>
                <h1 className={feedCard["feed-card__header__title"]}>{props.title}</h1>
                <TwitIcon className={feedCard["feed-card__header__icon"]} icon="/sprites.svg#icon-more-horizontal"/>
            </div>
            <div className={feedCard["feed-card__content"]}>
                {props.children}
            </div>
            <div className={feedCard["feed-card__footer"]}>
                <Link href="/suggested">
                    <div className={feedCard["feed-card__footer__box"]}>
                        <span className={feedCard["feed-card__footer__box__text"]}>Show more</span>
                    </div>
                </Link>  
            </div>
            <Divide/>
        </div>
    )
}

export default FeedCard;