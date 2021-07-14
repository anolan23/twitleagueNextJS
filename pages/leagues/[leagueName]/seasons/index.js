import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import seasonsStyle from "../../../../sass/components/Seasons.module.scss";
import { getSeasonString } from "../../../../lib/twit-helpers";
import TwitDate from "../../../../lib/twit-date";
import Leagues from "../../../../db/repos/Leagues";
import {} from "../../../../actions";
import useUser from "../../../../lib/useUser";
import TopBar from "../../../../components/TopBar";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitSpinner from "../../../../components/TwitSpinner";
import Empty from "../../../../components/Empty";

function Seasons({ league }) {
  const router = useRouter();
  const { user } = useUser();

  if (router.isFallback) {
    return <TwitSpinner size={50} />;
  }

  function renderSeasons() {
    if (!league.seasons) {
      return (
        <Empty
          main="Empty"
          sub={`${league.league_name} hasn't played a season`}
        />
      );
    } else {
      return league.seasons.map((season) => {
        return (
          <div
            className={seasonsStyle["seasons__item"]}
            onClick={() =>
              router.push(`/leagues/${league.league_name}/seasons/${season.id}`)
            }
          >
            {getSeasonString(season, league.seasons)}
            <span className={seasonsStyle["seasons__item__sub"]}>
              {`${TwitDate.localeDateString(season.created_at)} - ${
                season.end_date
                  ? TwitDate.localeDateString(season.end_date)
                  : "Today"
              }`}
            </span>
          </div>
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
          <div className={seasonsStyle["league"]}>
            <TopBar main="Seasons"></TopBar>
            {renderSeasons()}
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

export default Seasons;
