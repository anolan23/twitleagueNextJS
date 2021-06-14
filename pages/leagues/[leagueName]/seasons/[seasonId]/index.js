import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import seasonStyle from "../../../../../sass/components/Season.module.scss";
import SeasonsRepo from "../../../../../db/repos/Seasons";
import {} from "../../../../../actions";
import useUser from "../../../../../lib/useUser";
import TopBar from "../../../../../components/TopBar";
import LeftColumn from "../../../../../components/LeftColumn";
import RightColumn from "../../../../../components/RightColumn";
import TwitSpinner from "../../../../../components/TwitSpinner";
import Empty from "../../../../../components/Empty";

function Season({ season, seasonId }) {
  const router = useRouter();
  const { user } = useUser();
  console.log(season);

  if (router.isFallback) {
    return <TwitSpinner />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={seasonStyle["league"]}>
            <TopBar main={`Season ${seasonId}`}></TopBar>
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
  const { seasonId } = context.params;

  let season = await SeasonsRepo.findById(seasonId);
  season = JSON.parse(JSON.stringify(season));

  return {
    revalidate: 1,
    props: {
      season,
      seasonId,
    },
  };
}

export default Season;
