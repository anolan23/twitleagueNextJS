import React from "react"

import twitDropdown from "../sass/components/TwitDropdown.module.scss";

function TwitDropdownItem(props){
    return (
        <div onClick={props.onClick} className={twitDropdown["twit-dropdown__item"]}>
            {props.children}
        </div>
    )
}

export default TwitDropdownItem;