import React from "react"
import twitTabs from "../sass/components/TwitTabs.module.scss";


function TwitTab(props){

    const active = () => {
        if(props.active){
            return `${twitTabs["twit-tabs__tab"]} ${twitTabs["twit-tabs__tab--active"]}`;
        }
        else{
            return twitTabs["twit-tabs__tab"];
        }
    }
    return(
            <div onClick={props.onClick} className={active()} id={props.id}>
                {props.title}
            </div>
    )
}

export default TwitTab;