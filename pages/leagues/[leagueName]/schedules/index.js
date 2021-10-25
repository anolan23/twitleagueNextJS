import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import scheduleStyle from "../../../../sass/pages/Schedule.module.scss";
import { getSchedules, getStandings } from "../../../../actions";
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
import Schedule from "../../../../components/Schedule";

function SchedulePage({ league }) {
  const router = useRouter();
  const { isFallback, isReady, query } = router;
  const { leagueName, seasonTeamId, seasonId } = query;
  const { user } = useUser();
  const [events, setEvents] = useState(null);
  const [teams, setTeams] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [schedule, setSchedule] = useState(null);

  const [teamOption, setTeamOption] = useState("");
  const [seasonOption, setSeasonOption] = useState("");

  useEffect(() => {
    if (isFallback || !isReady) return;
    changeSeason(seasonId, seasonTeamId);
  }, [isFallback, isReady]);

  async function changeSeason(seasonId, seasonTeamId) {
    let { teams, events, seasons } = await getSchedules(leagueName, seasonId);
    teams = teams || [];
    events = events || [];
    seasons = seasons || [];

    if (seasonId) {
      setSeasonOption(seasonId);
    } else {
      const latestSeason = seasons[seasons.length - 1];
      if (!latestSeason) {
        setSchedule([]);
        return;
      }
      setSeasonOption(latestSeason.id);
    }

    if (seasonTeamId) {
      setTeamOption(seasonTeamId);
      filterEvents(seasonTeamId, events, teams);
    } else {
      const firstTeam = teams[0];
      if (!firstTeam) {
        setSchedule([]);
        return;
      } else {
        setTeamOption(firstTeam.id);
        filterEvents(firstTeam.id, events, teams);
      }
    }

    setTeams(teams);
    setEvents(events);
    setSeasons(seasons);
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
    setSchedule(schedule);
  }

  function onSeasonChange(event) {
    const seasonId = event.target.value;
    router.replace({ query: { seasonId } }, undefined, {
      shallow: true,
      scroll: false,
    });
    changeSeason(seasonId, undefined);
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

  function renderSeasonOptions() {
    if (!seasons) return null;
    else if (!seasons.length) return null;
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
    else if (!teams.length) return null;
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

  function renderSchedule() {
    if (!schedule) return <TwitSpinner size={30} />;
    else if (!schedule.length) {
      return (
        <Empty
          main="No events"
          sub={`An event has yet to be scheduled for this team during for this season`}
        />
      );
    } else return <Schedule events={schedule} seasonTeamId={teamOption} />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={scheduleStyle["schedule"]}>
            <TopBar main={league_name} sub="Schedules"></TopBar>
            <form className={scheduleStyle["schedule__filter"]}>
              <TwitInput select onChange={onSeasonChange} value={seasonOption}>
                {renderSeasonOptions()}
              </TwitInput>
              <TwitInput select onChange={onTeamChange} value={teamOption}>
                {renderTeamOptions()}
              </TwitInput>
            </form>
            {renderSchedule()}
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

export default SchedulePage;
