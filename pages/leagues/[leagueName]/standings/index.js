import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import standingsStyle from "../../../../sass/pages/Standings.module.scss";
import { getStandings } from "../../../../actions";
import Leagues from "../../../../db/repos/Leagues";
import { getSeasonString } from "../../../../lib/twit-helpers";
import useUser from "../../../../lib/useUser";
import TopBar from "../../../../components/TopBar";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitSpinner from "../../../../components/TwitSpinner";
import Empty from "../../../../components/Empty";
import Division from "../../../../components/Division";
import TwitSelect from "../../../../components/TwitSelect";
import TwitInput from "../../../../components/TwitInput";
import backend from "../../../../lib/backend";

function Standings({ leagueData }) {
  const router = useRouter();
  const { query, isFallback, isReady } = router;
  const { leagueName, seasonId } = query;

  const { user } = useUser();
  const [standings, setStandings] = useState({});
  const { divisions, teams } = standings;
  const [seasonOption, setSeasonOption] = useState("");

  const fetcher = async (url) => {
    const response = await backend.get(url);
    return response.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    leagueData ? `/api/leagues/${leagueData.league_name}` : null,
    fetcher,
    { initialData: leagueData, revalidateOnMount: true }
  );

  useEffect(() => {
    if (!isReady || isFallback) {
      return;
    }
    changeSeason(seasonId);
  }, [isReady, isFallback]);

  function onSeasonChange(event) {
    const seasonId = event.target.value;
    router.replace({ query: { seasonId } }, undefined, {
      shallow: true,
      scroll: false,
    });
    changeSeason(seasonId);
  }

  async function changeSeason(seasonId) {
    if (!seasonId) {
      let { seasons } = league;
      seasons = seasons || [];
      const latestSeason = seasons[seasons.length - 1];
      if (!latestSeason) {
        setStandings({ divisions: [], teams: [] });
        return;
      }
      seasonId = latestSeason.id;
    }

    const standings = await getStandings(leagueName, seasonId);
    setStandings(standings);
    setSeasonOption(seasonId);
  }

  function renderSeasonOptions() {
    if (!league) return;
    if (!league.seasons) return;
    else {
      return league.seasons.map((season, index) => {
        const { id, created_at } = season;
        return (
          <option key={index} value={id}>
            {getSeasonString(season, league.seasons)}
          </option>
        );
      });
    }
  }

  function renderDivisions() {
    if (!divisions) {
      return <TwitSpinner size={30} />;
    } else if (divisions.length === 0) {
      return (
        <Empty
          main="No standings"
          sub="This league has no standings to display"
        />
      );
    } else {
      return divisions.map((division, index) => {
        let divisionTeams = teams.filter(
          (team) => team.division_id === division.id
        );
        divisionTeams = divisionTeams.sort((a, b) =>
          a.place > b.place ? 1 : b.place > a.place ? -1 : 0
        );
        return (
          <Division
            key={index}
            division={division}
            teams={divisionTeams}
            onTeamClick={(team) =>
              router.push(`/teams/${team.abbrev.substring(1)}`)
            }
          />
        );
      });
    }
  }

  if (isFallback) {
    return <TwitSpinner size={50} />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={standingsStyle["standings"]}>
            <TopBar main={league.league_name} sub="Standings"></TopBar>
            <div className={standingsStyle["standings__filter"]}>
              <TwitInput select onChange={onSeasonChange} value={seasonOption}>
                {renderSeasonOptions()}
              </TwitInput>
            </div>

            {renderDivisions()}
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
  let leagueData = await Leagues.findOne(leagueName);

  leagueData = JSON.parse(JSON.stringify(leagueData));

  return {
    revalidate: 1,
    props: {
      leagueData,
    },
  };
}

export default Standings;
