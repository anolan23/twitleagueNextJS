import React from "react"

import twitDropdown from "../sass/components/TwitDropdown.module.scss";

function TwitDropdownItem(props){
    if(props.disabled){
        return (
            <div className={`${twitDropdown["twit-dropdown__item"]} ${twitDropdown["twit-dropdown__item--disabled"]}`} value={props.value} id={props.id}>
                {props.children}
            </div>
        )
    }
    else{
        return (
            <div onClick={props.onClick} className={twitDropdown["twit-dropdown__item"]} value={props.value} id={props.id}>
                {props.children}
            </div>
        )
    }  
}

export default TwitDropdownItem;