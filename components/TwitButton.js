import React from "react";

import twitButton from "../sass/components/TwitButton.module.scss";

function TwitButton(props){
    return (
        <button 
            type="submit"
            className={`${twitButton["twit-button"]} ${twitButton[props.color]} ${twitButton[props.size]} ${twitButton[props.outline]} ${twitButton[props.collapse]}`} 
            onClick={props.onClick}
            disabled={props.disabled}
            >
            {props.children}
        </button>
    )
}

export default TwitButton;