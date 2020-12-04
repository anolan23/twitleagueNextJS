import React from "react";

import twitButton from "../sass/components/TwitButton.module.scss";

function TwitButton(props){
    return (
        <div 
            className={`${twitButton["twit-button"]} ${twitButton[props.color]} ${twitButton[props.size]} ${twitButton[props.outline]} ${twitButton[props.collapse]}`} 
            onClick={props.onClick}>{props.children}
        </div>
    )
}

export default TwitButton;