import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import useUser from "../../../../lib/useUser";
import divisionsStyle from "../../../../sass/pages/Divisions.module.scss";
import {
  updateTeamById,
  createDivision,
  divisionDelete,
} from "../../../../actions";
import Leagues from "../../../../db/repos/Leagues";
import { getSeasonString } from "../../../../lib/twit-helpers";
import TopBar from "../../../../components/TopBar";
import Division from "../../../../components/Division";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitSpinner from "../../../../components/TwitSpinner";
import Empty from "../../../../components/Empty";
import TwitButton from "../../../../components/TwitButton";
import backend from "../../../../lib/backend";

function Divisions({ leagueData }) {
  const { user } = useUser();
  const router = useRouter();
  const [team, setTeam] = useState(null);

  const fetcher = async (url) => {
    const response = await backend.get(url);
    return response.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    leagueData ? `/api/leagues/${leagueData.league_name}` : null,
    fetcher,
    {
      initialData: leagueData,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  if (router.isFallback) {
    return <TwitSpinner size={50} />;
  }
  const { teams, divisions } = league;

  function renderUnassignedTeams() {
    if (!teams) {
      return <TwitSpinner size={30} />;
    } else if (teams.length === 0) {
      return null;
    } else {
      let unassignedTeams = teams.filter((team) => team.division_id === null);
      return (
        <Division
          division={{}}
          team={team}
          teams={unassignedTeams}
          onTeamClick={onTeamClick}
        />
      );
    }
  }

  function renderDivisions() {
    if (!divisions) {
      return null;
    } else if (divisions.length === 0) {
      return null;
    } else {
      return divisions.map((division, index) => {
        let divisionTeams = teams.filter(
          (team) => team.division_id === division.id
        );
        divisionTeams = divisionTeams.sort((a, b) =>
          a.team_name > b.team_name ? 1 : b.team_name > a.team_name ? -1 : 0
        );
        return (
          <Division
            key={index}
            league={league}
            division={division}
            team={team}
            teams={divisionTeams}
            onTeamClick={onTeamClick}
            onDivisionClick={() => onDivisionClick(division)}
            onDelete={() => deleteDivision(division)}
            editable={user ? user.id === league.owner_id : false}
          />
        );
      });
    }
  }

  function renderMessage() {
    const assignedToDivisions = teams.every(
      (team) => team.division_id !== null
    );
    if (assignedToDivisions) {
      return null;
    } else {
      return (
        <Empty
          main="Assign teams"
          sub="All teams must be assigned to a division before starting a new season"
        />
      );
    }
  }

  function onTeamClick(clickedTeam) {
    if (team) {
      setTeam(null);
    } else {
      setTeam(clickedTeam);
    }
  }

  async function onDivisionClick(clickedDivision) {
    if (!team) {
      setTeam(null);
      return;
    } else {
      const updatedTeam = await updateTeamById(team.id, {
        division_id: clickedDivision.id,
      });
      let updatedTeams = [...teams];
      const index = updatedTeams.findIndex(
        (team) => team.id === updatedTeam.id
      );
      if (index === -1) {
      } else {
        updatedTeams[index] = updatedTeam;
      }
      mutateLeague({ ...league, teams: updatedTeams }, false);
      setTeam(null);
    }
  }

  async function create() {
    const division = await createDivision(league.id, league.season_id);
    let updatedDivisions = divisions ? [...divisions] : [];
    updatedDivisions.push(division);
    mutateLeague({ ...league, divisions: updatedDivisions }, false);
  }

  async function deleteDivision(division) {
    await divisionDelete(division.id);
    mutateLeague();
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <TopBar main={`${league.league_name} Divisions`}>
            <TwitButton color="primary" onClick={create}>
              New division
            </TwitButton>
          </TopBar>
          <div className={divisionsStyle["division"]}>
            {renderMessage()}
            {renderUnassignedTeams()}
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

export default Divisions;
