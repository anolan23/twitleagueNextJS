import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import scheduleStyle from "../../../../sass/pages/Schedule.module.scss";
import { getSeasonEvents, getStandings } from "../../../../actions";
import Leagues from "../../../../db/repos/Leagues";
import { getSeasonString } from "../../../../lib/twit-helpers";
import useUser from "../../../../lib/useUser";
import TopBar from "../../../../components/TopBar";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitSpinner from "../../../../components/TwitSpinner";
import Empty from "../../../../components/Empty";
import Event from "../../../../components/Event";
import ScheduleEvent from "../../../../components/ScheduleEvent";
import TwitInput from "../../../../components/TwitInput";

function Schedule({ league }) {
  const router = useRouter();
  const { isFallback, isReady, query } = router;
  const { seasonTeamId, seasonId } = query;
  const { user } = useUser();
  const [events, setEvents] = useState(null);
  const [teams, setTeams] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [schedule, setSchedule] = useState(null);

  const [team, setTeam] = useState("");
  const [season, setSeason] = useState("");

  useEffect(async () => {
    if (!isReady) return;
    if (!seasonTeamId) {
      changeSeason(seasonId);
    } else {
      if (!seasonId) return;
      setSeason(seasonId);
      setTeam(seasonTeamId);

      const { teams = [], events, seasons } = await getSeasonEvents(seasonId);
      setTeams(teams);
      setSeasons(seasons);
      setEvents(events);

      filterEvents(seasonTeamId, events, teams);
    }
  }, [isReady]);

  async function changeSeason(seasonId) {
    if (!seasonId) return;
    setSeason(seasonId);
    const { teams = [], events, seasons } = await getSeasonEvents(seasonId);
    setTeams(teams);
    setSeasons(seasons);
    setEvents(events);
    const firstTeam = teams[0];
    if (!firstTeam) return;
    else {
      setTeam(firstTeam.id);
      filterEvents(firstTeam.id, events, teams);
    }
  }

  function filterEvents(seasonTeamId, events, teams) {
    if (!events || !teams) {
      setSchedule(null);
      return;
    }
    if (!seasonTeamId) {
      teams = teams || [];
      const firstTeam = teams[0];
      if (!firstTeam) return;
      else {
        seasonTeamId = firstTeam.id;
      }
    }

    const schedule = events.filter((event) => {
      const { home_team, away_team } = event;
      return seasonTeamId == home_team.id || seasonTeamId == away_team.id;
    });
    setSchedule(schedule);
  }

  function onSeasonChange(event) {
    const seasonId = event.target.value;
    router.replace({ query: { seasonId } }, undefined, {
      shallow: true,
      scroll: false,
    });
    changeSeason(seasonId);
  }

  function onTeamChange(event) {
    const seasonTeamId = event.target.value;
    router.replace({ query: { seasonId, seasonTeamId } }, undefined, {
      shallow: true,
      scroll: false,
    });
    setTeam(seasonTeamId);
    filterEvents(seasonTeamId, events, teams);
  }

  if (isFallback) {
    return <TwitSpinner size={50} />;
  }

  const { league_name } = league;

  function renderSchedule() {
    if (!schedule) return null;
    else {
      return schedule.map((event, index) => {
        return <ScheduleEvent key={index} event={event} seasonTeamId={team} />;
      });
    }
  }

  function renderSeasonOptions() {
    if (!seasons) return null;
    else if (seasons.length === 0) return null;
    else {
      return seasons.map((season, index) => {
        const { id, created_at } = season;
        return (
          <option key={index} value={id}>
            {getSeasonString(season, seasons)}
          </option>
        );
      });
    }
  }

  function renderTeamOptions() {
    if (!teams) return null;
    else if (teams.length === 0) return null;
    else {
      return teams.map((team, index) => {
        const { id, team_name } = team;
        return (
          <option key={index} value={id}>
            {team_name}
          </option>
        );
      });
    }
  }

  const renderHead = () => {
    return (
      <thead>
        <tr>
          <th>Date</th>
          <th>Opponent</th>
          <th>Score</th>
        </tr>
      </thead>
    );
  };

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={scheduleStyle["schedule"]}>
            <TopBar main="Schedule" sub={league_name}></TopBar>
            <form className={scheduleStyle["schedule__filter"]}>
              <TwitInput select onChange={onSeasonChange} value={season}>
                {renderSeasonOptions()}
              </TwitInput>
              <TwitInput select onChange={onTeamChange} value={team}>
                {renderTeamOptions()}
              </TwitInput>
            </form>
            <table>
              {renderHead()}
              <tbody>{renderSchedule()}</tbody>
            </table>
          </div>
        </main>
        <div className="right-bar">
          <RightColumn></RightColumn>
        </div>
      </div>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { leagueName } = context.params;
  let league = await Leagues.findOne(leagueName);
  league = JSON.parse(JSON.stringify(league));

  return {
    revalidate: 1,
    props: {
      league,
    },
  };
}

export default Schedule;
