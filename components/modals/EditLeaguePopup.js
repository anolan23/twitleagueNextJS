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
        <form
          id="edit-team-form"
          onSubmit={formik.handleSubmit}
          className={twitForm["twit-form"]}
        >
          <div className={twitForm["twit-form__group"]}>
            <label htmlFor="avatar" className={twitForm["twit-form__label"]}>
              Avatar URL
            </label>
            <input
              id="avatar"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.avatar}
              name="avatar"
              type="text"
              autoComplete="off"
              className={
                formik.errors.avatar && formik.touched.avatar
                  ? twitForm["twit-form__input--errors"]
                  : twitForm["twit-form__input"]
              }
            />
            {formik.errors.avatar && formik.touched.avatar ? (
              <div className={twitForm["twit-form__errors"]}>
                {formik.errors.avatar}
              </div>
            ) : null}
          </div>
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
          <div className={twitForm["twit-form__group"]}>
            <label htmlFor="bio" className={twitForm["twit-form__label"]}>
              Bio
            </label>
            <input
              id="bio"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              name="bio"
              type="text"
              autoComplete="off"
              className={
                formik.errors.bio && formik.touched.bio
                  ? twitForm["twit-form__input--errors"]
                  : twitForm["twit-form__input"]
              }
            />
            {formik.errors.bio && formik.touched.bio ? (
              <div className={twitForm["twit-form__errors"]}>
                {formik.errors.bio}
              </div>
            ) : null}
          </div>
        </form>
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
