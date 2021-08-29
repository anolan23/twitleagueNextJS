import React, { useState } from "react";
import { useRouter } from "next/router";

import { likeEvent, unLikeEvent } from "../actions";
import eventStyle from "../sass/components/Event.module.scss";
import post from "../sass/components/Post.module.scss";
import TwitIcon from "./TwitIcon";
import Like from "./Like";
import TwitDate from "../lib/twit-date";

function Event({ event, teamId, user }) {
  const router = useRouter();
  const {
    id,
    type,
    home_season_team_id,
    away_season_team_id,
    play_period,
    league_approved,
    home_team_points,
    away_team_points,
    date,
    notes,
    location,
    replies,
    reposts,
    home_team,
    away_team,
  } = event;
  const [liked, setLiked] = useState(event.liked);
  const [likes, setLikes] = useState(event.likes);

  const onLikeClick = async (e) => {
    e.stopPropagation();
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!liked) {
        await likeEvent(id, user.id);
        setLiked(true);
        setLikes((likes) => parseInt(likes) + 1);
      } else {
        await unLikeEvent(id, user.id);
        setLiked(false);
        setLikes((likes) => parseInt(likes) - 1);
      }
    }
  };

  const renderTeams = () => {
    if (type === "game") {
      return (
        <div className={eventStyle["event__wrap"]}>
          <div className={eventStyle["event__teams"]}>
            <div
              className={eventStyle["event__teams__team"]}
              style={{ backgroundImage: `url(${home_team.avatar})` }}
            ></div>
            <div
              className={eventStyle["event__teams__team"]}
              style={{ backgroundImage: `url(${away_team.avatar})` }}
            ></div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderPlayPeriod = () => {
    if (play_period) {
      return (
        <span className={eventStyle["event__status__text"]}>{play_period}</span>
      );
    } else {
      return null;
    }
  };

  const renderResult = () => {
    if (league_approved) {
      if (teamId === home_season_team_id) {
        if (home_team_points > away_team_points) {
          return (
            <span className={eventStyle["event__status__result--win"]}>W</span>
          );
        } else if (home_team_points < away_team_points) {
          return (
            <span className={eventStyle["event__status__result--loss"]}>L</span>
          );
        } else if (home_team_points === away_team_points) {
          return <span className={eventStyle["event__status__result"]}>T</span>;
        } else {
          return null;
        }
      } else if (teamId === away_season_team_id) {
        if (home_team_points > away_team_points) {
          return (
            <span className={eventStyle["event__status__result--loss"]}>L</span>
          );
        } else if (home_team_points < away_team_points) {
          return (
            <span className={eventStyle["event__status__result--win"]}>W</span>
          );
        } else if (home_team_points === away_team_points) {
          return <span className={eventStyle["event__status__result"]}>T</span>;
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
  };
  return (
    <div
      onClick={() =>
        router.push(`/events/${id}`).then(() => window.scrollTo(0, 0))
      }
      className={eventStyle["event"]}
    >
      {renderTeams()}
      <div className={eventStyle["event__date"]}>
        <span className={eventStyle["event__date--day"]}>
          {TwitDate.getDay(date)}
        </span>
        <span className={eventStyle["event__date--date"]}>
          {TwitDate.getDate(date)}
        </span>
        <span className={eventStyle["event__date--month"]}>
          {TwitDate.getMonth(date)}
        </span>
      </div>
      <div className={eventStyle["event__content"]}>
        <div className={eventStyle["event__matchup"]}>
          <div className={eventStyle["event__info"]}>
            <span className={eventStyle["event__type"]}>
              {type === "game" ? null : type}
            </span>
            <div
              className={eventStyle["event__matchup__vs"]}
            >{`${home_team.team_name} vs ${away_team.team_name}`}</div>
            {renderResult()}
            <span className={eventStyle["event__time"]}>
              {play_period ? null : TwitDate.formatAMPM(date)}
            </span>
            <span className={eventStyle["event__location"]}>{location}</span>
            <span className={eventStyle["event__notes"]}>{notes}</span>
          </div>
        </div>
        <div className={eventStyle["event__status"]}>
          {renderPlayPeriod()}
          <span className={eventStyle["event__status__score"]}>
            {home_team_points
              ? `${home_team_points} - ${away_team_points}`
              : null}
          </span>
        </div>
      </div>
      <div className={post["post__icons"]}>
        <div className={post["post__icons__holder"]}>
          <TwitIcon
            className={post["post__icon"]}
            icon="/sprites.svg#icon-message-square"
          />
          <span className={post["post__icons__count"]}>
            {replies > 0 ? replies : null}
          </span>
        </div>
        <div className={post["post__icons__holder"]}>
          <TwitIcon
            className={post["post__icon"]}
            icon="/sprites.svg#icon-repeat"
          />
          <span className={post["post__icons__count"]}>
            {reposts ? reposts : null}
          </span>
        </div>
        <div
          onClick={onLikeClick}
          className={`${post["post__icons__holder"]} ${
            liked ? post["post__icons__holder__active"] : null
          }`}
        >
          <Like className={post["post__icon"]} liked={liked} />
          <span className={post["post__icons__count"]}>
            {likes > 0 ? likes : null}
          </span>
        </div>
        <div className={post["post__icons__holder"]}>
          <TwitIcon
            onClick={null}
            className={post["post__icon"]}
            icon="/sprites.svg#icon-corner-up-right"
          />
        </div>
      </div>
    </div>
  );
}

export default Event;
