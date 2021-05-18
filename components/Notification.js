import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import reactStringReplace from "react-string-replace";

import notificationStyle from "../sass/components/Notification.module.scss";
import TwitButton from "./TwitButton";
import Avatar from "./Avatar";
import backend from "../lib/backend";
import { addPlayerToRoster } from "../actions";

function Notification({ notification }) {
  const router = useRouter();
 
  const onAcceptJoinLeagueRequestClick = () => {
    const leagueId = notification.league_id;
    const teamId = notification.team_id;
    backend.patch("/api/join/league", { leagueId, teamId });
  };

  const renderSymbol = () => {
    if (notification.is_home_team) {
      return "vs";
    } else {
      return "@";
    }
  };

  const renderNotification = () => {
    switch (notification.type) {
      case "Join League Request": {
        const text = `${notification.abbrev}  wants to join ${notification.league_name}`;
        const replacedText = reactStringReplace(
          text,
          /\$(\w+)/g,
          (match, i) => (
            <Link
              key={match + i}
              passHref
              href={`/teams/${notification.abbrev.substring(1)}`}
            >
              <a className="twit-link">${match}</a>
            </Link>
          )
        );
        return (
          <div
            className={notificationStyle["notification"]}
            onClick={() =>
              router.push(`/teams/${notification.abbrev.substring(1)}`)
            }
          >
            <Avatar
              className={notificationStyle["notification__image"]}
              src={notification.team_avatar}
            />
            <span className={notificationStyle["notification__text"]}>
              {replacedText}
            </span>
            <div className={notificationStyle["notification__actions"]}>
              <TwitButton
                onClick={onAcceptJoinLeagueRequestClick}
                color="primary"
              >
                Accept
              </TwitButton>
              <TwitButton color="primary" outline="primary">
                Decline
              </TwitButton>
            </div>
          </div>
        );
      }
      case "Join Team Invite": {
        const text = `${notification.abbrev} wants you to play for their team`;
        const replacedText = reactStringReplace(
          text,
          /\$(\w+)/g,
          (match, i) => (
            <Link
              key={match + i}
              passHref
              href={"/teams/" + notification.abbrev}
            >
              <a>${match}</a>
            </Link>
          )
        );

        return (
          <div
            className={notificationStyle["notification"]}
            onClick={() =>
              router.push(`/teams/${notification.abbrev.substring(1)}`)
            }
          >
            <span className={notificationStyle["notification__text"]}>
              {replacedText}
            </span>
            <div className={notificationStyle["notification__actions"]}>
              <TwitButton
                onClick={() =>
                  addPlayerToRoster({
                    teamId: notification.team_id,
                    userId: notification.user_id,
                  })
                }
                color="primary"
              >
                Accept
              </TwitButton>
              <TwitButton color="primary" outline="primary">
                Decline
              </TwitButton>
            </div>
          </div>
        );
      }
      case "User Requests Join Team": {
        const text = `@${notification.sender_username} wants to play for ${notification.abbrev}`;
        let replacedText = reactStringReplace(text, /\@(\w+)/g, (match, i) => (
          <Link
            key={match + i}
            passHref
            href={`/users/${notification.sender_username}`}
          >
            <a className="twit-link">@{match}</a>
          </Link>
        ));

        replacedText = reactStringReplace(
          replacedText,
          /\$(\w+)/g,
          (match, i) => (
            <Link
              key={match + i}
              passHref
              href={`/teams/${notification.abbrev.substring(1)}`}
            >
              <a className="twit-link">${match}</a>
            </Link>
          )
        );

        return (
          <div
            className={notificationStyle["notification"]}
            onClick={() =>
              router.push(`/users/${notification.sender_username}`)
            }
          >
            <Avatar
              className={notificationStyle["notification__image"]}
              src={notification.team_avatar}
            />
            <span className={notificationStyle["notification__text"]}>
              {replacedText}
            </span>
            <div className={notificationStyle["notification__actions"]}>
              <TwitButton
                onClick={() =>
                  addPlayerToRoster({
                    teamId: notification.team_id,
                    userId: notification.sender_id,
                  })
                }
                color="primary"
              >
                Accept
              </TwitButton>
              <TwitButton color="primary" outline="primary">
                Decline
              </TwitButton>
            </div>
          </div>
        );
      }
      case "Awaiting Event Approval": {
        const event = `${notification.team_name} ${renderSymbol()} ${
          notification.opponent_team_name
        } `;
        const text = `game has ended and is waiting for ${notification.events_league_name} approval`;

        return (
          <div
            className={notificationStyle["notification"]}
            onClick={() => router.push("/events/" + notification.event_id)}
          >
            <Link passHref href={"/events/" + notification.event_id}>
              <a className={notificationStyle["notification__text"]}>{event}</a>
            </Link>
            &nbsp;
            <span className={notificationStyle["notification__text"]}>
              {text}
            </span>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return <React.Fragment>{renderNotification()}</React.Fragment>;
}

export default Notification;
