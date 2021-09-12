import React, { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

import useUser from "../lib/useUser";
import TwitForm from "./TwitForm";
import TwitInputGroup from "./TwitInputGroup";
import TwitInput from "./TwitInput";
import TopBar from "./TopBar";
import TwitButton from "./TwitButton";
import AutoCompleteInput from "../components/modals/AutoCompleteInput";
import TwitDropdownItem from "../components/TwitDropdownItem";
import { createTeam } from "../actions";
import backend from "../lib/backend";

function CreateTeam(props) {
  const { user } = useUser();
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    teamName: Yup.string().required("Required").min(3).max(30),
    abbrev: Yup.string().required("Required").max(6),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    leagueName: Yup.string().required("Required"),
  });

  const validate = async (values) => {
    let errors = {};
    return backend.get(`/api/leagues/${values.leagueName}`).then((results) => {
      if (Object.keys(results.data).length === 0) {
        errors.leagueName = "You must join an active league";
      }
      return errors;
    });
  };

  const formik = useFormik({
    initialValues: {
      teamName: "",
      abbrev: "",
      leagueName: "",
      city: "",
      state: "",
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
    validate,
    validationSchema,
  });

  const onSubmit = async (values) => {
    await createTeam(user.id, values);
    router.push(`/teams/${values.abbrev.substring(1)}`);
  };

  const onAutoCompleteChange = async (event) => {
    formik.handleChange(event);
    const results = await backend.get("/api/leagues", {
      params: { leagueName: event.target.value },
    });
    setOptions(results.data);

    if (results.data.length > 0 && event.target.value) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const onDropdownItemClick = (option) => {
    formik.setFieldValue("leagueName", option.league_name);
    setShow(false);
  };

  const renderOptions = () => {
    return options.map((option, index) => {
      return (
        <TwitDropdownItem onClick={() => onDropdownItemClick(option)}>
          {option.league_name}
        </TwitDropdownItem>
      );
    });
  };

  return (
    <div className="create-team">
      <TopBar main="Create team" />
      <TwitForm onSubmit={formik.handleSubmit}>
        <TwitInputGroup id="teamName" labelText="Team name">
          <TwitInput
            id="teamName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.teamName}
            name="teamName"
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
            isError={formik.errors.abbrev && formik.touched.abbrev}
            errors={formik.errors.abbrev}
          />
        </TwitInputGroup>
        <TwitInputGroup id="leagueName" labelText="League name">
          <TwitInput
            autoComplete
            id="leagueName"
            onChange={onAutoCompleteChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.leagueName}
            name="leagueName"
            isError={formik.errors.leagueName && formik.touched.leagueName}
            errors={formik.errors.leagueName}
          >
            {renderOptions()}
          </TwitInput>
        </TwitInputGroup>
        <TwitInputGroup id="city" labelText="City">
          <TwitInput
            id="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.city}
            name="city"
            isError={formik.errors.city && formik.touched.city}
            errors={formik.errors.city}
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
            isError={formik.errors.state && formik.touched.state}
            errors={formik.errors.state}
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
