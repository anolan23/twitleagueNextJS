import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import useUser from "../../../../lib/useUser";
import divisionsStyle from "../../../../sass/pages/Divisions.module.scss";
import {
  updateSeasonTeamById,
  createDivision,
  divisionDelete,
  startSeason,
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
import Prompt from "../../../../components/modals/Prompt";

function Divisions({ leagueData }) {
  const { user } = useUser();
  const router = useRouter();
  const [seasonTeam, setSeasonTeam] = useState(null);
  const [showStartSeasonPrompt, setShowStartSeasonPrompt] = useState(false);

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
  let { season_teams, divisions, season_id, id, league_name, owner_id } =
    league;

  season_teams = season_teams || [];
  divisions = divisions || [];

  async function startNewSeason() {
    const season = await startSeason(id);
    setShowStartSeasonPrompt(false);
  }

  function renderUnassignedTeams() {
    if (!season_teams) {
      return <TwitSpinner size={30} />;
    } else if (season_teams.length === 0) {
      return null;
    } else {
      let unassignedTeams = season_teams.filter(
        (team) => team.division_id === null
      );
      return (
        <Division
          division={{}}
          team={seasonTeam}
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
        let divisionTeams = season_teams.filter(
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
            team={seasonTeam}
            teams={divisionTeams}
            onTeamClick={onTeamClick}
            onDivisionClick={() => onDivisionClick(division)}
            onDelete={() => deleteDivision(division)}
            editable={user ? user.id === owner_id : false}
          />
        );
      });
    }
  }

  function renderMessage() {
    console.log(season_id);
    if (!season_id) {
      return (
        <Empty
          main="Notice"
          sub="A season must be started before you can assign teams to divisions"
          onActionClick={() => setShowStartSeasonPrompt(true)}
          actionText="Start season"
        />
      );
    } else {
      return (
        <Empty
          main="Notice"
          sub="Teams that join a league midseason will not be displayed"
        />
      );
    }
  }

  function onTeamClick(clickedTeam) {
    if (seasonTeam) {
      setSeasonTeam(null);
    } else {
      setSeasonTeam(clickedTeam);
    }
  }

  async function onDivisionClick(clickedDivision) {
    if (!seasonTeam) {
      setSeasonTeam(null);
      return;
    } else {
      const updatedTeam = await updateSeasonTeamById(seasonTeam.id, {
        division_id: clickedDivision.id,
      });
      let updatedTeams = [...season_teams];
      const index = updatedTeams.findIndex(
        (team) => team.id === updatedTeam.id
      );
      if (index === -1) {
      } else {
        updatedTeams[index] = updatedTeam;
      }
      mutateLeague({ ...league, season_teams: updatedTeams }, false);
      setSeasonTeam(null);
    }
  }

  async function create() {
    try {
      const division = await createDivision(id, season_id);
      let updatedDivisions = [...divisions, division];
      mutateLeague({ ...league, divisions: updatedDivisions }, false);
    } catch (error) {
      console.log(error);
    }
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
          <TopBar main={league_name} sub="Divisions">
            <TwitButton color="primary" onClick={create} hide={!season_id}>
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
      <Prompt
        show={showStartSeasonPrompt}
        onHide={() => setShowStartSeasonPrompt(false)}
        main="Start season"
        sub={`This will start a new season for ${league_name}`}
        secondaryActionText="Cancel"
        primaryActionText="Continue"
        onSecondaryActionClick={() => setShowStartSeasonPrompt(false)}
        onPrimaryActionClick={startNewSeason}
      />
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
