import React from "react";

import { useFormik } from "formik";

import Popup from "./Popup";
import TwitButton from "../TwitButton";
import { updateUserProfile } from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import editProfilePopup from "../../sass/components/EditProfilePopup.module.scss";
import Profile from "../Profile";

function EditProfilePopup({ show, onHide }) {
  const formik = useFormik({
    initialValues: {
      avatar: "",
      name: "",
      bio: "",
      website: "",
      dob: "",
    },
    onSubmit: (values) => {
      updateUserProfile(values);
    },
  });

  const renderHeading = () => {
    return (
      <div className={editProfilePopup["edit-profile-popup__heading"]}>
        <TwitButton form="edit-profile-form" color="primary">
          Save
        </TwitButton>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form
        id="edit-profile-form"
        onSubmit={formik.handleSubmit}
        className={editProfilePopup["edit-profile-popup"]}
      >
        <Profile avatar={formik.values.avatar} banner={formik.values.banner} />
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
        <div className={twitForm["twit-form__group"]}>
          <label htmlFor="name" className={twitForm["twit-form__label"]}>
            Name
          </label>
          <input
            id="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            name="name"
            type="text"
            autoComplete="off"
            className={
              formik.errors.name && formik.touched.name
                ? twitForm["twit-form__input--errors"]
                : twitForm["twit-form__input"]
            }
          />
          {formik.errors.name && formik.touched.name ? (
            <div className={twitForm["twit-form__errors"]}>
              {formik.errors.name}
            </div>
          ) : null}
        </div>
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
        <div className={twitForm["twit-form__group"]}>
          <label htmlFor="website" className={twitForm["twit-form__label"]}>
            Website
          </label>
          <input
            id="website"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.website}
            name="website"
            type="text"
            autoComplete="off"
            className={
              formik.errors.website && formik.touched.website
                ? twitForm["twit-form__input--errors"]
                : twitForm["twit-form__input"]
            }
          />
          {formik.errors.website && formik.touched.website ? (
            <div className={twitForm["twit-form__errors"]}>
              {formik.errors.website}
            </div>
          ) : null}
        </div>
        <div className={twitForm["twit-form__group"]}>
          <label htmlFor="dob" className={twitForm["twit-form__label"]}>
            Birth Date
          </label>
          <input
            id="dob"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dob}
            name="dob"
            type="text"
            autoComplete="off"
            className={
              formik.errors.dob && formik.touched.dob
                ? twitForm["twit-form__input--errors"]
                : twitForm["twit-form__input"]
            }
          />
          {formik.errors.dob && formik.touched.dob ? (
            <div className={twitForm["twit-form__errors"]}>
              {formik.errors.dob}
            </div>
          ) : null}
        </div>
      </form>
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

export default EditProfilePopup;
