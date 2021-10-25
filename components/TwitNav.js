import React from "react";

import useUser from "../lib/useUser";
import TwitNavItem from "./TwitNavItem";
import TwitIcon from "./TwitIcon";
import twitNav from "../sass/components/TwitNav.module.scss";
import twitNavItem from "../sass/components/TwitNavItem.module.scss";

function TwitNav() {
  const { user } = useUser();

  const renderUnseenNotifcations = () => {
    if (!user) {
      return null;
    }
    if (user.notification_count > 0) {
      return (
        <div className={twitNav["twit-nav__tagged"]}>
          {user.notification_count}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <nav className={twitNav["twit-nav"]}>
      <TwitNavItem href="/home" title="Home">
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-home"
        />
      </TwitNavItem>
      <TwitNavItem href="/search" title="Explore">
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-search"
        />
      </TwitNavItem>
      <TwitNavItem href="/notifications" title="Notifications">
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-bell"
        />
        {renderUnseenNotifcations()}
      </TwitNavItem>
      <TwitNavItem href="/messages" title="Messages">
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-mail"
        />
      </TwitNavItem>
      <TwitNavItem
        className={twitNav["twit-nav__hide"]}
        href="/my-leagues"
        title="My Leagues"
      >
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-trending-up"
        />
      </TwitNavItem>
      <TwitNavItem
        className={twitNav["twit-nav__hide"]}
        href="/my-teams"
        title="My Teams"
      >
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-server"
        />
      </TwitNavItem>
      <TwitNavItem
        href={`/users/${user ? user.username : null}`}
        title="Profile"
      >
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-user"
        />
      </TwitNavItem>
      <TwitNavItem
        className={twitNav["twit-nav__hide"]}
        href="/more"
        title="More"
      >
        <TwitIcon
          className={twitNavItem["twit-nav-item__icon"]}
          icon="/sprites.svg#icon-plus-circle"
        />
      </TwitNavItem>
    </nav>
  );
}

export default TwitNav;
