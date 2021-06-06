import React from "react";
import { connect } from "react-redux";
import Link from "next/link";

import Profile from "./Profile";
import TwitDate from "../lib/twit-date";
import useUser from "../lib/useUser";
import leagueProfile from "../sass/components/LeagueProfile.module.scss";
import TwitButton from "./TwitButton";
import Attribute from "./Attribute";
import Count from "./Count";

function LeagueProfile({ league, onAvatarClick }) {
  const { user } = useUser();

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === league.owner_id) {
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
      <Link href={`/users/${league.owner}`} passHref>
        <a className="twit-link">{`@${league.owner}`}</a>
      </Link>
    );
  };

  const renderSeason = () => {
    if (league.current_season) {
      return (
        <div className={leagueProfile["league-profile__info__season"]}>
          {league.current_season
            ? `${TwitDate.getYear(league.current_season.created_at)} Season - `
            : null}
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
        banner={league.banner}
        avatar={league.avatar}
        onAvatarClick={onAvatarClick}
        action={renderButton()}
      >
        <div className={leagueProfile["league-profile__info"]}>
          <div
            className={`${leagueProfile["league-profile__teamname-box"]} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{league.league_name}</h1>
          </div>
          {renderSeason()}
          {league.bio ? (
            <p
              className={leagueProfile["league-profile__info__bio"] + " muted"}
            >
              {league.bio}
            </p>
          ) : null}

          <div className={leagueProfile["league-profile__attributes"]}>
            <Attribute icon={"/sprites.svg#icon-map-pin"} text={league.sport} />
            <Attribute
              icon={"/sprites.svg#icon-home"}
              text={`Joined ${league.joined}`}
            />
          </div>
          <div className={leagueProfile["league-profile__counts"]}>
            <Count href="/" value={league.follower_count} text="Followers" />
            <Count
              href="/"
              value={league.teams ? league.teams.length : 0}
              text="Teams"
            />
          </div>
        </div>
      </Profile>
    </React.Fragment>
  );
}

export default connect(null)(LeagueProfile);
