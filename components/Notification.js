import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import reactStringReplace from 'react-string-replace';

import notificationStyle from '../sass/components/Notification.module.scss';
import TwitButton from './TwitButton';
import backend from '../lib/backend';
import { addPlayerToRoster } from '../actions';
import TwitItem from './TwitItem';

function Notification({ notification, onDelete }) {
  const router = useRouter();
  const { type, recipient, sender, team, league, event } = notification;

  async function onAcceptJoinLeagueRequestClick() {
    const response = await backend.patch('/api/teams', {
      teamId: team.id,
      columns: { league_id: league.id },
    });
    onDelete();
  }

  async function onAcceptJoinTeamInvite() {
    const player = await addPlayerToRoster({
      teamId: team.id,
      userId: recipient.id,
    });
    onDelete();
  }

  async function onAcceptUserRequestsJoinTeam() {
    const player = await addPlayerToRoster({
      teamId: team.id,
      userId: sender.id,
    });
    onDelete();
  }

  const renderNotification = () => {
    switch (type) {
      case 'Join League Request': {
        const text = `${team.abbrev}  wants to join ${league.league_name}`;
        const replacedText = reactStringReplace(
          text,
          /\$(\w+)/g,
          (match, i) => (
            <Link
              key={match + i}
              passHref
              href={`/teams/${team.abbrev.substring(1)}`}
              className="twit-link"
            >
              ${match}
            </Link>
          )
        );
        return (
          <TwitItem
            paragraph={replacedText}
            avatar={team.avatar}
            onClick={() => router.push(`/teams/${team.abbrev.substring(1)}`)}
          >
            <div className={notificationStyle['notification__actions']}>
              <TwitButton
                onClick={onAcceptJoinLeagueRequestClick}
                color="primary"
              >
                Accept
              </TwitButton>
              <TwitButton color="primary" outline="primary" onClick={onDelete}>
                Decline
              </TwitButton>
            </div>
          </TwitItem>
        );
      }
      case 'Join Team Invite': {
        const text = `${team.abbrev} wants you to play for their team`;
        const replacedText = reactStringReplace(
          text,
          /\$(\w+)/g,
          (match, i) => (
            <Link
              key={match + i}
              passHref
              href={`/teams/${team.abbrev.substring(1)}`}
              className="twit-link"
            >
              ${match}
            </Link>
          )
        );

        return (
          <TwitItem
            avatar={team.avatar}
            paragraph={replacedText}
            onClick={() => router.push(`/teams/${team.abbrev.substring(1)}`)}
          >
            <div className={notificationStyle['notification__actions']}>
              <TwitButton onClick={onAcceptJoinTeamInvite} color="primary">
                Accept
              </TwitButton>
              <TwitButton color="primary" outline="primary" onClick={onDelete}>
                Decline
              </TwitButton>
            </div>
          </TwitItem>
        );
      }
      case 'User Requests Join Team': {
        const text = `@${sender.username} wants to play for ${team.abbrev}`;
        let replacedText = reactStringReplace(text, /\@(\w+)/g, (match, i) => (
          <Link
            key={match + i}
            className="twit-link"
            href={`/users/${sender.username}`}
          >
            @{match}
          </Link>
        ));

        replacedText = reactStringReplace(
          replacedText,
          /\$(\w+)/g,
          (match, i) => (
            <Link
              key={match + i}
              className="twit-link"
              href={`/teams/${team.abbrev.substring(1)}`}
            >
              ${match}
            </Link>
          )
        );

        return (
          <TwitItem
            avatar={sender.avatar}
            paragraph={replacedText}
            onClick={() => router.push(`/users/${sender.username}`)}
          >
            <div className={notificationStyle['notification__actions']}>
              <TwitButton
                onClick={onAcceptUserRequestsJoinTeam}
                color="primary"
              >
                Accept
              </TwitButton>
              <TwitButton color="primary" outline="primary" onClick={onDelete}>
                Decline
              </TwitButton>
            </div>
          </TwitItem>
        );
      }
      case 'Awaiting Event Approval': {
        const { home_season_team, away_season_team } = event;
        const e = `${home_season_team.team_name} vs ${away_season_team.team_name} `;
        const text = `game has ended and is waiting for ${league.league_name} approval`;
        function renderText() {
          return (
            <div className={notificationStyle['notification__text']}>
              <Link className="twit-link" href={'/events/' + event.id}>
                {e}
              </Link>
              {text}
            </div>
          );
        }
        return (
          <TwitItem
            avatar={league.avatar}
            paragraph={renderText()}
            onClick={() => router.push(`/events/${event.id}`)}
          >
            <div className={notificationStyle['notification__actions']}>
              <TwitButton color="primary" outline="primary" onClick={onDelete}>
                Dismiss
              </TwitButton>
            </div>
          </TwitItem>
        );
      }

      default:
        return null;
    }
  };

  return <React.Fragment>{renderNotification()}</React.Fragment>;
}

export default Notification;
