import React from "react";
import ReactDOM from "react-dom";
import { useRouter } from "next/router";

import useUser from "../lib/useUser";
import twitPanel from "../sass/components/TwitPanel.module.scss";
import { logOutUser } from "../actions";
import Avatar from "./Avatar";
import TwitPanelItem from "./TwitPanelItem";
import TwitIcon from "./TwitIcon";
import Count from "./Count";

function TwitPanel({ show, onHide }) {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const background = () => {
    if (show) {
      return `${twitPanel["twit-panel__background"]} ${twitPanel["twit-panel__background__open"]}`;
    } else {
      return twitPanel["twit-panel__background"];
    }
  };

  const panel = () => {
    if (show) {
      return `${twitPanel["twit-panel"]} ${twitPanel["twit-panel__open"]}`;
    } else {
      return twitPanel["twit-panel"];
    }
  };

  const logOut = async () => {
    await logOutUser();
    onHide();
  };

  return ReactDOM.createPortal(
    <div className={background()}>
      <div className={panel()}>
        <div className={twitPanel["twit-panel__heading"]}>
          <h1 className={twitPanel["twit-panel__heading__text"]}>
            Account info
          </h1>
          <TwitIcon
            icon="/sprites.svg#icon-x"
            className={twitPanel["twit-panel__heading__icon"]}
            onClick={onHide}
          />
        </div>
        <div className={twitPanel["twit-panel__content"]}>
          <div className={twitPanel["twit-panel__user"]}>
            <Avatar
              className={twitPanel["twit-panel__user__avatar"]}
              src={user.avatar}
            />
            <div className={twitPanel["twit-panel__user__textbox"]}>
              <span className={twitPanel["twit-panel__user__text--main"]}>
                {user.name}
              </span>
              <span
                className={twitPanel["twit-panel__user__text--sub"]}
              >{`@${user.username}`}</span>
            </div>
          </div>
          <div className={twitPanel["twit-panel__follow"]}>
            <Count
              href={`/users/${user.username}/scouts`}
              text="Scouts"
              value={user.scouts}
            />
            <Count
              href={`/users/${user.username}/scouting`}
              text="Scouting"
              value={user.scouting}
            />
            <Count
              href={`/users/${user.username}/following`}
              text="Following"
              value={user.following}
            />
          </div>
          <nav className={twitPanel["twit-panel__nav"]}>
            <TwitPanelItem
              text="Profile"
              href={`/users/${user.username}`}
              onClick={onHide}
            >
              <use xlinkHref="/sprites.svg#icon-user" />
            </TwitPanelItem>
            <TwitPanelItem
              text="Create team"
              href="/teams/create"
              onClick={onHide}
            >
              <use xlinkHref="/sprites.svg#icon-plus" />
            </TwitPanelItem>
            <TwitPanelItem text="My teams" href="/myTeams" onClick={onHide}>
              <use xlinkHref="/sprites.svg#icon-server" />
            </TwitPanelItem>
            <TwitPanelItem text="My leagues" href="/myLeagues" onClick={onHide}>
              <use xlinkHref="/sprites.svg#icon-user" />
            </TwitPanelItem>
            <TwitPanelItem text="Log out" href="/" onClick={logOut}>
              <use xlinkHref="/sprites.svg#icon-arrow-left" />
            </TwitPanelItem>
          </nav>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default TwitPanel;
