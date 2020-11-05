import React from "react";

import styles from "../styles/TwitItem.module.css"
import Avatar from "./Avatar";

function TwitItem(props){

    return (
        <div className={styles["twit-item"]}>
            <div>
                <span className={styles["team-abbrev"]}>{props.title}</span>
                <span className={styles["team-name"]}>{props.subtitle}</span>
            </div>
            <div>
                <Avatar roundedCircle className={styles["twit-item-avatar"]} src={props.image}/>
            </div>
        </div>
    );
}

export default TwitItem;