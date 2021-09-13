import React, { useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import useUser from "../lib/useUser";
import TopBar from "./TopBar";
import TwitButton from "./TwitButton";
import { createLeague } from "../actions";
import backend from "../lib/backend";
import Profile from "./Profile";
import TwitForm from "./TwitForm";
import TwitInputGroup from "./TwitInputGroup";
import TwitInput from "./TwitInput";

function CreateLeague() {
  const { user } = useUser();
  const router = useRouter();

  const validationSchema = Yup.object({
    sport: Yup.string().required("Required"),
  });

  const validate = async (values) => {
    let errors = {};
    if (!values.leagueName) {
      return (errors.leagueName = "Required");
    }
    return backend.get(`/api/leagues/${values.leagueName}`).then((results) => {
      if (Object.keys(results.data).length > 0) {
        errors.leagueName = "League already exists";
      }
      return errors;
    });
  };

  const formik = useFormik({
    initialValues: {
      leagueName: "",
      sport: "",
      avatar: "",
      banner: "",
      bio: "",
    },

    onSubmit: async (league) => {
      await createLeague(user.id, league);
      router.push(`/leagues/${league.leagueName}`);
    },
    validate,
    validationSchema,
  });

  return (
    <div className="create-team">
      <TopBar main="Create league" />
      <Profile banner={formik.values.banner} avatar={formik.values.avatar} />
      <TwitForm onSubmit={formik.handleSubmit}>
        <TwitInputGroup id="leagueName" labelText="League name">
          <TwitInput
            id="leagueName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.leagueName}
            name="leagueName"
            placeHolder="League name"
            isError={formik.errors.leagueName && formik.touched.leagueName}
            errors={formik.errors.leagueName}
          />
        </TwitInputGroup>
        <TwitInputGroup id="sport" labelText="Sport">
          <TwitInput
            select
            id="sport"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.sport}
            name="sport"
            placeHolder="Sport"
            isError={formik.errors.sport && formik.touched.sport}
            errors={formik.errors.sport}
          >
            <option value={null}>Choose</option>
            <option value="baseball">Baseball</option>
            <option value="basketball">Basketball</option>
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            <option value="hockey">Hockey</option>
            <option value="soccer">Soccer</option>
            <option value="other">Other</option>
          </TwitInput>
        </TwitInputGroup>
        <TwitInputGroup id="avatar" labelText="Avatar">
          <TwitInput
            id="avatar"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.avatar}
            name="avatar"
            placeHolder="Image url"
          />
        </TwitInputGroup>
        <TwitInputGroup id="banner" labelText="Banner">
          <TwitInput
            id="banner"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.banner}
            name="banner"
            placeHolder="Image url"
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
            placeHolder="Bio"
          />
        </TwitInputGroup>
        <TwitButton expanded color="primary" size="large">
          Create league
        </TwitButton>
      </TwitForm>
    </div>
  );
}

export default CreateLeague;
