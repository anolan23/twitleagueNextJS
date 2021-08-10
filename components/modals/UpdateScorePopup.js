import React, { useEffect, useState } from "react";

import { useFormik } from "formik";

import Popup from "./Popup";
import Avatar from "../Avatar";
import TwitButton from "../TwitButton";
import { updateEvent, sendNotification } from "../../actions";
import updateScorePopup from "../../sass/components/UpdateScorePopup.module.scss";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import TwitSpinner from "../TwitSpinner";

function UpdateScorePopup({ show, onHide, event }) {
  const {
    id,
    home_team_points,
    away_team_points,
    play_period,
    season,
    home_season_team,
    away_season_team,
  } = event;
  const { league } = season;
  useEffect(() => {
    formik.setFieldValue(
      "home_team_points",
      home_team_points ? home_team_points : 0
    );
    formik.setFieldValue(
      "away_team_points",
      away_team_points ? away_team_points : 0
    );
    formik.setFieldValue("play_period", play_period ? play_period : "");
  }, [id]);

  const formik = useFormik({
    initialValues: {
      home_team_points,
      away_team_points,
      play_period,
    },
    onSubmit: async (values) => {
      if (values.play_period === "Final") {
        updateEvent(id, values);

        const notification = {
          type: "Awaiting Event Approval",
          user_id: league.owner_id,
          sender_id: null,
          team_id: null,
          league_id: league.id,
          event_id: id,
        };
        await sendNotification(notification);
      } else {
        updateEvent(id, values);
      }
    },
  });

  const renderHeading = () => {
    return (
      <div className={updateScorePopup["update-score-popup__heading"]}>
        <TwitButton form="update-score-form" color="primary">
          Update
        </TwitButton>
      </div>
    );
  };

  const renderBody = () => {
    if (!event) {
      return <TwitSpinner size={50} />;
    } else {
      return (
        <form
          className={updateScorePopup["update-score-popup"]}
          id="update-score-form"
          onSubmit={formik.handleSubmit}
        >
          <div className={updateScorePopup["update-score-popup__teams"]}>
            <div
              className={updateScorePopup["update-score-popup__teams__team"]}
            >
              <Avatar
                className={
                  updateScorePopup["update-score-popup__teams__team__avatar"]
                }
                src={home_season_team.avatar}
              />
              <span
                className={
                  updateScorePopup["update-score-popup__teams__team__name"]
                }
              >
                {home_season_team.team_name}
              </span>
            </div>
            <div
              className={updateScorePopup["update-score-popup__teams__score"]}
            >
              <input
                className={
                  updateScorePopup["update-score-popup__teams__score__points"]
                }
                type="number"
                min={0}
                max={999}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="home_team_points"
                id="home_team_points"
                value={formik.values.home_team_points}
              />
              <span
                className={
                  updateScorePopup["update-score-popup__teams__score__dash"]
                }
              >
                -
              </span>
              <input
                className={
                  updateScorePopup["update-score-popup__teams__score__points"]
                }
                type="number"
                min={0}
                max={999}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="away_team_points"
                id="away_team_points"
                value={formik.values.away_team_points}
              />
            </div>
            <div
              className={updateScorePopup["update-score-popup__teams__team"]}
            >
              <Avatar
                className={
                  updateScorePopup["update-score-popup__teams__team__avatar"]
                }
                src={away_season_team.avatar}
              />
              <span
                className={
                  updateScorePopup["update-score-popup__teams__team__name"]
                }
              >
                {away_season_team.team_name}
              </span>
            </div>
          </div>
          <TwitInputGroup labelText="Play period">
            <TwitInput
              select
              value={formik.values.play_period}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="play_period"
              id="play_period"
            >
              <option defaultValue value={null}>
                Start
              </option>
              <option>1st Half</option>
              <option>1st Half</option>
              <option>2nd Half</option>
              <option>1st Quarter</option>
              <option>2nd Quarter</option>
              <option>3rd Quarter</option>
              <option>4th Quarter</option>
              <option>1st Period</option>
              <option>2nd Period</option>
              <option>3rd Period</option>
              <option>1st Inning</option>
              <option>2nd Inning</option>
              <option>3rd Inning</option>
              <option>4th Inning</option>
              <option>5th Inning</option>
              <option>6th Inning</option>
              <option>7th Inning</option>
              <option>8th Inning</option>
              <option>9th Inning</option>
              <option>Delayed</option>
              <option>Final</option>
              <option>Postponed</option>
            </TwitInput>
          </TwitInputGroup>
        </form>
      );
    }
  };

  return (
    <Popup
      show={show}
      onHide={onHide}
      heading={renderHeading()}
      body={renderBody()}
    />
  );
}

export default UpdateScorePopup;
