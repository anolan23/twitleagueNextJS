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

function TeamProfile(props) {
  const { user } = useUser();
  const team = props.team;
  const router = useRouter();
  const [showRequestToJoin, setShowRequestToJoin] = useState(false);

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
        <TwitButton
          onClick={props.onAvatarClick}
          color="primary"
          outline="primary"
        >
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
              onClick={() => router.push(`/leagues/${team.league_name}`)}
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
    return (
      <Link href={`/leagues/${team.league_name}`} passHref>
        <a className="twit-link">{team.league_name}</a>
      </Link>
    );
  };

  const renderHeadCoach = () => {
    return (
      <Link href={`/users/${team.owner}`} passHref>
        <a className="twit-link">{`@${team.owner}`}</a>
      </Link>
    );
  };

  const renderRecord = () => {
    const { current_season_wins, current_season_losses } = team;
    if (current_season_wins !== null && current_season_losses !== null)
      return (
        <span
          className={teamProfile["team-profile__info__record"]}
        >{`${team.current_season_wins} - ${team.current_season_losses}`}</span>
      );
    else {
      return (
        <span className={teamProfile["team-profile__info__record"]}>
          {"0 - 0"}
        </span>
      );
    }
  };

  return (
    <React.Fragment>
      <Profile
        banner={team.banner}
        avatar={team.avatar}
        onAvatarClick={props.onAvatarClick}
        action={renderButton()}
      >
        <div className={teamProfile["team-profile__info"]}>
          <div
            className={`${teamProfile["team-profile__teamname-box"]} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{team.team_name}</h1>
            {team.verifiedTeam ? (
              <i
                style={{ color: "var(--color-primary)", marginLeft: "5px" }}
                className="fas fa-check-circle"
              ></i>
            ) : null}
          </div>
          {renderRecord()}
          <div className={teamProfile["team-profile__info__name"]}>
            <h3
              className={teamProfile["team-profile__info__name__league"]}
            >{`${team.abbrev} · `}</h3>
            &nbsp;
            {renderLeagueName()}
          </div>
          {team.bio ? (
            <p className={teamProfile["team-profile__info__bio"] + " muted"}>
              {team.bio}
            </p>
          ) : null}
          <div className={teamProfile["team-profile__info__name"]}>
            <span className={teamProfile["team-profile__info__name__league"]}>
              Team manager:{" "}
            </span>
            &nbsp;
            {renderHeadCoach()}
          </div>
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
            <Count href="/" value={team.followers} text="Followers" />
            <Count href="/" value={team.players} text="Players" />
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
