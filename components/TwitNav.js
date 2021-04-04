import React from "react";
import {connect} from "react-redux";

import useUser from "../lib/useUser";
import TwitNavItem from "./TwitNavItem";
import TwitIcon from "./TwitIcon";
import twitNav from "../sass/components/TwitNav.module.scss"
import twitNavItem from "../sass/components/TwitNavItem.module.scss";

function TwitNav(props) {
    const { user } = useUser();
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
            <TwitNavItem href="/home" title="Home">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-home"/>
            </TwitNavItem>
            <TwitNavItem href="/notifications" title="Notifications">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-bell"/>
                {renderUnseenNotifcations()}
            </TwitNavItem>
            <TwitNavItem href="/messages" title="Messages">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-mail"/>
            </TwitNavItem>
            <TwitNavItem className={twitNav["twit-nav__hide"]} href="/myTeams" title="My Teams">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-server"/>
            </TwitNavItem>
            <TwitNavItem className={twitNav["twit-nav__hide"]} href="/myLeagues" title="My Leagues">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-trending-up"/>
            </TwitNavItem>
            <TwitNavItem href={`/users/${user ? user.username : null}`} title="User Profile">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-user"/>
            </TwitNavItem>
            <TwitNavItem className={twitNav["twit-nav__hide"]} href="/more" title="More">
                <TwitIcon className={twitNavItem["twit-nav-item__icon"]} icon="/sprites.svg#icon-plus-circle"/>
            </TwitNavItem>
        </nav>
    );
}

const mapStateToProps = (state) => {
    return {
        notifications: state.user.notifications ? state.user.notifications : [],
    }
}

export default connect(mapStateToProps)(TwitNav);