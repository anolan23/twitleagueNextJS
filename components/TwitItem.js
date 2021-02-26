import React from "react";
import {useRouter} from "next/router";

import twitItem from "../sass/components/TwitItem.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitItem(props) {
    const router = useRouter();

    const onClick = () => {
        if(!props.href){
            return;
        }
        router.push(props.href);
    }

    const renderAction = () => {
        if(!props.actionText){
            return;
        }
        else{
            return (
                <div className={twitItem["twit-item__action"]}>
                    <TwitButton onClick={props.onActionClick} color="twit-button--primary" outline="twit-button--primary--outline">{props.actionText}</TwitButton>
                </div>
            )
        }
    }

    return (
        <div onClick={onClick} className={`${twitItem["twit-item"]} ${props.active?twitItem["twit-item--active"]:""}`} draggable="true">
            <Avatar roundedCircle className={twitItem["twit-item__image"]} src={props.avatar}/>
            <div className={twitItem["twit-item__textbox"]}>
                <span className={twitItem["twit-item__title"]}>{props.title}</span>
                <span className={twitItem["twit-item__subtitle"]}>{props.subtitle}</span>
                {props.paragraph ? <p className={twitItem["twit-item__paragraph"]}>{props.paragraph}</p> : null}
            </div>
            {renderAction()}
        </div>
    );
}

export default TwitItem;