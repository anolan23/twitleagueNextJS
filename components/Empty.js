import React from "react"

import empty from "../sass/components/Empty.module.scss";
import TwitButton from "./TwitButton";

function Empty(props) {
    const renderAction = () => {
        if (props.onActionClick){
            return <TwitButton onClick={props.onActionClick} color="twit-button--primary">{props.actionText}</TwitButton>
        }
        else if (props.actionHref){
            return <TwitButton href={props.actionHref} color="twit-button--primary">{props.actionText}</TwitButton>
        }
    }
        
    return (
        <div className={empty["empty"]}>
            <h2 className={empty["empty__main"]}>{props.main}</h2>
            <p className={empty["empty__sub"]}>
                {props.sub}
            </p>
            <div className={empty["empty__action"]}>
                {renderAction()}
            </div>
        </div>
            );
    
}

export default Empty;