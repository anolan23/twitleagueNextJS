import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import divisionsStyle from "../../../../sass/pages/Divisions.module.scss";
import { getStandings } from "../../../../actions";
import Leagues from "../../../../db/repos/Leagues";
import { getSeasonString } from "../../../../lib/twit-helpers";
import TopBar from "../../../../components/TopBar";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitSpinner from "../../../../components/TwitSpinner";
import Empty from "../../../../components/Empty";

function Divisions({ leagueData }) {
  const router = useRouter();

  const fetcher = async (url) => {
    const response = await backend.get(url);
    return response.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    leagueData ? `/api/leagues/${leagueData.league_name}` : null,
    fetcher,
    { initialData: leagueData, revalidateOnMount: true }
  );

  if (router.isFallback) {
    return <TwitSpinner size={50} />;
  }
  const { teams } = league;

  let divisions = teams.reduce(function (r, a) {
    r[a.division_id] = r[a.division_id] || [];
    r[a.division_id].push(a);
    r[a.division_id].sort((a, b) =>
      a.team_name > b.team_name ? 1 : b.team_name > a.team_name ? -1 : 0
    );

    return r;
  }, Object.create(null));
  divisions = Object.values(divisions);
  console.log(divisions);

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <TopBar main={`${league.league_name} Divisions`}></TopBar>
          <div className={divisionsStyle["division"]}></div>
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

export default Divisions;
