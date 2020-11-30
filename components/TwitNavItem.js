import React from "react"
import styles from "../sass/components/TwitNavItem.module.scss"

function TwitNavItem(props){
    return (
        <div className={styles["twit-nav-item"]}>
            <div className={styles["twit-nav-item__holder"]}>
                {props.children} 
                <div className={styles["twit-nav-item__text-holder"]}>
                    <span className={styles["twit-nav-item__text"]}>{props.title}</span>
                </div>     
            </div>
            
        </div>
    );
}

export default TwitNavItem;