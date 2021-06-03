import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import useUser from "../../lib/useUser";
import { updateTeamById, createDivision } from "../../actions";
import backend from "../../lib/backend";
import editDivisionsPopup from "../../sass/components/EditDivisionsPopup.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import StandingsDivision from "../StandingsDivision";
import useSWR from "swr";
import TwitSpinner from "../TwitSpinner";

function EditDivisionsPopup({ league, show, onHide }) {
  if (!show) {
    return null;
  }
  const { user } = useUser();
  const [team, setTeam] = useState(null);
  const [unassignedTeams, setUnassignedTeams] = useState(null);

  const { data: standings, mutate: mutateStandings } = useSWR(
    league ? `/api/leagues/${league.league_name}/standings` : null,
    fetcher,
    { revalidateOnMount: true }
  );

  useEffect(() => {
    getUnassignedTeams();
  }, [standings]);

  async function fetcher(url) {
    const response = await backend.get(url);
    return response.data;
  }

  const getUnassignedTeams = async () => {
    if (league) {
      const teams = await backend.get(
        `/api/leagues/${league.league_name}/teams`
      );
      filterTeams(teams.data);
    }
  };

  const filterTeams = (teams) => {
    const filteredTeams = teams.filter((team) => team.division_id === null);
    setUnassignedTeams(filteredTeams);
  };

  const formik = useFormik({
    initialValues: {
      type: "game",
      opponent: null,
      location: null,
      eventDate: null,
      notes: null,
      isHomeTeam: null,
    },
    onSubmit: (values) => {},
  });

  const create = async () => {
    await createDivision(league.id);
    mutateStandings();
  };

  const onTeamClick = (clickedTeam) => {
    if (team) {
      setTeam(null);
    } else {
      setTeam(clickedTeam);
    }
  };

  const onDivisionClick = async (clickedDivision, index) => {
    if (!team) {
      setTeam(null);
      return;
    } else {
      await updateTeamById(team.id, {
        division_id: clickedDivision.division.id,
      });
      mutateStandings();
      setTeam(null);
    }
  };

  const onDelete = async () => {
    mutateStandings();
  };

  const renderHeading = () => {
    return (
      <div className={editDivisionsPopup["edit-divisions-popup__heading"]}>
        <h1
          className={editDivisionsPopup["edit-divisions-popup__heading__title"]}
        >
          Divisions
        </h1>
        <div
          className={
            editDivisionsPopup["edit-divisions-popup__heading__actions"]
          }
        >
          <TwitButton onClick={create} color="primary">
            Create
          </TwitButton>
        </div>
      </div>
    );
  };

  const renderUnassignedTeams = () => {
    if (!unassignedTeams) {
      return null;
    } else if (unassignedTeams.length === 0) {
      return null;
    }
    return (
      <StandingsDivision
        division={{ division_name: "Unassigned teams", teams: unassignedTeams }}
        onTeamClick={onTeamClick}
        team={team}
        onDivisionClick={null}
      />
    );
  };

  const renderDivisions = () => {
    if (!standings) {
      return <TwitSpinner />;
    } else if (standings.length === 0) {
      return null;
    } else {
      return standings.map((division, index) => {
        return (
          <StandingsDivision
            key={index}
            division={division}
            onTeamClick={onTeamClick}
            team={team}
            onDivisionClick={() => onDivisionClick(division, index)}
            onDelete={onDelete}
            editable={user.id === league.owner_id}
          />
        );
      });
    }
  };

  const renderBody = () => {
    return (
      <div className={editDivisionsPopup["edit-divisions-popup__body"]}>
        {renderUnassignedTeams()}
        {renderDivisions()}
      </div>
    );
  };

  return (
    <Popup
      show={show}
      heading={renderHeading()}
      body={renderBody()}
      onHide={onHide}
    />
  );
}

export default EditDivisionsPopup;
