import React from "react";

import styles from "../styles/TwitItem.module.css"
import Avatar from "./Avatar";

const TwitItem = React.forwardRef((props, ref) => {

    return (
        <a href={props.href} ref={ref} className={styles["twit-item"]} draggable="true">
            <div>
                <span className={styles["team-abbrev"]}>{props.title}</span>
                <span className={styles["team-name"]}>{props.subtitle}</span>
            </div>
            <div>
                <Avatar roundedCircle className={styles["twit-item-avatar"]} src={props.image}/>
            </div>
        </a>
    );
})

export default TwitItem;