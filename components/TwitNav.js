import React from "react";
import {connect} from "react-redux";

import TwitNavItem from "./TwitNavItem";
import twitNav from "../sass/components/TwitNav.module.scss"

function TwitNav(props) {

    const unseenNotifications = props.notifications.length;
    const renderUnseenNotifcations = () => {
        if(unseenNotifications > 0){
            return <div className={twitNav["twit-nav__tagged"]}>{unseenNotifications}</div>;
        }
        else{
            return null;
        }
    }

    return(
        <nav className={twitNav["twit-nav"]}>
            <TwitNavItem href="/" title="Home">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-home"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem href="/notifications" title="Notifications">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-bell"/>
                </svg>
                {renderUnseenNotifcations()}
            </TwitNavItem>
            <TwitNavItem href="/messages" title="Messages">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-mail"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem href="/myTeams" title="My Teams">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-server"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem href="/myLeagues" title="My Leagues">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-trending-up"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem href="/user" title="User Profile">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-user"/>
                </svg>
            </TwitNavItem>
            <TwitNavItem href="/more" title="More">
                <svg className={twitNav["twit-nav__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-plus-circle"/>
                </svg>
            </TwitNavItem>
        </nav>
    );
}

const mapStateToProps = (state) => {
    return {notifications: state.user.notifications ? state.user.notifications : []}
}

export default connect(mapStateToProps)(TwitNav);