import React, { useEffect } from "react";
import { useFormik } from "formik";

import Popup from "./Popup";
import TwitButton from "../TwitButton";
import { updateTeamById } from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import editProfilePopup from "../../sass/components/EditProfilePopup.module.scss";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import Profile from "../Profile";

function EditTeamPopup({ team, show, onHide }) {
  if (!show) {
    return null;
  }
  const formik = useFormik({
    initialValues: {
      team_name: team.team_name ? team.team_name : "",
      avatar: team.avatar ? team.avatar : "",
      banner: team.banner ? team.banner : "",
      bio: team.bio ? team.bio : "",
    },
    onSubmit: (values) => {
      updateTeamById(team.id, values);
    },
  });

  useEffect(() => {
    formik.resetForm(formik.initialValues);
    console.log("mount");
  }, []);

  const renderHeading = () => {
    return (
      <div className={editProfilePopup["edit-profile-popup__heading"]}>
        <TwitButton form="edit-team-form" color="primary">
          Save
        </TwitButton>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className={editProfilePopup["edit-profile-popup"]}>
        <Profile avatar={formik.values.avatar} banner={formik.values.banner} />
        <form
          id="edit-team-form"
          onSubmit={formik.handleSubmit}
          className={twitForm["twit-form"]}
        >
          <TwitInputGroup id="teamName" labelText="Team name">
            <TwitInput
              id="team_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              value={formik.values.team_name}
              name="team_name"
            />
          </TwitInputGroup>
          <TwitInputGroup id="avatar" labelText="Avatar URL">
            <TwitInput
              id="avatar"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              value={formik.values.avatar}
              name="avatar"
            />
          </TwitInputGroup>
          <TwitInputGroup id="banner" labelText="Banner URL">
            <TwitInput
              id="banner"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.banner}
              name="banner"
            />
          </TwitInputGroup>
          <TwitInputGroup id="bio" labelText="Bio">
            <TwitInput
              id="bio"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              value={formik.values.bio}
              name="bio"
            />
          </TwitInputGroup>
        </form>
      </div>
    );
  };

  return (
    <Popup
      show={show}
      onHide={onHide}
      heading={renderHeading()}
      body={renderForm()}
    />
  );
}

export default EditTeamPopup;
