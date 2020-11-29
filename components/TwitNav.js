import React from "react";
import TwitNavItem from "./TwitNavItem";
import styles from "../sass/components/TwitNav.module.scss"

function TwitNav() {
    return(
        <div className={styles["twit-nav"]}>
            <TwitNavItem title="Home">
                <i className="fas fa-home"></i>
            </TwitNavItem>
            <TwitNavItem title="Notifications">
                <i className="far fa-bell"></i>
            </TwitNavItem>
            <TwitNavItem title="Messages">
                <i className="far fa-envelope"></i>
            </TwitNavItem>
            <TwitNavItem title="My Teams">
                <i className="far fa-list-alt"></i>
            </TwitNavItem>
            <TwitNavItem title="My Leagues">
                <i className="far fa-list-alt"></i>
            </TwitNavItem>
            <TwitNavItem title="User Profile">
                <i className="far fa-user"></i>
            </TwitNavItem>
            <TwitNavItem title="More">
                <i className="fas fa-ellipsis-h"></i>
            </TwitNavItem>
        </div>
    );
}
export default TwitNav;