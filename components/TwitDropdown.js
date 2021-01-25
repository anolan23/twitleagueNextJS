import React from "react"

import twitDropdown from "../sass/components/TwitDropdown.module.scss";

function TwitDropdown(props){
    return (
        <div className={twitDropdown["twit-dropdown"]} style={{display: props.show?"block":"none"}}>
            {props.children}
        </div>
    )
}

export default TwitDropdown;