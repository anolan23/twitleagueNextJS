import React from "react";

import { useFormik } from "formik";

import Popup from "./Popup";
import TwitButton from "../TwitButton";
import { updateUserProfile } from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import editProfilePopup from "../../sass/components/EditProfilePopup.module.scss";
import Profile from "../Profile";
import TwitForm from "../TwitForm";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";

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
      <React.Fragment>
        <Profile avatar={formik.values.avatar} banner={formik.values.banner} />
        <TwitForm id="edit-profile-form" onSubmit={formik.handleSubmit}>
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
          <TwitInputGroup id="name" labelText="Name">
            <TwitInput
              id="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
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
          <TwitInputGroup id="website" labelText="Website">
            <TwitInput
              id="website"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.website}
              name="website"
            />
          </TwitInputGroup>
          <TwitInputGroup id="dob" labelText="Date of birth">
            <TwitInput
              id="dob"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dob}
              name="dob"
            />
          </TwitInputGroup>
        </TwitForm>
      </React.Fragment>
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
