import React, { useState, useEffect } from "react";
import Head from "next/head";
import { connect } from "react-redux";

import { findTeamsByUsername } from "../actions";
import MainBody from "../components/MainBody";
import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "../components/TwitButton";
import TopBar from "../components/TopBar";
import TwitItem from "../components/TwitItem";
import Empty from "../components/Empty";
import useUser from "../lib/useUser";
import TwitSpinner from "../components/TwitSpinner";

function MyTeams() {
  const { user } = useUser({ redirectTo: "/" });
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    start();
  }, [user]);

  const start = async () => {
    if (user === undefined || !user.isSignedIn) {
      return;
    } else {
      const teams = await findTeamsByUsername(user.username);
      setTeams(teams);
    }
  };

  const renderTeams = () => {
    if (teams === null) {
      return <TwitSpinner />;
    } else if (teams.length === 0) {
      return (
        <Empty main="No teams" sub="The teams that you create will go here" />
      );
    } else {
      return teams.map((team, index) => {
        return (
          <TwitItem
            key={index}
            avatar={team.avatar}
            title={`${team.team_name}`}
            subtitle={`${team.abbrev} · ${
              team.league_name ? team.league_name : "awaiting league approval"
            }`}
            href={`/teams/${team.abbrev.substring(1)}`}
          />
        );
      });
    }
  };

  if (!user || !user.isSignedIn) {
    return <TwitSpinner />;
  }

  return (
    <React.Fragment>
      <MainBody>
        <div className={myTeams["my-teams"]}>
          <TopBar main="My Teams">
            <TwitButton href="/create/team" color="primary">
              Create team
            </TwitButton>
          </TopBar>
          {renderTeams()}
        </div>
      </MainBody>
    </React.Fragment>
  );
}

export default MyTeams;
