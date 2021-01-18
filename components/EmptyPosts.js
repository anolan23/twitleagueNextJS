import React from "react"

import emptyPosts from "../sass/components/EmptyPosts.module.scss";
import TwitButton from "./TwitButton";

function EmptyPosts(props) {
        
return (
    <div className={emptyPosts["empty-posts"]}>
        <h2 className={emptyPosts["empty-posts__main"]}>{props.main}</h2>
        <p className={emptyPosts["empty-posts__sub"]}>
            {props.sub}
        </p>
        <div className={emptyPosts["empty-posts__action"]}>
            <TwitButton onClick={props.onActionClick} color="twit-button--primary">{props.actionText}</TwitButton>
        </div>
    </div>
        );
    
}

export default EmptyPosts;