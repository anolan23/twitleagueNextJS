import React, { useState } from "react";

import Link from "next/link";

import Profile from "./Profile";
import TwitDate from "../lib/twit-date";
import { getSeasonString } from "../lib/twit-helpers";
import useUser from "../lib/useUser";
import leagueProfile from "../sass/components/LeagueProfile.module.scss";
import TwitButton from "./TwitButton";
import Attribute from "./Attribute";
import Count from "./Count";
import TeamsPopup from "./modals/TeamsPopup";

function LeagueProfile({ league, onAvatarClick }) {
  const { user } = useUser();
  const [showTeamsPopup, setShowTeamsPopup] = useState(false);
  const {
    owner_id,
    owner,
    current_season,
    seasons,
    banner,
    avatar,
    league_name,
    bio,
    sport,
    created_at,
    teams,
    follower_count,
  } = league;

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === owner_id) {
      return (
        <TwitButton onClick={onAvatarClick} color="primary" outline="primary">
          Edit profile
        </TwitButton>
      );
    } else {
      return (
        <TwitButton color="primary" outline="primary">
          Unfollow
        </TwitButton>
      );
    }
  };

  const renderOwner = () => {
    return (
      <Link href={`/users/${owner}`} passHref>
        <a className="twit-link">{`@${owner}`}</a>
      </Link>
    );
  };

  const renderSeason = () => {
    if (current_season) {
      return (
        <div className={leagueProfile["league-profile__info__season"]}>
          {current_season ? getSeasonString(current_season, seasons) : null}
        </div>
      );
    } else {
      return (
        <div className={leagueProfile["league-profile__info__season--null"]}>
          Offseason
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      <Profile
        banner={banner}
        avatar={avatar}
        onAvatarClick={onAvatarClick}
        action={renderButton()}
      >
        <div className={leagueProfile["league-profile__info"]}>
          <div
            className={`${leagueProfile["league-profile__teamname-box"]} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{league_name}</h1>
          </div>
          {renderSeason()}
          <Link href={`/leagues/${league_name}/schedule`} passHref>
            <a className="twit-link">View schedules</a>
          </Link>
          <Link href={`/leagues/${league_name}/standings`} passHref>
            <a className="twit-link">View standings</a>
          </Link>
          {bio ? (
            <p
              className={leagueProfile["league-profile__info__bio"] + " muted"}
            >
              {bio}
            </p>
          ) : null}

          <div className={leagueProfile["league-profile__attributes"]}>
            <Attribute icon={"/sprites.svg#icon-map-pin"} text={sport} />
            <Attribute
              icon={"/sprites.svg#icon-home"}
              text={`Joined ${TwitDate.localeDateString(created_at)}`}
            />
          </div>
          <div className={leagueProfile["league-profile__counts"]}>
            <Count
              href={`/leagues/${league_name}/followers`}
              value={follower_count}
              text="Followers"
            />
            <Count
              href={`/leagues/${league_name}/teams`}
              value={teams ? teams.length : 0}
              text="Teams"
            />
          </div>
        </div>
      </Profile>
      <TeamsPopup
        show={showTeamsPopup}
        onHide={() => setShowTeamsPopup(false)}
        teams={teams}
        title="Teams"
      />
    </React.Fragment>
  );
}

export default LeagueProfile;
