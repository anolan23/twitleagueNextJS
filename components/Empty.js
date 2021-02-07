import React from "react"

import empty from "../sass/components/Empty.module.scss";
import TwitButton from "./TwitButton";

function Empty(props) {
        
return (
    <div className={empty["empty"]}>
        <h2 className={empty["empty__main"]}>{props.main}</h2>
        <p className={empty["empty__sub"]}>
            {props.sub}
        </p>
        <div className={empty["empty__action"]}>
            {props.actionText?<TwitButton onClick={props.onActionClick} color="twit-button--primary">{props.actionText}</TwitButton> : null}
        </div>
    </div>
        );
    
}

export default Empty;