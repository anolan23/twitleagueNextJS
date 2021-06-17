import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import { createEvent } from "../../actions";
import editEventsPopup from "../../sass/components/EditEventsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";

function EditEventsPopup({ show, team, onHide }) {
  if (!show) {
    return null;
  }
  let opponents = team.league.teams.filter((element) => element.id !== team.id);
  const formik = useFormik({
    initialValues: {
      type: "game",
      opponent: opponents.length > 0 ? opponents[0].id : "",
      location: "",
      eventDate: "",
      notes: "",
      isHomeTeam: false,
    },
    onSubmit: (values) => {
      const event = {
        ...values,
        teamId: team.id,
        seasonId: team.current_season.id,
      };
      createEvent(event);
    },
  });

  // useEffect(() => {
  //   formik.resetForm(formik.initialValues);
  // }, []);

  const renderOpponentOptions = () => {
    if (!opponents) {
      return;
    } else {
      return opponents.map((opponent, index) => {
        return (
          <option
            key={index}
            value={opponent.id}
          >{`${opponent.abbrev} - ${opponent.team_name}`}</option>
        );
      });
    }
  };

  const renderHeading = () => {
    return (
      <div className={editEventsPopup["edit-events-popup__heading"]}>
        <h1 className={editEventsPopup["edit-events-popup__heading__title"]}>
          Create event
        </h1>
        <div className={editEventsPopup["edit-events-popup__heading__actions"]}>
          <TwitButton form="add-event-form" color="primary">
            Save
          </TwitButton>
        </div>
      </div>
    );
  };

  console.log(formik.values);

  const renderOpponentInput = () => {
    if (formik.values.type === "game") {
      return (
        <React.Fragment>
          <TwitInputGroup labelText="Opponent">
            <TwitInput
              select
              id="opponent"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.opponent}
              name="opponent"
              type="text"
            >
              {renderOpponentOptions()}
            </TwitInput>
          </TwitInputGroup>
          <TwitInputGroup labelText="Are you the home team?">
            <TwitInput
              id="isHomeTeam"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.isHomeTeam}
              name="isHomeTeam"
              type="checkbox"
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
            id="eventDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.eventDate}
            name="eventDate"
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
    />
  );
}

export default EditEventsPopup;
