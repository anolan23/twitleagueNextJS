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
import Empty from "../Empty";

function EditDivisionsPopup({ league, show, onHide }) {
  const { user } = useUser();
  const [team, setTeam] = useState(null);
  const [unassignedTeams, setUnassignedTeams] = useState(null);

  async function fetcher(url) {
    const response = await backend.get(url, {
      params: { seasonId: league.season_id },
    });
    if (response.statusText !== "OK") {
      const error = new Error("An error occurred while fetching the data.");
      // Attach extra info to the error object.
      error.info = await response.data;
      error.status = response.status;
      throw error;
    }
    return response.data;
  }

  const {
    data: format,
    mutate: mutateFormat,
    error: swrError,
  } = useSWR(
    league ? `/api/leagues/${league.league_name}/format` : null,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  useEffect(() => {
    if (league.teams) {
      filterTeams(league.teams);
    }
  }, []);

  function filterTeams(teams) {
    const filteredTeams = teams.filter((team) => team.division_id === null);
    setUnassignedTeams(filteredTeams);
  }

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
    await createDivision(league.id, league.season_id);
    mutateFormat();
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
      const teamUpdated = await updateTeamById(team.id, {
        division_id: clickedDivision.id,
      });
      await mutateFormat();
      if (teamUpdated && !swrError) {
        let newUnassignedTeams = [...unassignedTeams];
        newUnassignedTeams = newUnassignedTeams.filter(
          (_team) => _team.id !== team.id
        );
        setUnassignedTeams(newUnassignedTeams);
      }
      setTeam(null);
    }
  };

  const onDelete = async () => {
    mutateFormat();
  };

  const renderHeading = () => {
    return (
      <div className={editDivisionsPopup["edit-divisions-popup__heading"]}>
        <div
          className={
            editDivisionsPopup["edit-divisions-popup__heading__actions"]
          }
        >
          <TwitButton
            onClick={create}
            color="primary"
            disabled={league.season_id}
          >
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
    if (!format) {
      return <TwitSpinner size={50} />;
    } else if (format.length === 0) {
      return null;
    } else {
      return format.map((division, index) => {
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
    if (!league.teams) {
      return (
        <Empty
          main="No teams"
          sub={`${league.league_name} has no teams`}
          actionText="Post now"
        />
      );
    } else {
      return (
        <div className={editDivisionsPopup["edit-divisions-popup__body"]}>
          {renderUnassignedTeams()}
          {renderDivisions()}
        </div>
      );
    }
  };

  return (
    <Popup
      show={show}
      heading={renderHeading()}
      body={renderBody()}
      onHide={onHide}
      title="Divisions"
    />
  );
}

export default EditDivisionsPopup;
