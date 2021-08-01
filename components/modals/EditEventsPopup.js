import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import { createEvent } from "../../actions";
import editEventsPopup from "../../sass/components/EditEventsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import TwitItemSelect from "../TwitItemSelect";

function EditEventsPopup({ show, homeTeam, awayTeam, league, onHide }) {
  if (!show) {
    return null;
  }
  // let teams = team.league.teams.filter((element) => element.id !== team.id);
  const { current_season_teams } = league;

  console.log(league);

  const formik = useFormik({
    initialValues: {
      type: "game",
      homeTeamId: homeTeam ? homeTeam.id : "",
      awayTeamId: awayTeam ? awayTeam.id : "",
      location: "",
      date: "",
      notes: "",
    },
    onSubmit: async (values) => {
      const event = {
        ...values,
        seasonId: league.season_id,
      };
      await createEvent(event);
      onHide();
    },
  });

  const getOptions = () => {
    if (!current_season_teams) {
      return [];
    } else {
      return current_season_teams.map((team) => {
        return { ...team, title: team.team_name, subtitle: team.abbrev };
      });
    }
  };

  const onHomeTeamSelect = (option) => {
    formik.setFieldValue("homeTeamId", option.id);
  };

  const onAwayTeamSelect = (option) => {
    formik.setFieldValue("awayTeamId", option.id);
  };

  const renderHeading = () => {
    return (
      <div className={editEventsPopup["edit-events-popup__heading"]}>
        <div className={editEventsPopup["edit-events-popup__heading__actions"]}>
          <TwitButton form="add-event-form" color="primary">
            Save
          </TwitButton>
        </div>
      </div>
    );
  };

  const renderOpponentInput = () => {
    const options = getOptions();
    if (formik.values.type === "game") {
      return (
        <React.Fragment>
          <TwitInputGroup labelText="Home team">
            <TwitItemSelect
              options={options}
              defaultValue={
                homeTeam
                  ? {
                      ...homeTeam,
                      title: homeTeam.team_name,
                      subtitle: homeTeam.abbrev,
                    }
                  : null
              }
              onSelect={onHomeTeamSelect}
            />
          </TwitInputGroup>
          <TwitInputGroup labelText="Away team">
            <TwitItemSelect
              options={options}
              defaultValue={
                awayTeam
                  ? {
                      ...awayTeam,
                      title: awayTeam.team_name,
                      subtitle: awayTeam.abbrev,
                    }
                  : null
              }
              onSelect={onAwayTeamSelect}
            />
          </TwitInputGroup>
        </React.Fragment>
      );
    } else {
      return;
    }
  };

  const renderContent = () => {
    return (
      <form
        id="add-event-form"
        onSubmit={formik.handleSubmit}
        className={twitForm["twit-form"]}
      >
        <TwitInputGroup labelText="Event type">
          <TwitInput
            select
            id="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.type}
            name="type"
            type="select"
          >
            <option value="game">Game</option>
            <option value="practice">Practice</option>
            <option value="workout">Workout</option>
            <option value="meeting">Meeting</option>
            <option value="party">Party</option>
          </TwitInput>
        </TwitInputGroup>
        {renderOpponentInput()}
        <TwitInputGroup labelText="Event date">
          <TwitInput
            id="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date}
            name="date"
            type="datetime-local"
          />
        </TwitInputGroup>
        <TwitInputGroup labelText="Location">
          <TwitInput
            id="location"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.location}
            name="location"
            type="text"
          />
        </TwitInputGroup>
        <TwitInputGroup labelText="Notes">
          <TwitInput
            id="notes"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notes}
            name="notes"
            type="text-area"
          />
        </TwitInputGroup>
      </form>
    );
  };

  const renderBody = () => {
    return (
      <div className={editEventsPopup["edit-events-popup__body"]}>
        {renderContent()}
      </div>
    );
  };

  return (
    <Popup
      show={show}
      heading={renderHeading()}
      body={renderBody()}
      onHide={onHide}
      title="Schedule event"
    />
  );
}

export default EditEventsPopup;
