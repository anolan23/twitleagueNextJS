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
import backend from "../../../../lib/backend";

function Standings({ leagueData }) {
  const router = useRouter();
  const { user } = useUser();
  const [standings, setStandings] = useState({});

  const fetcher = async (url) => {
    const response = await backend.get(url);
    return response.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    leagueData ? `/api/leagues/${leagueData.league_name}` : null,
    fetcher,
    { initialData: leagueData, revalidateOnMount: true }
  );

  useEffect(async () => {
    if (!router.isReady) {
      return;
    }
    const { leagueName, seasonId } = router.query;
    const standings = await getStandings(leagueName, seasonId);
    setStandings(standings);
  }, [router.query]);

  if (router.isFallback) {
    return <TwitSpinner size={50} />;
  }

  const { divisions, teams } = standings;

  const options = () => {
    if (!league) {
      return [];
    } else if (!league.seasons) {
      return [];
    }
    return league.seasons.map((season) => {
      return { id: season.id, text: getSeasonString(season, league.seasons) };
    });
  };

  function renderDivisions() {
    if (!divisions) {
      return null;
    } else {
      return divisions.map((division, index) => {
        let divisionTeams = teams.filter(
          (team) => team.division_id === division.id
        );
        divisionTeams = divisionTeams.sort((a, b) =>
          a.place > b.place ? 1 : b.place > a.place ? -1 : 0
        );
        return (
          <Division key={index} division={division} teams={divisionTeams} />
        );
      });
    }
  }
  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={standingsStyle["league"]}>
            <TopBar main="Standings"></TopBar>
            <TwitSelect
              options={options()}
              defaultValue="2019"
              onSelect={(seasonId) => router.push({ query: { seasonId } })}
            />
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
