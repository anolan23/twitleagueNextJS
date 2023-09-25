import React, { useState } from 'react';

import Link from 'next/link';

import useUser from '../lib/useUser';
import { useRouter } from 'next/router';
import { follow, unFollow, sendNotification } from '../actions';
import Profile from './Profile';
import teamProfile from '../sass/components/TeamProfile.module.scss';
import TwitButton from './TwitButton';
import Attribute from './Attribute';
import Count from './Count';
import FollowButton from './FollowButton';
import TwitIcon from './TwitIcon';
import TwitDropdownButton from './TwitDropdownButton';
import TwitDropdownItem from './TwitDropdownItem';
import Prompt from './modals/Prompt';
import Linkify from './Linkify';
import TwitCard from './TwitCard';
import TwitDate from '../lib/twit-date';
import { numberSuffix, getSeasonString } from '../lib/twit-helpers';

function TeamProfile({ team, standings, onAvatarClick }) {
  const { user } = useUser();
  const router = useRouter();
  const { league, division, seasons, season_team_id } = team;
  const [showRequestToJoin, setShowRequestToJoin] = useState(false);
  const [showRosterPopup, setShowRosterPopup] = useState(false);
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
    const notification = {
      type: 'User Requests Join Team',
      user_id: team.owner_id,
      sender_id: user.id,
      team_id: team.id,
      league_id: null,
      event_id: null,
    };
    await sendNotification(notification);
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
        <div className={teamProfile['team-profile__action-box']}>
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
          <Link href={`/leagues/${league.league_name}`} className="twit-link">
            {league.league_name}
          </Link>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          &nbsp;·&nbsp;
          <span className={teamProfile['team-profile__info__null-league']}>
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
          <div className={teamProfile['team-profile__info__season']}>
            {team.current_season
              ? getSeasonString(team.current_season, team.seasons)
              : null}
          </div>
          <div className={teamProfile['team-profile__info__record']}>
            {`${wins} - ${losses} - ${ties} (W - L - T)`}
          </div>
          {division ? (
            <div className={teamProfile['team-profile__info__place']}>
              {`${numberSuffix(place)} place in ${division.division_name}`}
            </div>
          ) : null}
        </React.Fragment>
      );
    } else {
      return (
        <div className={teamProfile['team-profile__info__season--null']}>
          Offseason
        </div>
      );
    }
  };

  function renderLinks() {
    if (!league) return null;
    return (
      <React.Fragment>
        <Link
          href={{
            pathname: `/leagues/${league.league_name}/schedules`,
            query: season_team_id ? { seasonTeamId: season_team_id } : null,
          }}
          className="twit-link"
        >
          Team schedule
        </Link>
        <Link
          href={`/leagues/${league.league_name}/standings`}
          className="twit-link"
        >
          Standings
        </Link>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Profile
        banner={team.banner}
        avatar={team.avatar}
        onAvatarClick={onAvatarClick}
        action={renderButton()}
      >
        <div className={teamProfile['team-profile__info']}>
          <div
            className={`${teamProfile['team-profile__teamname-box']} u-margin-top-tiny`}
          >
            <h1 className={teamProfile['team-profile__info__abbrev']}>
              {team.team_name}
            </h1>
          </div>
          <div className={teamProfile['team-profile__info__name']}>
            <div className={teamProfile['team-profile__info__name__league']}>
              {team.abbrev}
            </div>
            {renderLeagueName()}
          </div>
          {renderRecord()}
          {renderLinks()}
          {team.bio ? (
            <div className={teamProfile['team-profile__info__bio'] + ' muted'}>
              <Linkify string={team.bio} user={user} hasTwitLinks />
            </div>
          ) : null}
          <div className={teamProfile['team-profile__attributes']}>
            <Attribute
              icon={'/sprites.svg#icon-map-pin'}
              text={`${team.city}, ${team.state}`}
            />
            <Attribute
              icon={'/sprites.svg#icon-home'}
              text={`Joined ${TwitDate.localeDateStringShort(team.created_at)}`}
            />
          </div>
          <div className={teamProfile['team-profile__counts']}>
            <Count
              href={`/teams/${team.abbrev.substring(1)}/players`}
              value={team.players}
              text="Players"
            />
            <Count
              href={`/teams/${team.abbrev.substring(1)}/followers`}
              value={team.followers}
              text="Followers"
            />
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

export default TeamProfile;
