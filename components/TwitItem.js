import React from "react";

import twitItem from "../sass/components/TwitItem.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

const TwitItem = React.forwardRef((props, ref) => {

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
        <a ref={ref} onClick={props.onClick} className={`${twitItem["twit-item"]} ${props.active?twitItem["twit-item--active"]:""}`} draggable="true">
            <Avatar roundedCircle className={twitItem["twit-item__image"]} src={props.avatar}/>
            <div className={twitItem["twit-item__textbox"]}>
                <span className={twitItem["twit-item__title"]}>{props.title}</span>
                <span className={twitItem["twit-item__subtitle"]}>{props.subtitle}</span>
            </div>
            {renderAction()}
        </a>
    );
})

export default TwitItem;