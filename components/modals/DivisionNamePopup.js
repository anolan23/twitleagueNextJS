import React, { useState } from "react";

import divisionNamePopupStyle from "../../sass/components/DivisionNamePopup.module.scss";
import { useFormik } from "formik";
import { updateDivision } from "../../actions";
import { mutate } from "swr";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import TwitForm from "../TwitForm";

function DivisionNamePopup({ show, onHide, division, league }) {
  const formik = useFormik({
    initialValues: {
      division_name: division.division_name ? division.division_name : "",
    },
    onSubmit: async (values) => {
      const updatedDivision = await updateDivision(division.id, values);
      const { divisions } = league;
      let updatedDivisions = [...divisions];
      const index = updatedDivisions.findIndex(
        (division) => division.id === updatedDivision.id
      );
      if (index === -1) {
      } else {
        updatedDivisions[index] = updatedDivision;
      }
      mutate(
        `/api/leagues/${league.league_name}`,
        {
          ...league,
          divisions: updatedDivisions,
        },
        false
      );
      onHide();
    },
  });

  const renderHeading = () => {
    return (
      <div className={divisionNamePopupStyle["division-name-popup__heading"]}>
        <div
          className={
            divisionNamePopupStyle["division-name-popup__heading__actions"]
          }
        >
          <TwitButton color="primary" form="division">
            Save
          </TwitButton>
        </div>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <div className={divisionNamePopupStyle["division-name-popup__body"]}>
        <TwitForm onSubmit={formik.handleSubmit} id="division">
          <TwitInputGroup labelText="Division name">
            <TwitInput
              type="text"
              value={formik.values.division_name}
              name="division_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </TwitInputGroup>
        </TwitForm>
      </div>
    );
  };

  return (
    <Popup
      show={show}
      heading={renderHeading()}
      body={renderBody()}
      onHide={onHide}
      title="Division"
    />
  );
}

export default DivisionNamePopup;
