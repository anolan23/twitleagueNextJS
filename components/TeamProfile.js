import React, { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";

import useUser from "../lib/useUser";
import { useRouter } from "next/router";
import {
  follow,
  unFollow,
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite,
  sendNotification,
} from "../actions";
import Profile from "./Profile";
import teamProfile from "../sass/components/TeamProfile.module.scss";
import TwitButton from "./TwitButton";
import Attribute from "./Attribute";
import Count from "./Count";
import FollowButton from "./FollowButton";
import TwitIcon from "./TwitIcon";
import TwitDropdownButton from "./TwitDropdownButton";
import TwitDropdownItem from "./TwitDropdownItem";
import Prompt from "./modals/Prompt";
import Linkify from "./Linkify";
import TwitCard from "./TwitCard";
import TwitDate from "../lib/twit-date";
import { numberSuffix } from "../lib/twit-helpers";

function TeamProfile({ team, standings, onAvatarClick }) {
  const { user } = useUser();
  const router = useRouter();
  const { league, division, seasons } = team;
  const [showRequestToJoin, setShowRequestToJoin] = useState(false);
  const foundTeam = findTeamInStandings();
  const total_games = foundTeam
    ? foundTeam.total_games
      ? foundTeam.total_games
      : 0
    : 0;
  const wins = foundTeam ? (foundTeam.wins ? foundTeam.wins : 0) : 0;
  const losses = foundTeam ? (foundTeam.losses ? foundTeam.losses : 0) : 0;
  const ties = total_games - wins - losses;
  const place = foundTeam ? foundTeam.place : null;

  function findTeamInStandings() {
    if (standings) {
      for (let index = 0; index < standings.length; index++) {
        const division = standings[index];
        let result = division.teams.find(
          (foundTeam) => foundTeam.id === team.id
        );
        if (result) {
          return result;
        }
      }
    }
  }

  const sendUserRequestToJoinTeam = async () => {
    await sendNotification({
      userId: team.owner_id,
      type: "User Requests Join Team",
      payload: { teamId: team.id, senderId: user.id },
    });
    setShowRequestToJoin(false);
  };

  const renderButton = () => {
    if (!user) {
      return null;
    } else if (user.id === team.owner_id) {
      return (
        <TwitButton onClick={onAvatarClick} color="primary" outline="primary">
          Edit profile
        </TwitButton>
      );
    } else {
      return (
        <div className={teamProfile["team-profile__action-box"]}>
          <FollowButton team={team} />
          <TwitDropdownButton
            color="primary"
            outline="primary"
            icon="/sprites.svg#icon-more-horizontal"
          >
            <TwitDropdownItem
              onClick={() => setShowRequestToJoin(true)}
              icon="/sprites.svg#icon-plus"
            >
              Request to join
            </TwitDropdownItem>
            <TwitDropdownItem
              icon="/sprites.svg#icon-plus"
              onClick={() => router.push(`/leagues/${league_name}`)}
            >
              View league
            </TwitDropdownItem>
            <TwitDropdownItem icon="/sprites.svg#icon-mail">
              Message manger
            </TwitDropdownItem>
          </TwitDropdownButton>
        </div>
      );
    }
  };

  const renderLeagueName = () => {
    if (league) {
      return (
        <React.Fragment>
          &nbsp;·&nbsp;
          <Link href={`/leagues/${league.league_name}`} passHref>
            <a className="twit-link">{league.league_name}</a>
          </Link>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          &nbsp;·&nbsp;
          <span className={teamProfile["team-profile__info__null-league"]}>
            No league affiliation
          </span>
        </React.Fragment>
      );
    }
  };

  const renderRecord = () => {
    if (team.current_season) {
      return (
        <React.Fragment>
          <div className={teamProfile["team-profile__info__season"]}>
            {team.current_season
              ? `${TwitDate.getYear(team.current_season.created_at)} Season - `
              : null}
          </div>
          <div className={teamProfile["team-profile__info__record"]}>
            {`${wins} - ${losses} - ${ties} (W - L - T)`}
          </div>
          {division ? (
            <div className={teamProfile["team-profile__info__place"]}>
              {`${numberSuffix(place)} place in ${division.division_name}`}
            </div>
          ) : null}
        </React.Fragment>
      );
    } else {
      return (
        <div className={teamProfile["team-profile__info__season--null"]}>
          Offseason
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      <Profile
        banner={team.banner}
        avatar={team.avatar}
        onAvatarClick={onAvatarClick}
        action={renderButton()}
      >
        <div className={teamProfile["team-profile__info"]}>
          <div
            className={`${teamProfile["team-profile__teamname-box"]} u-margin-top-tiny`}
          >
            <h1
              className={teamProfile["team-profile__info__abbrev"]}
            >{`${team.abbrev.substring(1)}`}</h1>
          </div>
          <div className={teamProfile["team-profile__info__name"]}>
            <div
              className={teamProfile["team-profile__info__name__league"]}
            >{`${team.city} ${team.team_name}`}</div>
            {renderLeagueName()}
          </div>
          {renderRecord()}
          {team.bio ? (
            <div className={teamProfile["team-profile__info__bio"] + " muted"}>
              <Linkify string={team.bio} user={user} hasTwitLinks />
            </div>
          ) : null}
          <div className={teamProfile["team-profile__attributes"]}>
            <Attribute
              icon={"/sprites.svg#icon-map-pin"}
              text={`${team.city}, ${team.state}`}
            />
            <Attribute
              icon={"/sprites.svg#icon-home"}
              text={`Joined ${team.joined}`}
            />
          </div>
          <div className={teamProfile["team-profile__counts"]}>
            <Count href="/" value={team.players} text="Coaches" />
            <Count href="/" value={team.players} text="Players" />
            <Count href="/" value={team.followers} text="Followers" />
          </div>
        </div>
      </Profile>
      <Prompt
        show={showRequestToJoin}
        onHide={() => setShowRequestToJoin(false)}
        main={`Request to join ${team.team_name}`}
        sub="Do you want to join the roster of this team?"
        primaryActionText="Send"
        secondaryActionText="Cancel"
        onSecondaryActionClick={() => setShowRequestToJoin(false)}
        onPrimaryActionClick={sendUserRequestToJoinTeam}
      />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    following: state.user.following ? state.user.following : [],
    userId: state.user.id,
    username: state.user.username,
  };
};

export default connect(mapStateToProps, {
  follow,
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite,
})(TeamProfile);
