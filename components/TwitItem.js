import React from "react";

import twitItem from "../sass/components/TwitItem.module.scss";
import Avatar from "./Avatar";

const TwitItem = React.forwardRef((props, ref) => {

    return (
        <a href={props.href} ref={ref} className={twitItem["twit-item"]} draggable="true">
            <Avatar roundedCircle className={twitItem["twit-item__image"]} src={props.image}/>
            <div>
                <span className={twitItem["twit-item__team-abbrev"]}>{props.title}</span>
                <span className={twitItem["twit-item__team-name"]}>{props.subtitle}</span>
            </div>
        </a>
    );
})

export default TwitItem;