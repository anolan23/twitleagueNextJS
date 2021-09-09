import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import scheduleStyle from "../../../../sass/pages/Schedule.module.scss";
import { getSchedule, getStandings } from "../../../../actions";
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
  const { leagueName, seasonTeamId, seasonId } = query;
  const { user } = useUser();
  const [events, setEvents] = useState(null);
  const [teams, setTeams] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [schedule, setSchedule] = useState(null);

  const [team, setTeamOption] = useState("");
  const [season, setSeasonOption] = useState("");

  useEffect(() => {
    if (isFallback || !isReady) return;
    start();
  }, [isFallback, isReady]);

  async function start() {
    if (!seasonTeamId) {
      changeSeason(seasonId);
    } else {
      let { teams, events, seasons } = await getSchedule(leagueName, seasonId);
      teams = teams || [];
      events = events || [];
      seasons = seasons || [];

      if (seasonId) {
        setSeasonOption(seasonId);
      } else {
        const latestSeason = seasons[seasons.length - 1];
        if (!latestSeason) return;
        setSeasonOption(latestSeason.id);
      }
      setTeamOption(seasonTeamId);
      setTeams(teams);
      setEvents(events);
      setSeasons(seasons);

      filterEvents(seasonTeamId, events, teams);
    }
  }

  async function changeSeason(seasonId) {
    let { teams, events, seasons } = await getSchedule(leagueName, seasonId);
    teams = teams || [];
    events = events || [];
    seasons = seasons || [];

    if (seasonId) {
      setSeasonOption(seasonId);
    } else {
      console.log(seasons);
      const latestSeason = seasons[seasons.length - 1];
      if (!latestSeason) return;
      setSeasonOption(latestSeason.id);
    }
    setTeams(teams);
    setEvents(events);
    setSeasons(seasons);
    const firstTeam = teams[0];
    if (!firstTeam) {
      setSchedule([]);
      return;
    } else {
      setTeamOption(firstTeam.id);
      filterEvents(firstTeam.id, events, teams);
    }
  }

  function filterEvents(seasonTeamId, events, teams) {
    if (!events.length || !teams.length) {
      setSchedule([]);
      return;
    }
    if (!seasonTeamId) {
      const firstTeam = teams[0];
      if (!firstTeam) {
        setSchedule([]);
        return;
      } else {
        seasonTeamId = firstTeam.id;
      }
    }

    const schedule = events.filter((event) => {
      const { home_team, away_team } = event;
      return seasonTeamId == home_team.id || seasonTeamId == away_team.id;
    });
    console.log(schedule);
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
    setTeamOption(seasonTeamId);
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
          <th className={scheduleStyle["schedule__table__column__date"]}>
            Date
          </th>
          <th className={scheduleStyle["schedule__table__column__opponent"]}>
            Opponent
          </th>
          <th className={scheduleStyle["schedule__table__column__score"]}>
            Score
          </th>
        </tr>
      </thead>
    );
  };

  function renderTable() {
    if (!schedule) return <TwitSpinner size={30} />;
    if (schedule.length == 0) {
      return <Empty main="No events" sub="No events have been scheduled" />;
    } else {
      return (
        <table>
          {renderHead()}
          <tbody>{renderSchedule()}</tbody>
        </table>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={scheduleStyle["schedule"]}>
            <TopBar main={league_name} sub="Schedule"></TopBar>
            <form className={scheduleStyle["schedule__filter"]}>
              <TwitInput select onChange={onSeasonChange} value={season}>
                {renderSeasonOptions()}
              </TwitInput>
              <TwitInput select onChange={onTeamChange} value={team}>
                {renderTeamOptions()}
              </TwitInput>
            </form>
            {renderTable()}
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
