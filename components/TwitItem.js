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
                    <TwitButton onClick={props.onClick} color="twit-button--primary">{props.actionText}</TwitButton>
                </div>
            )
        }
    }

    return (
        <a href={props.href} ref={ref} className={twitItem["twit-item"]} draggable="true">
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