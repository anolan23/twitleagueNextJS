import React from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { search, createTeam } from "../actions";
import useUser from "../lib/useUser";
import TwitForm from "./TwitForm";
import TwitInputGroup from "./TwitInputGroup";
import TwitInput from "./TwitInput";
import TopBar from "./TopBar";
import TwitButton from "./TwitButton";
import Profile from "./Profile";

function CreateTeam() {
  const { user } = useUser();
  const router = useRouter();

  const validationSchema = Yup.object({
    teamName: Yup.string().required("Required").min(3).max(30),
    abbrev: Yup.string().required("Required").max(6),
  });

  const formik = useFormik({
    initialValues: {
      teamName: "",
      abbrev: "",
      avatar: "",
      banner: "",
      bio: "",
      city: "",
      state: "",
    },
    onSubmit: async (team) => {
      await createTeam(user.id, team);
      router.push(`/teams/${team.abbrev.substring(1)}`);
    },
    validationSchema,
  });

  return (
    <div className="create-team">
      <TopBar main="Create team" />
      <Profile banner={formik.values.banner} avatar={formik.values.avatar} />
      <TwitForm onSubmit={formik.handleSubmit}>
        <TwitInputGroup id="teamName" labelText="Team name">
          <TwitInput
            id="teamName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.teamName}
            name="teamName"
            placeHolder="Team name"
            isError={formik.errors.teamName && formik.touched.teamName}
            errors={formik.errors.teamName}
          />
        </TwitInputGroup>
        <TwitInputGroup id="abbrev" labelText="Team abbrev">
          <TwitInput
            id="abbrev"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.abbrev}
            name="abbrev"
            placeHolder="Team abbrev"
            isError={formik.errors.abbrev && formik.touched.abbrev}
            errors={formik.errors.abbrev}
          />
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
        <TwitInputGroup id="city" labelText="City">
          <TwitInput
            id="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.city}
            name="city"
            placeHolder="City"
          />
        </TwitInputGroup>
        <TwitInputGroup id="state" labelText="State">
          <TwitInput
            id="state"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.state}
            name="state"
            placeHolder="State"
          />
        </TwitInputGroup>
        <TwitButton expanded color="primary" size="large">
          Create team
        </TwitButton>
      </TwitForm>
    </div>
  );
}

export default CreateTeam;
