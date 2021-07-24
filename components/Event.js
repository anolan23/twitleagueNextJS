import React, { useState } from "react";
import { useRouter } from "next/router";

import useUser from "../lib/useUser";
import { likeEvent, unLikeEvent } from "../actions";
import eventStyle from "../sass/components/Event.module.scss";
import post from "../sass/components/Post.module.scss";
import TwitIcon from "./TwitIcon";
import Like from "./Like";
import TwitDate from "../lib/twit-date";

function Event({ event, teamId }) {
  const { user } = useUser();
  const router = useRouter();
  const [liked, setLiked] = useState(event.liked);
  const [likes, setLikes] = useState(event.likes);

  const onLikeClick = async (e) => {
    e.stopPropagation();
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!liked) {
        await likeEvent(event.id, user.id);
        setLiked(true);
        setLikes((likes) => parseInt(likes) + 1);
      } else {
        await unLikeEvent(event.id, user.id);
        setLiked(false);
        setLikes((likes) => parseInt(likes) - 1);
      }
    }
  };

  const renderTeams = () => {
    if (event.type === "game") {
      return (
        <div className={eventStyle["event__wrap"]}>
          <div className={eventStyle["event__teams"]}>
            <div
              className={eventStyle["event__teams__team"]}
              style={{ backgroundImage: `url(${event.avatar})` }}
            ></div>
            <div
              className={eventStyle["event__teams__team"]}
              style={{ backgroundImage: `url(${event.opponent_avatar})` }}
            ></div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderTeamNames = () => {
    if (event.type !== "game") {
      return null;
    } else if (event.isHomeTeam == true || event.is_home_team == true) {
      return (
        <span
          className={eventStyle["event__matchup__vs"]}
        >{`${event.team_name} vs ${event.opponent_team_name}`}</span>
      );
    } else {
      return (
        <span
          className={eventStyle["event__matchup__vs"]}
        >{`${event.team_name} @ ${event.opponent_team_name}`}</span>
      );
    }
  };

  const renderPlayPeriod = () => {
    if (event.play_period) {
      return (
        <span className={eventStyle["event__status__text"]}>
          {event.play_period}
        </span>
      );
    } else {
      return null;
    }
  };

  const renderResult = () => {
    if (event.league_approved) {
      const {
        home_team_points,
        away_team_points,
        home_season_team_id,
        away_season_team_id,
      } = event;
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
        router.push(`/events/${event.id}`).then(() => window.scrollTo(0, 0))
      }
      className={eventStyle["event"]}
    >
      {renderTeams()}
      <div className={eventStyle["event__date"]}>
        <span className={eventStyle["event__date--day"]}>
          {TwitDate.getDay(event.date)}
        </span>
        <span className={eventStyle["event__date--date"]}>
          {TwitDate.getDate(event.date)}
        </span>
        <span className={eventStyle["event__date--month"]}>
          {TwitDate.getMonth(event.date)}
        </span>
      </div>
      <div className={eventStyle["event__content"]}>
        <div className={eventStyle["event__matchup"]}>
          <div className={eventStyle["event__info"]}>
            <span className={eventStyle["event__type"]}>
              {event.type === "game" ? null : event.type}
            </span>
            {renderTeamNames()}
            {renderResult()}
            <span className={eventStyle["event__time"]}>
              {event.play_period ? null : TwitDate.formatAMPM(event.date)}
            </span>
            <span className={eventStyle["event__location"]}>
              {event.location}
            </span>
            <span className={eventStyle["event__notes"]}>{event.notes}</span>
          </div>
        </div>
        <div className={eventStyle["event__status"]}>
          {renderPlayPeriod()}
          <span className={eventStyle["event__status__score"]}>
            {event.points ? `${event.points} - ${event.opponent_points}` : null}
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
            {event.replies > 0 ? event.replies : null}
          </span>
        </div>
        <div className={post["post__icons__holder"]}>
          <TwitIcon
            className={post["post__icon"]}
            icon="/sprites.svg#icon-repeat"
          />
          <span className={post["post__icons__count"]}>
            {event.reposts ? event.reposts : null}
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
