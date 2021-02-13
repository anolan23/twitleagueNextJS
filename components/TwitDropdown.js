import React from "react"

import twitDropdown from "../sass/components/TwitDropdown.module.scss";

function TwitDropdown(props){

    if(!props.show){
        return null;
    }
    else{
        return (
            <div className={twitDropdown["twit-dropdown"]}>
                {props.children}
            </div>
        )
    }
    
}

export default TwitDropdown;