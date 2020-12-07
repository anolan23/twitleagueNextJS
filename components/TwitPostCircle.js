import React from "react";

import twitPostCircle from "../sass/components/TwitPostCircle.module.scss";

function TwitPostCircle(props){
    return(
        <div onClick={props.onClick} className={twitPostCircle["twit-post-circle"]}>
            <svg className={twitPostCircle["twit-post-circle__icon"]}>
                <use xlinkHref="/sprites.svg#icon-edit"/>
            </svg>
        </div>
    )
}
export default TwitPostCircle;