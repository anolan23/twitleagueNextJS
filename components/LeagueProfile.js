import React from "react";
import { connect } from "react-redux";
import Link from "next/link";

import Profile from "./Profile";
import useUser from "../lib/useUser";
import leagueProfile from "../sass/components/LeagueProfile.module.scss";
import TwitButton from "./TwitButton";
import Attribute from "./Attribute";
import Count from "./Count";

function LeagueProfile(props) {
  const { user } = useUser();
  const league = props.league;

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === league.owner_id) {
      return (
        <TwitButton
          onClick={props.onAvatarClick}
          color="twit-button--primary"
          outline="twit-button--primary--outline"
        >
          Edit profile
        </TwitButton>
      );
    } else {
      return (
        <TwitButton
          color="twit-button--primary"
          outline="twit-button--primary--outline"
        >
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

  return (
    <React.Fragment>
      <Profile
        banner={league.banner}
        avatar={league.avatar}
        onAvatarClick={props.onAvatarClick}
        action={renderButton()}
      >
        <div className={leagueProfile["league-profile__info"]}>
          <div
            className={`${leagueProfile["league-profile__teamname-box"]} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{league.league_name}</h1>
          </div>
          {league.bio ? (
            <p
              className={leagueProfile["league-profile__info__bio"] + " muted"}
            >
              {league.bio}
            </p>
          ) : null}
          <div className={leagueProfile["league-profile__info__name"]}>
            <span
              className={leagueProfile["league-profile__info__name__league"]}
            >
              Owner:{" "}
            </span>
            &nbsp;
            {renderOwner()}
          </div>
          <div className={leagueProfile["league-profile__attributes"]}>
            <Attribute icon={"/sprites.svg#icon-map-pin"} text={league.sport} />
            <Attribute
              icon={"/sprites.svg#icon-home"}
              text={`Joined ${league.joined}`}
            />
          </div>
          <div className={leagueProfile["league-profile__counts"]}>
            <Count href="/" value={league.follower_count} text="Followers" />
            <Count href="/" value={league.team_count} text="Teams" />
          </div>
        </div>
      </Profile>
    </React.Fragment>
  );
}

export default connect(null)(LeagueProfile);
