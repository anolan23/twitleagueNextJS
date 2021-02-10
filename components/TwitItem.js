import React from "react";
import Link from "next/link"

import twitItem from "../sass/components/TwitItem.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitItem(props) {

    const renderAction = () => {
        if(!props.actionText){
            return;
        }
        else{
            return (
                <div className={twitItem["twit-item__action"]}>
                    <TwitButton href={props.href} onClick={props.onActionClick} color="twit-button--primary">{props.actionText}</TwitButton>
                </div>
            )
        }
    }

    return (
        <Link href={props.href} passHref>
            <a onClick={props.onClick} className={`${twitItem["twit-item"]} ${props.active?twitItem["twit-item--active"]:""}`} draggable="true">
                <Avatar roundedCircle className={twitItem["twit-item__image"]} src={props.avatar}/>
                <div className={twitItem["twit-item__textbox"]}>
                    <span className={twitItem["twit-item__title"]}>{props.title}</span>
                    <span className={twitItem["twit-item__subtitle"]}>{props.subtitle}</span>
                </div>
                {renderAction()}
            </a>
        </Link>
        
    );
}

export default TwitItem;