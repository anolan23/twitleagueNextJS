import React, { useEffect, useState } from "react";

import { useFormik } from "formik";

import Popup from "./Popup";
import TwitButton from "../TwitButton";
import { updateLeagueByName } from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import editProfilePopup from "../../sass/components/EditProfilePopup.module.scss";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import Profile from "../Profile";
import TwitForm from "../TwitForm";

function EditLeaguePopup(props) {
  const { league } = props;

  useEffect(() => {
    formik.setFieldValue("avatar", league.avatar ? league.avatar : "");
    formik.setFieldValue("banner", league.banner ? league.banner : "");
    formik.setFieldValue("bio", league.bio ? league.bio : "");
  }, [league.id]);

  const formik = useFormik({
    initialValues: {
      avatar: league.avatar ? league.avatar : "",
      banner: league.banner ? league.banner : "",
      bio: league.bio ? league.bio : "",
    },
    onSubmit: (values) => {
      updateLeagueByName(league.league_name, values);
    },
  });

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
        <TwitForm id="edit-team-form" onSubmit={formik.handleSubmit}>
          <TwitInputGroup id="avatar" labelText="Avatar URL">
            <TwitInput
              id="avatar"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              name="bio"
            />
          </TwitInputGroup>
        </TwitForm>
      </div>
    );
  };

  return (
    <Popup
      show={props.show}
      onHide={props.onHide}
      heading={renderHeading()}
      body={renderForm()}
    />
  );
}

export default EditLeaguePopup;
