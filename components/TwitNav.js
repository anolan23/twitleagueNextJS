import React from "react";
import TwitNavItem from "./TwitNavItem";
import twitNav from "../sass/components/TwitNav.module.scss"

function TwitNav() {
    return(
        <div className={twitNav["twit-nav"]}>
            <TwitNavItem title="Home">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-home"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem title="Notifications">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-bell"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem title="Messages">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-mail"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem title="My Teams">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-server"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem title="My Leagues">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-trending-up"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem title="User Profile">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-user"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem title="More">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-plus-circle"/>
                </svg>
            </TwitNavItem>
        </div>
    );
}
export default TwitNav;